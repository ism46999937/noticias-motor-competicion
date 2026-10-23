#!/usr/bin/env python3
"""Fetch official FIA and MotoGP.com headlines for the homepage.

Only short headlines, the listing-page summary, source, date and canonical
article link are published. Article text is not copied. Each source updates
only the categories it returned successfully, preserving the last known items
for categories that are temporarily absent from a feed.
"""
import html
import json
import re
import urllib.request
import xml.etree.ElementTree as ET
from datetime import datetime, timezone
from email.utils import parsedate_to_datetime
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
DATA_FILE = ROOT / "data" / "site-data.json"
FIA_FEED_URL = "https://www.fia.com/rss/news"
MOTOGP_NEWS_URL = "https://www.motogp.com/en/news"
HEADERS = {
    "User-Agent": "Mozilla/5.0 (compatible; NoticiasMotorCompeticion/1.0; +https://github.com/ism46999937/noticias-motor-competicion)",
    "Accept": "text/html,application/rss+xml,application/xml,text/xml",
}
MAX_PER_SERIES = 12


def clean(value):
    value = html.unescape(re.sub(r"<[^>]+>", " ", value or ""))
    return re.sub(r"\s+", " ", value).strip()


def text_for(node, names):
    for name in names:
        el = node.find(name)
        if el is not None and el.text:
            return el.text.strip()
    return ""


def fia_category(title):
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


def fetch_fia_headlines():
    request = urllib.request.Request(FIA_FEED_URL, headers=HEADERS)
    with urllib.request.urlopen(request, timeout=20) as response:
        root = ET.fromstring(response.read())

    headlines = []
    seen = set()
    for item in root.findall(".//item"):
        title = clean(text_for(item, ["title"]))
        url = clean(text_for(item, ["link"]))
        series = fia_category(title)
        if not title or not url or url in seen or not series:
            continue
        seen.add(url)
        raw_date = text_for(item, ["pubDate"])
        try:
            date = parsedate_to_datetime(raw_date).astimezone(timezone.utc).date().isoformat() if raw_date else ""
        except (TypeError, ValueError, OverflowError):
            date = ""
        headlines.append({
            "series": series,
            "source": "FIA",
            "date": date,
            "title": title,
            "summary": "Titular de la fuente oficial. Abre el enlace para leer el comunicado original.",
            "url": url,
        })
        if len(headlines) >= 48:
            break
    return headlines


def decode_page(response):
    charset = response.headers.get_content_charset() or "utf-8"
    return response.read().decode(charset, errors="replace")


def extract_card(block):
    href = re.search(r'<a\b[^>]*class="[^"]*content-item__link[^"]*"[^>]*href="([^"]+)"', block, re.I | re.S)
    # Some page revisions put href before the CSS class.
    if not href:
        href = re.search(r'<a\b[^>]*href="([^"]+)"[^>]*>', block, re.I | re.S)
    title = re.search(r'<h3\b[^>]*class="[^"]*content-item__title[^"]*"[^>]*>(.*?)</h3>', block, re.I | re.S)
    summary = re.search(r'<p\b[^>]*class="[^"]*content-item__description[^"]*"[^>]*>(.*?)</p>', block, re.I | re.S)
    date = re.search(r'<time\b[^>]*data-date="([^"]+)"', block, re.I | re.S)
    if not href or not title:
        return None
    raw_date = clean(date.group(1)) if date else ""
    try:
        published = datetime.strptime(raw_date, "%b %d, %Y").date().isoformat()
    except ValueError:
        try:
            published = datetime.strptime(raw_date, "%d %b %Y").date().isoformat()
        except ValueError:
            published = ""
    url = html.unescape(href.group(1))
    if url.startswith("/"):
        url = "https://www.motogp.com" + url
    return {
        "date": published,
        "title": clean(title.group(1)),
        "summary": clean(summary.group(1)) if summary else "",
        "url": url,
    }


def normalized(value):
    value = html.unescape(value or "").lower().replace("’", "'")
    return re.sub(r"[^a-z0-9]+", " ", value).strip()


def classify_moto23(title, summary, payload):
    text = normalized(title + " " + summary)
    if re.search(r"\bmoto\s*3\b|\bmoto3\b", text):
        return "Moto3"
    if re.search(r"\bmoto\s*2\b|\bmoto2\b", text):
        return "Moto2"

    # The official page combines Moto2 and Moto3 in one rail. Match known
    # riders to their current championship to avoid assigning mixed stories.
    matches = set()
    for series in ("Moto2", "Moto3"):
        for rider in (payload.get("standings", {}).get(series, {}).get("drivers") or []):
            name = normalized(rider.get("name", ""))
            rider_keys = {name}
            if name and len(name.split()) > 1:
                rider_keys.add(name.split()[-1])
            if any(key and re.search(r"\b" + re.escape(key) + r"\b", text) for key in rider_keys):
                matches.add(series)
        for team in (payload.get("lineups", {}).get(series, {}).get("teams") or []):
            for rider_name in team.get("drivers", []):
                name = normalized(rider_name)
                if name and re.search(r"\b" + re.escape(name) + r"\b", text):
                    matches.add(series)
    return next(iter(matches)) if len(matches) == 1 else None


