#!/usr/bin/env python3
"""Fetch F1 standings from the Jolpica Ergast-compatible public API.

If the API has not published the current season yet or is unavailable, this
script exits successfully without replacing the last known data.
"""
import json
import os
import urllib.request
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
DATA_FILE = ROOT / "data" / "site-data.json"
BASE = os.environ.get("JOLPICA_BASE_URL", "https://api.jolpi.ca/ergast/f1/2026")
HEADERS = {"User-Agent": "NoticiasMotorCompeticion/1.0 (+GitHub Actions)"}

def fetch(path):
    request = urllib.request.Request(f"{BASE}/{path}.json?limit=100", headers=HEADERS)
    with urllib.request.urlopen(request, timeout=20) as response:
        return json.loads(response.read().decode("utf-8"))

def first_list(payload, key):
    lists = payload.get("MRData", {}).get("StandingsTable", {}).get("StandingsLists", [])
    return lists[0].get(key, []) if lists else []

def main():
    try:
        drivers = first_list(fetch("driverStandings"), "DriverStandings")
        constructors = first_list(fetch("constructorStandings"), "ConstructorStandings")
    except Exception as exc:
        print(f"F1 standings API unavailable; keeping existing data: {exc}")
        return
    if not drivers or not constructors:
        print("The API has no 2026 standings yet; keeping existing data.")
        return
    driver_rows = []
    for row in drivers:
        driver = row.get("Driver", {})
        name = " ".join(filter(None, [driver.get("givenName"), driver.get("familyName")]))
        teams = row.get("Constructors", [])
        driver_rows.append({
            "position": int(row.get("position", len(driver_rows) + 1)),
            "name": name or "Unknown driver",
            "team": teams[0].get("name", "—") if teams else "—",
            "points": row.get("points", "—"),
        })
    team_rows = []
    for row in constructors:
        constructor = row.get("Constructor", {})
        team_rows.append({
            "position": int(row.get("position", len(team_rows) + 1)),
            "name": constructor.get("name", "Unknown constructor"),
            "team": constructor.get("nationality", "—"),
            "points": row.get("points", "—"),
        })
    payload = json.loads(DATA_FILE.read_text(encoding="utf-8"))
    new_standings = {"drivers": driver_rows, "teams": team_rows}
    if payload.get("standings", {}).get("F1") == new_standings:
        print("F1 standings unchanged; no commit needed.")
        return
    payload.setdefault("standings", {})["F1"] = new_standings
    payload["updatedAt"] = datetime.now(timezone.utc).isoformat()
    DATA_FILE.write_text(json.dumps(payload, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"Updated F1 standings: {len(driver_rows)} drivers, {len(team_rows)} constructors.")

if __name__ == "__main__":
    main()
