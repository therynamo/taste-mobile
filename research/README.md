# Corpus

The evidence behind the directions the skill deals. Notes only: no app screenshots are stored here.

| Path | What it is |
|---|---|
| `corpus/apps.tsv` | The 114 apps studied, grouped by slice |
| `corpus/visual/<app>.json` | One record per app: type, palette, shape, density, navigation, imagery, the tells present, and which direction it fits |
| `corpus/directions.json` | Every direction found, with its status and the apps it was seen in |
| `tools/appstore_shots.py` | Fetches an app's public App Store screenshots into a local cache for study |
| `tools/palette.py` | Reads dominant colours from a cached screenshot |

## How a direction becomes ready

1. An app's App Store screenshots are read and recorded as a visual note.
2. Apps that share a signature are grouped into a direction.
3. A direction is **ready** when its signature is visible on screen in apps from at least two
   different makers. Otherwise it is **held**, with the captures that would settle it listed.
4. Patterns worth avoiding are kept as **anti-references** and are never dealt.

Result: 16 ready, 8 held, 7 anti-references, 2 platform overlays, 5 dropped.

## Limits

- Store screenshots are marketing images: framed, captioned and curated. About a quarter were
  out of date when studied. They show an app's intended look, not every screen.
- Stills cannot show motion, haptics or sound. Those notes come from documentation and written
  accounts, and are marked text-sourced.
- Hex values in the notes were sampled from compressed images and are approximate.
- App names say where a pattern was seen. This project is not affiliated with any of them.

The skill reads its own copy of the directions at `skills/taste-mobile/data/directions.json`.
