#!/usr/bin/env python3
"""Fetch public App Store screenshots for the art-direction corpus.

Usage: appstore_shots.py APPS_TSV OUT_DIR [--max N] [--width W] [--only SLUG,...]

APPS_TSV columns (tab-separated, '#' comments allowed):
  slug  search_term  seller_substring  [track_id]

For each app this resolves the App Store listing (by track_id if given, else
by searching and matching seller_substring case-insensitively), writes
OUT_DIR/<slug>/meta.json, and downloads up to N iPhone screenshots resized to
W px wide (mzstatic `{W}x0w.jpg`). Apps that don't resolve are listed in
OUT_DIR/_unresolved.tsv.

Screenshots are store marketing images: framed, captioned and curated. Treat
them as evidence of the app's intended look, not of every screen.
"""
import json
import sys
import time
import urllib.parse
import urllib.request
from pathlib import Path

API = "https://itunes.apple.com"
UA = {"User-Agent": "mobile-taste-corpus/0.1"}


def get_json(url):
    for attempt in range(4):
        try:
            req = urllib.request.Request(url, headers=UA)
            with urllib.request.urlopen(req, timeout=30) as r:
                return json.load(r)
        except Exception as e:  # rate limits surface as 403/429
            if attempt == 3:
                raise
            time.sleep(3 * (attempt + 1))


def resolve(term, seller, track_id):
    if track_id:
        res = get_json(f"{API}/lookup?id={track_id}&country=us")["results"]
        return res[0] if res else None
    q = urllib.parse.quote(term)
    res = get_json(f"{API}/search?term={q}&entity=software&country=us&limit=10")["results"]
    seller = seller.lower()
    for r in res:
        if seller in r.get("sellerName", "").lower() or seller in r.get("artistName", "").lower():
            return r
    return None


def resize(url, width):
    base = url.rsplit("/", 1)[0]
    return f"{base}/{width}x0w.jpg"


def main():
    args = sys.argv[1:]
    if len(args) < 2:
        sys.exit(__doc__)
    tsv, out = Path(args[0]), Path(args[1])
    max_n = int(args[args.index("--max") + 1]) if "--max" in args else 6
    width = int(args[args.index("--width") + 1]) if "--width" in args else 600
    only = set(args[args.index("--only") + 1].split(",")) if "--only" in args else None
    out.mkdir(parents=True, exist_ok=True)
    unresolved = []
    for line in tsv.read_text().splitlines():
        if not line.strip() or line.startswith("#"):
            continue
        cols = line.split("\t")
        slug, term, seller = cols[0], cols[1], cols[2]
        track_id = cols[3] if len(cols) > 3 and cols[3].strip() else None
        if only and slug not in only:
            continue
        try:
            r = resolve(term, seller, track_id)
        except Exception as e:
            unresolved.append(f"{slug}\t{term}\terror: {e}")
            continue
        if not r:
            unresolved.append(f"{slug}\t{term}\tno match for seller '{seller}'")
            continue
        d = out / slug
        d.mkdir(exist_ok=True)
        shots = r.get("screenshotUrls", [])[:max_n]
        meta = {k: r.get(k) for k in (
            "trackId", "trackName", "sellerName", "version",
            "currentVersionReleaseDate", "primaryGenreName", "trackViewUrl")}
        meta["screenshotCount"] = len(r.get("screenshotUrls", []))
        meta["files"] = []
        for i, u in enumerate(shots, 1):
            dest = d / f"{i:02d}.jpg"
            if not dest.exists():
                req = urllib.request.Request(resize(u, width), headers=UA)
                with urllib.request.urlopen(req, timeout=60) as resp:
                    dest.write_bytes(resp.read())
            meta["files"].append(dest.name)
        (d / "meta.json").write_text(json.dumps(meta, indent=2))
        print(f"{slug}: {meta['trackName']} | {meta['sellerName']} | v{meta['version']} | {len(shots)} shots")
        time.sleep(1.5)
    (out / "_unresolved.tsv").write_text("\n".join(unresolved) + ("\n" if unresolved else ""))
    print(f"unresolved: {len(unresolved)}")


if __name__ == "__main__":
    main()
