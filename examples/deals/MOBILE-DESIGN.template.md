# MOBILE-DESIGN.md

The written commitments for this app. `deal.mjs` filled in what was dealt. Replace every TODO
before writing UI code. `gate.mjs` reads this file and fails while a TODO remains.

## Brief
- App: TODO (one sentence: what it is and who uses it)
- Kind: utility (Weather, travel, camera, timers, trackers, single-purpose tools)
- Audience: general
- Platform: ios
- Stack: swiftui
- Brand assets given: none

## Direction
- id: glance-board
- name: Glance Board
- seed: 1
- Why it fits this brief: TODO (one sentence)

## Governing metaphor
In this app, TODO (the domain object) becomes TODO (a real-world analogy).

## Governing asset
- Dealt: one hero readout line (a bold value with a smaller same-baseline unit) that repeats on the widget and the Live Activity
- What it is in this app: TODO
- Where it appears: TODO (name at least three surfaces, for example home, detail, widget)

## Display treatment
- Dealt: bold values with smaller same-baseline unit suffixes
- The one place it is allowed: TODO
- Body type: the platform face, unless the brief supplies a brand face.

## Restraint rule
- Corpus warning: Warning, not a gate: flag a screen that shows more than one competing entity per line or sheet, status colour used decoratively, or brand hue leaking into status.
- My rule for this app: TODO (one sentence that starts with Never or Only)

## Axes
- Shell: quiet: neutral chrome, status colour is the only hue
- Mode: light
- Density: high
- Composition: user-composed with a default order
- Depth: one depth cue on the governing asset only, dropped under Reduce Motion (text-sourced: stills cannot show it)
- Posture: native iOS: system bars, sheets, gestures and glass come from the platform
- Material: Liquid Glass is chrome only: system tab bar, toolbars and sheets. It is never the identity.

## Modes
- Supported: TODO (light and dark | dark only | light only; give the reason if only one)

## Colour roles
| Role | Light | Dark | Used for |
|---|---|---|---|
| TODO | | | |

## Hero moments
Budget: 2. Everything else stays calm.
1. the tracked entity changes state (the label and its semantic colour update together)
   - spring: TODO (a token from references/motion.md)
   - haptic: TODO (from the mapping in references/haptics-sound.md, or none)
   - sound: TODO (or none)
2. scrubbing the curve with a selection tick per data point
   - spring: TODO (a token from references/motion.md)
   - haptic: TODO (from the mapping in references/haptics-sound.md, or none)
   - sound: TODO (or none)

## Motion scheme
- expressive-hero-only: Critically damped springs by default. Bounce up to 0.3 on the dealt hero moments and on drag release only. On Android, M3 Standard for the product with the Expressive scheme swapped in on hero moments.

## Haptic profile
- rich: The mapping table, plus one custom pattern paired with a sound on a single hero moment.

## Modules
- none attached for this kind

## Screens
| Screen | Job in one sentence | Deep link or launch argument |
|---|---|---|
| TODO | | |

## Not doing
- TODO (three things this design refuses, one per line)
