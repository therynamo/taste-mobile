# One brief, four deals

The same brief dealt four times. Only the seed changes.

> Build an iPhone app that shows today's tide times for one beach. SwiftUI.

```sh
node skills/taste-mobile/scripts/deal.mjs deal --kind utility --audience general \
  --platform ios --stack swiftui --seed <n> --dir <project>
```

| Seed | Hand 1 | Full output |
|---|---|---|
| 1 | Glance Board | [tide-times.seed-1.txt](tide-times.seed-1.txt) |
| 2 | Toy / Game-Engine Tactile | [tide-times.seed-2.txt](tide-times.seed-2.txt) |
| 3 | Ambient Sky | [tide-times.seed-3.txt](tide-times.seed-3.txt) |
| 7 | Coach Character | [tide-times.seed-7.txt](tide-times.seed-7.txt) |

Each file was dealt with an empty history. A seed gives the same deal only when the recent
history is the same, because the dealer steers away from the last three directions you took.
Leave `--seed` out in real use.

[MOBILE-DESIGN.template.md](MOBILE-DESIGN.template.md) is the file the deal writes for seed 1,
before anyone fills it in. Every `TODO` must be replaced before the gate will pass.
