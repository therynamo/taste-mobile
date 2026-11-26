# Fitness and health states module

**Applies when:** the app shows readiness, recovery, sleep, strain, training plans, streaks or any
score derived from body data.

This module fixes how body state is scored, worded and coloured, whatever art direction is dealt on
top. Open it before building a daily home screen, a score ring, a streak or a training plan.

## Lead with one prioritised signal

- Surface one prioritised daily signal: one number, then a plain-language sentence telling the
  user what to do today. Seen in Oura ("One Big Thing"), which also cut five tabs to three.
- Colour signals body state. It is a state vocabulary, never decoration.

## The triad rule (retargeted)

The older rule against "equal-weight score triads with traffic-light rings" is retargeted: the
category leader ships an equal-weight triad. The rule now targets the copy of it.

- **Flag** a triad in which all three scores are traffic-lit on arbitrary 0-100 scales, with no
  honest per-metric scale.
- **Instead, option A:** one prioritised score with a plain-language sentence (above).
- **Instead, option B:** a triad where each metric keeps its own honest scale and colour.

What an honest triad looked like in Whoop:

| Metric | Scale | Colour |
|---|---|---|
| Recovery | 0-100%, banded: red to 33%, yellow 34-66%, green 67-100% (text-sourced) | The only traffic-lit score |
| Strain | 0-21, Borg-based and non-linear, with a target tick drawn on the ring | Blue |
| Sleep | Own ring; scale not recorded | Slate-blue |

- One score may drive a target for another: Recovery sets the Strain target.
- Each band needs a meaning the user can act on: "Green = train hard. Yellow = train moderate.
  Red = recover." (text-sourced)
- Also a tell: cloned activity rings with four or more arbitrary goals. Instead: fewer rings, each
  tied to a named goal. (text-sourced)

## State headline and a non-colour carrier

- Write a plain-language state headline at the top of the daily screen (seen: "Today Feels
  Great").
- Add one non-colour state carrier so state survives without colour: a mascot whose pose tracks
  state, or an emotion glyph.
- Use a closed colour-meaning set. Seen sets: state words (Optimal blue, Good teal, Needs care
  coral); a green corridor band; semantic green "Normal" with a check.
- A mascot in a health app interprets data. It reports state and never nags.

## No alarm red for imprecise data

- Daily body metrics are imprecise. Do not use alarm red for them. Instead: yellow and orange for
  alerts (The Outsiders' stated rule), or a coral "Needs care" state word (Oura).
- This is a warning, not a gate: Harvee (a red "Insufficient" chip) and Daylio break it. Red as
  one defined band of a documented scale (Whoop's Recovery) is not flagged by the triad rule.
- Haptic and audio cues during workouts fail silent when state is uncertain. (text-sourced)

## Copy: report, never nag

- Voice: "Supportive but not cheesy, motivating but not fake-hyped." Guide, do not push.
- Never write guilt or loss copy such as "Don't break your 30-day streak!". Instead: report the
  state and accept it, in the manner of "If a 15-minute walk is what your body can do at that
  moment, that's great."
- No hype voice bolted onto a mascot. Instead: the mascot delivers the daily status.

## Streaks, rest, sickness and injury

- A streak counter with a flame reads as a default. It was logged as a tell in five apps (for
  example a flame glyph with "355" beside the avatar). The habit template of streak plus flame
  emoji, a three-question onboarding, a paywall on screen two and empty tabs is a community tell
  and a documented 4.2 risk pattern.
- Instead: turn the streak into a corridor. Draw a band of healthy activity to "stay somewhere
  inside of", not a chain to keep unbroken (Gentler Streak's Activity Path, a green band with
  1-, 10- and 30-day views).
- Rest, sick, injured and on-a-break are valid states. Give the user explicit status options for
  them. A rest day or an injury never breaks anything and is never shown as failure.
- Do not fake precision or personalisation. A generic curve presented as personal reads as a
  template. Instead: show only what the data supports, on its real scale. (text-sourced)

## Two grammars: structures, not looks

Both stay in this module because they share a structure, not a look. Any dealt direction can sit on
top of either.

| Grammar | Structure | Seen in |
|---|---|---|
| Readiness Dashboard | Strain, Recovery and Sleep rings in a row; a coach card beneath; drill-down to one big ring plus a contributor table; one score drives a target for another. | Whoop (dark, navy-slate `#12171a`), Bevel (light, `#f4f7fb`) |
| Coached Program | A human coach persona in voice, photography or team; a plan calendar; a plan reveal after the quiz; in-workout swaps to coach-approved alternatives; each workout lists warm-up, session detail and cooldown. | Runna, Ladder, Nike Run Club |

- Same grammar, different looks: Whoop is dark with bold DIN-like numerals; Bevel is light, glassy
  and illustrated. Ladder reads as a loud owned shell (black with lime `#e8ff11`).
- Readiness Dashboard still obeys the triad rule above.
- Long quiz funnels are an anti-pattern. Measured onboarding lengths: 34 steps (Bevel), 26 (Runna),
  4 (Ladder). Instead: a short onboarding, and a trial timeline in place of a "SAVE 50%" price
  anchor. (text-sourced)
- A coach or assistant screen built as the converged chat template (centred mascot, greeting,
  suggestion chips, pill composer) is a cross-module convergence case. See the chat module.

## Labels and values

- Put small labels above bold values. This is what Strava's real feed shows; the text record that
  placed labels beneath values was wrong.
- Set units smaller than the value on the same baseline (`8h 28m`), or in light grey beside it.
- Caps labels with wide tracking above the value were seen in Whoop.
- Reserve the brand colour for a few meanings. Seen in Strava: orange for the route, the selected
  tab or sport, primary buttons and the liked state only.

## Lint and checks

- The daily home has one hero score and one sentence, or a triad that passes the next check.
- Flag three sibling scores that all use a red-yellow-green band on a 0-100 scale.
- Every score declares its scale and range; a traffic-light band has a documented meaning per band.
- Each state has a text label or glyph in addition to colour.
- No alarm-red token on daily, estimated or derived metrics.
- Grep copy for streak-loss and guilt phrasing such as "don't break your streak".
- Flag a flame glyph or flame emoji next to a day counter.
- A status model includes rest, sick, injured and on-a-break, and none of them resets progress.
- Stat blocks render label above value.
- Count onboarding steps; flag a long quiz ahead of a discount paywall.
- No more than three rings, and no ring without a named goal.
- A coach screen is checked against the chat module's template rules.

## Sources

On-screen evidence is the round 3 visual pass (`research/reports/Mobile app visual corpus pass.md`).

- https://9to5google.com/2025/10/20/oura-app-redesign/
- https://ouraring.com/blog/new-app-design/
- https://developer.whoop.com/docs/whoop-101
- https://sketch.com/blog/gentler-streak
- https://developer.apple.com/news/?id=3m0ht22s
- https://apps.apple.com/us/app/the-outsiders-athlete-tracker/id6751584800
- https://screensdesign.com/showcase/bevel-health-performance
- https://screensdesign.com/showcase/runna-running-training-plans
- https://screensdesign.com/showcase/ladder-strength-training-plans