def fetch_motogp_headlines(payload):
    request = urllib.request.Request(MOTOGP_NEWS_URL, headers=HEADERS)
    with urllib.request.urlopen(request, timeout=25) as response:
        page = decode_page(response)

    headings = list(re.finditer(r"<h2\b[^>]*>(.*?)</h2>", page, re.I | re.S))
    blocks = list(re.finditer(r'<li\b(?=[^>]*class="[^"]*\bcontent-item\b)[^>]*>.*?</li>', page, re.I | re.S))
    if not headings or not blocks:
        raise ValueError("MotoGP.com news page did not contain the expected article listing")

    articles = {"MotoGP": [], "Moto2": [], "Moto3": []}
    found_rails = set()
    for index, heading in enumerate(headings):
        title = normalized(clean(heading.group(1)))
        if "latest motogp" in title and "news" in title:
            rail = "MotoGP"
        elif "latest moto2" in title and "moto3" in title and "news" in title:
            rail = "Moto2-Moto3"
        else:
            continue
        found_rails.add(rail)
        end = headings[index + 1].start() if index + 1 < len(headings) else len(page)
        rail_blocks = [block for block in blocks if heading.end() < block.start() < end]
        for block in rail_blocks:
            article = extract_card(block.group(0))
            if not article:
                continue
            series = rail if rail == "MotoGP" else classify_moto23(article["title"], article["summary"], payload)
            if series == "Moto2-Moto3":
                continue
            if not series:
                continue
            article.update({"series": series, "source": "MotoGP.com"})
            articles[series].append(article)

    if not found_rails:
        raise ValueError("MotoGP.com news page layout changed; expected news sections were not found")
    for series in articles:
        unique = {}
        for item in articles[series]:
            unique.setdefault(item["url"], item)
        articles[series] = sorted(unique.values(), key=lambda item: item["date"], reverse=True)[:MAX_PER_SERIES]
    return articles


def merge_updates(previous, updates):
    # Replace only series with a non-empty, successfully parsed update.
    replaced = {series for series, items in updates.items() if items}
    merged = [item for item in previous if item.get("series") not in replaced]
    for items in updates.values():
        merged.extend(items)
    deduplicated = {}
    for item in merged:
        deduplicated.setdefault(item.get("url") or item.get("title"), item)
    result = sorted(deduplicated.values(), key=lambda item: item.get("date", ""), reverse=True)
    counts = {}
    limited = []
    for item in result:
        series = item.get("series", "")
        if counts.get(series, 0) >= MAX_PER_SERIES:
            continue
        limited.append(item)
        counts[series] = counts.get(series, 0) + 1
    return limited


def main():
    payload = json.loads(DATA_FILE.read_text(encoding="utf-8"))
    previous = payload.get("news", [])
    updates = {}
    successful_sources = []

    try:
        fia = fetch_fia_headlines()
        for series in {item["series"] for item in fia}:
            updates[series] = [item for item in fia if item["series"] == series]
        successful_sources.append("FIA")
        print(f"FIA RSS checked; {len(fia)} matching headlines found.")
    except Exception as exc:
        print(f"FIA RSS unavailable; preserving its current headlines: {exc}")

    try:
        moto = fetch_motogp_headlines(payload)
        for series, items in moto.items():
            if items:
                updates[series] = items
        successful_sources.append("MotoGP.com")
        print("MotoGP.com checked; " + ", ".join(f"{series}: {len(items)}" for series, items in moto.items()))
    except Exception as exc:
        print(f"MotoGP.com unavailable; preserving its current headlines: {exc}")

    if not successful_sources:
        print("All news sources failed; site data left unchanged.")
        return

    checked_at = datetime.now(timezone.utc).isoformat()
    payload["news"] = merge_updates(previous, updates)
    payload["newsCheckedAt"] = checked_at
    if payload["news"] != previous:
        payload["newsUpdatedAt"] = checked_at
    DATA_FILE.write_text(json.dumps(payload, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"Saved {len(payload['news'])} headlines from {', '.join(successful_sources)}.")


if __name__ == "__main__":
    main()
