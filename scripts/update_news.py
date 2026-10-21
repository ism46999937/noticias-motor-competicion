#!/usr/bin/env python3
"""Fetch short headlines from the FIA's public RSS feed.

Only the headline, source, date and canonical article link are published. No
full article text is copied. Unclassified stories are ignored so that the
site's championship filters remain meaningful.
"""
import json
import re
import urllib.request
import xml.etree.ElementTree as ET
from datetime import datetime, timezone
from email.utils import parsedate_to_datetime
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
DATA_FILE = ROOT / "data" / "site-data.json"
FEED_URL = "https://www.fia.com/rss/news"
HEADERS = {"User-Agent": "NoticiasMotorCompeticion/1.0 (+GitHub Actions)", "Accept": "application/rss+xml, application/xml, text/xml"}

def text_for(node, names):
    for name in names:
        el = node.find(name)
        if el is not None and el.text:
            return el.text.strip()
    return ""

def clean(value):
    return re.sub(r"\s+", " ", value or "").strip()

def category(title, description=""):
    # Classify by the headline itself, not the broad feed description,
    # which can mention unrelated championships and cause false labels.
    value = (title or "").lower()
    if re.search(r"\b(wec|world endurance|hypercar|lmgt3|le mans|1812 ?km|6 hours of (imola|spa|bahrain|fuji|são paulo))\b", value):
        return "WEC"
    if re.search(r"\b(formula 3|formula three|fia f3|f3 championship|f3)\b", value):
        return "F3"
    if re.search(r"\b(formula 2|formula two|fia f2|f2 championship|f2)\b", value):
        return "F2"
    if re.search(r"\b(formula 1|formula one|fia f1|f1 world championship|f1|grand prix)\b", value):
        return "F1"
    return None

def main():
    request = urllib.request.Request(FEED_URL, headers=HEADERS)
    try:
        with urllib.request.urlopen(request, timeout=12) as response:
            root = ET.fromstring(response.read(2_000_000))
    except Exception as exc:
        print(f"FIA RSS unavailable; keeping existing headlines: {exc}")
        return

    items = root.findall(".//item")
    if not items:
        print("FIA RSS contained no items; keeping existing headlines.")
        return

    headlines = []
    seen = set()
    for item in items:
        title = clean(text_for(item, ["title"]))
        url = clean(text_for(item, ["link"]))
        description = clean(text_for(item, ["description"]))
        if not title or not url or url in seen:
            continue
        series = category(title, description)
        if not series:
            continue
        seen.add(url)
        raw_date = text_for(item, ["pubDate"])
        try:
            date = parsedate_to_datetime(raw_date).astimezone(timezone.utc).isoformat() if raw_date else ""
        except (TypeError, ValueError, OverflowError):
            date = ""
        headlines.append({
            "series": series,
            "source": "FIA",
            "date": date[:10],
            "title": title,
            "summary": "Titular de la fuente oficial. Abre el enlace para leer el comunicado original.",
            "url": url,
        })
        if len(headlines) >= 24:
            break

    if not headlines:
        print("No FIA RSS items matched F1/F2/F3/WEC; keeping existing headlines.")
        return
    payload = json.loads(DATA_FILE.read_text(encoding="utf-8"))
    old = payload.get("news", [])
    if old == headlines:
        print("News unchanged; no commit needed.")
        return
    payload["news"] = headlines
    payload["newsUpdatedAt"] = datetime.now(timezone.utc).isoformat()
    DATA_FILE.write_text(json.dumps(payload, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"Updated {len(headlines)} headlines from FIA RSS.")

if __name__ == "__main__":
    main()
