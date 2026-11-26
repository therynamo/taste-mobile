# /// script
# requires-python = ">=3.11"
# dependencies = ["pillow>=10"]
# ///
"""Measure dominant colours in each app's screenshots.

Usage: uv run tools/palette.py SCREENS_DIR

For every SCREENS_DIR/<slug>/NN.jpg this quantizes the image to 8 colours and
records each colour's hex and share of pixels, plus mean luminance. Results go
to SCREENS_DIR/<slug>/palette.json. Store screenshots include marketing
backgrounds and captions, so read these as evidence alongside the image, not
as the app's tokens.
"""
import json
import sys
from pathlib import Path

from PIL import Image


def analyse(path):
    im = Image.open(path).convert("RGB")
    im.thumbnail((300, 650))
    q = im.quantize(colors=8, method=Image.Quantize.MEDIANCUT)
    pal = q.getpalette()
    counts = sorted(q.getcolors(), reverse=True)
    total = sum(c for c, _ in counts)
    colours = []
    for c, idx in counts:
        r, g, b = pal[idx * 3: idx * 3 + 3]
        colours.append({"hex": f"#{r:02x}{g:02x}{b:02x}", "share": round(c / total, 3)})
    grey = im.convert("L")
    lum = sum(grey.getdata()) / (grey.width * grey.height) / 255
    return {"file": path.name, "mean_luminance": round(lum, 3), "colours": colours}


def main():
    root = Path(sys.argv[1])
    for d in sorted(p for p in root.iterdir() if p.is_dir()):
        shots = sorted(d.glob("[0-9][0-9].jpg"))
        if not shots:
            continue
        res = [analyse(s) for s in shots]
        (d / "palette.json").write_text(json.dumps(res, indent=1))
        print(d.name, " ".join(c["hex"] for c in res[0]["colours"][:4]))


if __name__ == "__main__":
    main()
