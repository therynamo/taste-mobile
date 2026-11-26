# Changelog

## 0.1.0 (2026-11-26)

First public version.

- **Dealer** (`scripts/deal.mjs`): 14 app kinds, 16 directions ready to deal, three hands per
  deal, category modules attached by kind, and a `MOBILE-DESIGN.md` template for the commitments.
- **Lint** (`scripts/lint.mjs`): rules for motion, haptics, sound, tells, money, accessibility
  and platform, with reasoned waivers.
- **Capture** (`scripts/capture.mjs`): drives a booted iOS simulator through every screen in
  light, dark and the largest text size, with pixel checks and optional accessibility-tree checks.
- **Gate** (`scripts/gate.mjs`): `GATE: PASS`, `FAIL` or `OPEN`, three rounds at most.
- **References**: iOS, Android, stacks, motion, haptics and sound, assets, directions, tells,
  verification, and six modules (money, crypto, chat and AI, sports, fitness, feed).

Not in this version: a benchmark, an Android capture run, and directions that need on-device
recordings (eight are held back).
