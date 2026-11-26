# MOBILE-DESIGN.md

The written commitments for this app. `deal.mjs` filled in what was dealt. Replace every TODO
before writing UI code. `gate.mjs` reads this file and fails while a TODO remains.

## Brief
- App: Jugful, an iPhone app for a couple who share one monthly budget: see what is left at a glance, add a spend in a few seconds, see who paid for what.
- Kind: money (Banking, budgeting, payments, investing)
- Audience: general
- Platform: ios
- Stack: swiftui
- Brand assets given: none

## Direction
- id: loud-owned-shell
- name: Loud Owned Shell
- seed: 547688
- Why it fits this brief: "what is left" is one number, so one loud flooded surface can be that number, while the who-paid list stays quiet ink where two people need to read it without argument.

## Governing metaphor
In this app, the month's budget becomes a measuring jug the two of you pour from.

## Governing asset
- Dealt: one owned colour that floods exactly one surface while lists stay ink on white
- What it is in this app: the level. One lime fill whose height is the share of the budget still left, topped by an ink level line and read against ink graduation ticks, as on the side of a measuring jug. The flood is the data, not a backdrop.
- Where it appears: (1) Home, full bleed: the only flooded surface. (2) The saved result after adding a spend: the same jug drawn small, with the level dropping to its new mark. (3) Month: the level day by day as a bare lime step chart with the dashed even-pace line. The ink half of the asset (graduation ticks and the dashed even mark) also carries the split bar on Who paid, with no lime.

## Display treatment
- Dealt: a custom display face on the hero amount or title only
- The one place it is allowed: the figure that says what is left (the Home hero and the saved result). The example may only use system fonts, so the "custom face" is the system face in its compressed width at black weight. No other text uses it.
- Body type: the platform face, unless the brief supplies a brand face.

## Restraint rule
- Corpus warning: Warning: flag the owned colour or display face reaching the transaction list, status colour, or a confirm or signing sheet. nubank breaks this (purple confirm button) and still ships.
- My rule for this app: Only what is left is ever lime; spends, people, categories, buttons, the entry sheet and every status stay ink, red or plain ground.

## Axes
- Shell: loud shell, quiet lists: the owned colour floods one surface and stays out of lists, status and confirm steps
- Mode: light with one flooded surface
- Density: low
- Composition: editorially fixed
- Depth: none
- Posture: native iOS: system bars, sheets, gestures and glass come from the platform
- Material: Liquid Glass is chrome only: system tab bar, toolbars and sheets. It is never the identity.

## Modes
- Supported: light and dark. In dark the ground goes near-black and the level stays lime with dark ink on it, so the flood reads the same in both.

## Colour roles
| Role | Light | Dark | Used for |
|---|---|---|---|
| ground | #FFFFFF | #0B0C0A | Page and list background; the empty part of the jug |
| raised | #F1F2EC | #1B1D18 | Keypad keys, unselected chips, bar tracks |
| ink | #0B0C0A | #F3F5EC | Text, spending amounts, ticks, the primary pill, selection (the interactive role is ink, not a hue) |
| inkSoft | #575A50 | #A9AC9F | Labels, secondary text, tick labels |
| hairline | #D6D8CF | #30332B | Row separators, outlines |
| level (owned) | #C5F230 | #C9F53A | Only the fill of what is left |
| onLevel | #0B0C0A | #0B0C0A | Text and ticks drawn on the level |
| over | #C2251C | #FF7A6E | Over-budget amounts only, always with a minus sign and a symbol |
| credit | ink + plus sign | ink + plus sign | Money back in (no green: lime is too near it) |
| pending | #8A5A00 | #F2C14E | Reserved for unsettled items; no screen in this example shows one |

Increased-contrast variants are defined in `Tokens.swift` for inkSoft, hairline and over.

## Hero moments
Budget: 1. Everything else stays calm.
1. the success state after a committed result
   - spring: spring.default (`.smooth`, 0.5 s, bounce 0): the level settles from its old mark to the new one. No overshoot, because this is a money flow. Under Reduce Motion the level changes with no travel.
   - haptic: `.success`, fired once when the saved result appears, routed through `Haptics.swift` and off when the Haptics setting is off
   - sound: none

## Motion scheme
- standard: Critically damped springs everywhere (bounce 0). On Android, the M3 Standard scheme. No overshoot on any flow that moves money, signs or deletes.

## Haptic profile
- quiet: System-provided haptics only, plus success and error on committed results. No custom patterns.

## Modules
- money: read references/modules/money.md. A direction cannot override it.

## Screens
| Screen | Job in one sentence | Deep link or launch argument |
|---|---|---|
| Home (Left) | Show what is left this month as the level in the jug, with the latest spends under it and Add spend in thumb reach | `-screen home` |
| Home, nothing spent | First day of a month: the jug is full and the list explains itself | `-screen home -state empty` |
| Home, over budget | The jug is empty and the overspend is stated in red with a minus | `-screen home -state over` |
| Add spend | Enter an amount on a keypad, pick who paid and a category, save | `-screen add` |
| Add spend, saved | Show the committed result in the sheet: what was saved and the new level | `-screen add -state saved` |
| Who paid | List every spend with who paid it, and how far the two are from an even split | `-screen paid` |
| Month | Show how the level fell day by day and what is left in each category | `-screen month` |

## Not doing
- No lime on a button, a person, a category, a list row or the entry sheet: the two people are told apart by a solid and an outlined monogram, not by colour.
- No centred balance over a row of round action buttons, and no card around every row: the home is the jug, then plain rows.
- No green for good and no celebration on save: the saved state is the amount, who paid, and the level at its new mark.
