# MOBILE-DESIGN.md

The written commitments for this app. `deal.mjs` filled in what was dealt. Replace every TODO
before writing UI code. `gate.mjs` reads this file and fails while a TODO remains.

## Brief
- App: Scoreboard End is an iPhone app for supporters of one amateur football club (Ashcombe Rovers): today's live score, the season's fixtures and results, and the league table.
- Kind: sports (Scores, live game companions, fan apps)
- Audience: general
- Platform: ios
- Stack: swiftui
- Brand assets given: none

## Direction
- id: broadcast-scoreboard
- name: Broadcast Scoreboard (fandom variant of Glance Board)
- seed: 342190
- Why it fits this brief: The app follows one club, so one game at a time can own the screen the way a scoreboard owns the end of a ground.

## Governing metaphor
In this app, a match becomes the painted scoreboard at the end of the ground.

## Governing asset
- Dealt: italic team-code watermarks behind the score
- What it is in this app: the three-letter club code (ASH, OLD, FEN ...) set as a giant heavy italic watermark, cropped by the edge of whatever it sits on, like letters painted on a board that is too small for them. San Francisco has no italic at expanded or condensed width, so the slant is one fixed 10 degree shear (`oblique()` in `Scoreboard.swift`), shared with the score numerals.
- Where it appears: (1) the live match surface on Today, both codes behind the score; (2) every fixture and result row on Fixtures, the opponent's code behind the row; (3) the club header above the league table; (4) the match page surface; (5) the "no match today" empty state.

## Display treatment
- Dealt: condensed italic score numerals with timeout dots beneath
- The one place it is allowed: score numerals only (the live score, a result score). Football has no timeouts, so the dots beneath show the two halves: filled when played, ringed when in play, hollow when to come. Kick-off times, table figures, dates and headings are the platform face.
- Body type: the platform face, unless the brief supplies a brand face.

## Restraint rule
- Corpus warning: Warning: the only non-Apple exemplar (sleeper) sits inside the Pick'em Arcade anti-reference, so deal the scoreboard component only. Flag any multiplier, wallet-in-top-bar, promo chip, MORE/LESS pick button, 3D jersey or neon glow on or near the scoreboard. Team colour stays on identity surfaces, never on status.
- My rule for this app: Only one surface per screen is flooded with team colour; every other game carries its code as an ink watermark on the plain ground, and the table stays neutral.

## Axes
- Shell: loud on the identity surface only: team colour floods the game surface, chrome stays minimal
- Mode: tinted dark
- Density: medium
- Composition: user-composed with a default order
- Depth: none
- Posture: native iOS: system bars, sheets, gestures and glass come from the platform
- Material: Liquid Glass is chrome only: system tab bar, toolbars and sheets. It is never the identity.

## Modes
- Supported: light and dark. Dark is the dealt tinted dark (an oxblood-black ground). Light keeps the flooded game surface exactly as it is in dark and puts it on a chalk ground, so the board stays the darkest, loudest thing on the screen in both modes.

## Colour roles
| Role | Light | Dark | Used for |
|---|---|---|---|
| ground | chalk #F3F1ED | oxblood-black #160A0C | Screen background |
| surface | white #FFFFFF | raised tint #231317 | Grouped rows, table body, sheets |
| ink | #1A1113 | #F6EDEE | Primary text and figures |
| inkSecondary | #5C5053 | #BBABAE | Dates, labels, captions |
| hairline | #DAD4D0 | #3B262A | Dividers, table rules, zone lines |
| watermark | ink at 7% | ink at 9% | The club-code watermark on plain surfaces |
| club | oxblood #8E1B2A | oxblood #8E1B2A | The supported club's identity colour: floods, never status |
| team(code) | one dark hue per club | same | The two-team flood on a game surface. Data, not decoration |
| onFlood | white | white | Text and numerals on a flooded surface |
| onFloodSecondary | white 80% | white 80% | Clock, play sentence, scorers on a flood |
| tint | oxblood #8E1B2A | rose #F2A7B0 | The one tinted control per bar, links |

Each role has an increased-contrast value in `Sources/Tokens.swift`. Results (W, D, L) and the
promotion and relegation lines are carried by letters, weight and labels, not by colour.

## Hero moments
Budget: 2. Everything else stays calm.
1. pinning a game to the top of the board
   - spring: spring.expressive (duration 0.4, bounce 0.3); under Reduce Motion an opacity crossfade of 0.18 s
   - haptic: .impact(weight: .medium), the "snap, drop" row, fired when the row lands in Pinned
   - sound: none
2. the game goes final: the surface settles from live to result
   - spring: spring.expressive (duration 0.44, bounce 0.2) on the clock block; spring.effects for the flood dimming; crossfade under Reduce Motion
   - haptic: none (sports module: no haptic on a score update)
   - sound: none

## Motion scheme
- expressive-hero-only: Critically damped springs by default. Bounce up to 0.3 on the dealt hero moments and on drag release only. On Android, M3 Standard for the product with the Expressive scheme swapped in on hero moments.

## Haptic profile
- standard: The mapping table in references/haptics-sound.md, with nothing on scroll, navigation or plain taps.

## Modules
- sports: read references/modules/sports.md. A direction cannot override it.

## Screens
| Screen | Job in one sentence | Deep link or launch argument |
|---|---|---|
| Today (live) | Show the score, the clock and the current play of today's match, then its timeline and events. | `-screen today` |
| Today (no match) | Say there is no match today and when the next one is. | `-screen today -state empty` |
| Today (score feed down) | Keep the last known score on the board and say plainly that it is not updating. | `-screen today -state error` |
| Fixtures | List the season's fixtures and results, pinned games first. | `-screen fixtures` |
| Match | Show one finished match: the result, its timeline and its events. | `-screen match` |
| Table | Show the league table with the supported club's place stated above it. | `-screen table` |

## Not doing
- No red LIVE badge, pulsing dot or glow: the running clock and the play sentence carry liveness.
- No crests, kits, player photos, news, video, odds or sponsors: the club code is the only identity mark.
- No team colour in the league table or in a result's W, D or L: tables and status stay neutral.
