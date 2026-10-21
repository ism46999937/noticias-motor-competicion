#!/usr/bin/env python3
"""Synchronize 2026 standings from official FIA/F1 championship pages.

Only replace a championship snapshot when its source returns a plausible,
non-empty table. On errors, retain the last verified snapshot.
"""
import json
import re
import urllib.request
from datetime import datetime, timezone
from html.parser import HTMLParser
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
DATA_FILE = ROOT / "data" / "site-data.json"
HEADERS = {"User-Agent": "Mozilla/5.0 (compatible; NoticiasMotorCompeticion/1.0; +https://github.com/ism46999937/noticias-motor-competicion)"}
SOURCES = {
    "F1": "https://www.fia.com/events/fia-formula-one-world-championship/season-2026/2026-classifications",
    "F2": "https://www.fia.com/events/formula-2-championship/season-2026/standings",
    "F3": "https://www.fia.com/events/fia-formula-3-championship/season-2026/2026-standings",
    "WEC": "https://www.fiawec.com/en/page/manufacturers-classification",
}

def fetch(url):
    req = urllib.request.Request(url, headers=HEADERS)
    with urllib.request.urlopen(req, timeout=35) as response:
        return response.read().decode("utf-8", "replace")

class TableParser(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.tables, self.headings = [], []
        self.in_table = False
        self.table = None
        self.row = None
        self.cell = None
        self.cell_tag = None
        self.in_heading = False
        self.heading = ""
        self.current_heading = ""
        self.tag_stack = []

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if tag in ("h1", "h2", "h3", "h4"):
            self.in_heading = True
            self.heading = ""
        if tag == "table":
            self.in_table = True
            self.table = {"heading": self.current_heading, "rows": []}
        elif self.in_table and tag == "tr":
            self.row = []
        elif self.in_table and tag in ("td", "th"):
            self.cell = ""
            self.cell_tag = tag
        self.tag_stack.append(tag)

    def handle_data(self, data):
        value = data.strip()
        if self.in_heading and value:
            self.heading += " " + value
        if self.in_table and self.cell is not None:
            self.cell += " " + value

    def handle_endtag(self, tag):
        if self.in_table and tag in ("td", "th") and self.cell is not None:
            self.row.append(" ".join(self.cell.split()))
            self.cell = None
            self.cell_tag = None
        elif self.in_table and tag == "tr" and self.row is not None:
            if self.row:
                self.table["rows"].append(self.row)
            self.row = None
        elif tag == "table" and self.in_table:
            self.tables.append(self.table)
            self.table = None
            self.in_table = False
        if tag in ("h1", "h2", "h3", "h4") and self.in_heading:
            self.current_heading = " ".join(self.heading.split())
            self.headings.append(self.current_heading)
            self.in_heading = False
        if self.tag_stack:
            self.tag_stack.pop()

def tables_from(html):
    parser = TableParser()
    parser.feed(html)
    return parser.tables

def number(value):
    match = re.search(r"(?<!\d)(\d+(?:\.\d+)?)(?:\s*(?:pts?|points?))?\s*$", value.replace(",", ""))
    return float(match.group(1)) if match else None

def clean_name(value):
    return re.sub(r"\s+", " ", re.sub(r"Image\s+(USA|GBR|BRA|ITA|FRA|NED|ESP|JPN|SUI|FIN|AUS|DEN|GER|AUT|NZL|IRL|BUL|POL|SWE|NOR|MEX|ARG|CAN|THA|KOR|SRI)\b", "", value)).strip()

def normal_rows(table, series, kind):
    rows = []
    for cells in table["rows"]:
        if len(cells) < 3 or not re.fullmatch(r"\d{1,2}", cells[0].strip()):
            continue
        position = int(cells[0])
        points = number(cells[-1])
        if points is None:
            continue
        # Official FIA tables have driver/team names in column 2; WEC has
        # manufacturer, car number, team/driver, race points and total points.
        if kind == "teams":
            name = clean_name(cells[3]) if series == "WEC" and len(cells) >= 6 else clean_name(cells[1])
            team = name
        elif series == "WEC" and len(cells) >= 6:
            name = clean_name(cells[3])
            team = " ".join(x for x in (clean_name(cells[1]), clean_name(cells[2])) if x)
        else:
            name = clean_name(cells[1])
            team = "—"
        if not name:
            continue
        rows.append({"position": position, "name": name, "team": team or "—", "points": int(points) if float(points).is_integer() else points})
    return rows

def parse_fia_series(series, url):
    tables = tables_from(fetch(url))
    driver_rows, team_rows = [], []
    for table in tables:
        heading = (table.get("heading") or "").lower()
        first = " ".join(table["rows"][0]).lower() if table["rows"] else ""
        is_team = "team" in heading or "teams" in first or "manufacturer" in heading or "manufacturers" in first
        is_driver = "driver" in heading or "drivers" in first
        if not (is_team or is_driver):
            continue
        rows = normal_rows(table, series, "teams" if is_team else "drivers")
        if len(rows) < 3:
            continue
        if is_team and not team_rows:
            team_rows = rows
        elif is_driver and not driver_rows:
            driver_rows = rows
    if len(driver_rows) < 3 or len(team_rows) < 3:
        raise ValueError(f"{series}: standings table missing or implausible (drivers={len(driver_rows)}, teams={len(team_rows)})")
    return {"drivers": driver_rows, "teams": team_rows}

def parse_wec(url):
    tables = tables_from(url)
    parsed_tables = []
    for table in tables:
        rows = table.get("rows", [])
        if len(rows) < 4:
            continue
        header = " ".join(rows[0]).lower()
        kind = "drivers" if "drivers" in header else ("teams" if "team" in header else ("manufacturers" if "manufacturer" in header else None))
        if not kind:
            continue
        parsed = normal_rows(table, "WEC", "teams" if kind in ("teams", "manufacturers") else "drivers")
        if len(parsed) >= 3:
            parsed_tables.append((kind, parsed))
    # The official page orders the tables as Hypercar manufacturers, Hypercar
    # drivers, LMGT3 teams, LMGT3 drivers. Validate table sizes before publishing.
    if len(parsed_tables) < 4:
        raise ValueError(f"WEC: expected four official classification tables; found {len(parsed_tables)}")
    return {
        "Hypercar": {"drivers": parsed_tables[1][1], "teams": parsed_tables[0][1]},
        "LMGT3": {"drivers": parsed_tables[3][1], "teams": parsed_tables[2][1]},
    }

def main():
    payload = json.loads(DATA_FILE.read_text(encoding="utf-8"))
    payload.setdefault("standings", {})
    successes = []
    errors = []
    try:
        payload["standings"]["F1"] = {
            "drivers": normal_rows(tables_from(fetch(SOURCES["F1"]["drivers"]))[0], "F1", "drivers"),
            "teams": normal_rows(tables_from(fetch(SOURCES["F1"]["teams"]))[0], "F1", "teams"),
        }
        if len(payload["standings"]["F1"]["drivers"]) < 5 or len(payload["standings"]["F1"]["teams"]) < 5:
            raise ValueError("F1 source did not return a full standings table")
        payload.setdefault("standingsSources", {})["F1"] = SOURCES["F1"]["drivers"]
        successes.append("F1")
    except Exception as exc:
        errors.append(f"F1: {exc}")
    for series in ("F2", "F3"):
        try:
            payload["standings"][series] = parse_fia_series(series, SOURCES[series])
            payload.setdefault("standingsSources", {})[series] = SOURCES[series]
            successes.append(series)
        except Exception as exc:
            errors.append(f"{series}: {exc}")
    try:
        payload["standings"]["WEC"] = parse_wec(SOURCES["WEC"])
        payload.setdefault("standingsSources", {})["WEC"] = SOURCES["WEC"]
        successes.append("WEC")
    except Exception as exc:
        errors.append(f"WEC: {exc}")
    if successes:
        now = datetime.now(timezone.utc).isoformat()
        payload["updatedAt"] = now
        payload["standingsUpdatedAt"] = {s: now for s in successes}
        DATA_FILE.write_text(json.dumps(payload, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print("Standings updated: " + (", ".join(successes) if successes else "none"))
    for error in errors:
        print("WARNING " + error)
    if not successes:
        raise SystemExit("No standings source produced valid data; existing JSON was preserved.")

if __name__ == "__main__":
    main()
