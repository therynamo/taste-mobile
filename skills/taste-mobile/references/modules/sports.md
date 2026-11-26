# Sports live-data module

**Applies when:** the app shows live scores, fixtures, standings or match stats, with or without
fantasy and odds beside them.

This module fixes how a score, its liveness and team colour behave, whatever art direction is dealt
on top. Open it before building a score list, a match page, a home screen or a Live Activity.

## Pick the variant: two signals decide it

Numeral style and where team colour lives tell the two sports treatments apart. Pick one per app
and keep every row of its column.

| Signal | Glance Board (match centre) | Broadcast Scoreboard (fandom) |
|---|---|---|
| Score numerals | Regular or light weight and wide-set (`2 - 1`), or bold at normal width (`103 - 91`). Never condensed. | Heavy, width-condensed, 30-40 pt, with timeout dashes or dots beneath. |
| Team colour | Inside data visuals and on crests only: possession bar, shot-map dots, a soft header glow. | Floods the surface: two-team gradients, italic team-code watermarks behind the score. |
| Base | Neutral: light grey or white, or dark `#121212`. | Tinted dark, such as `#002c00` or `#0c174b`. |
| Liveness | Green dot plus a clock pill. | The clock and the play sentence. No red LIVE badge. |
| Other colour | Banded semantic rating chips. | None besides team colour. |

- Glance Board was seen in FotMob, Sofascore and theScore. Broadcast Scoreboard was seen in Apple
  Sports and in one scoreboard screen of Sleeper.
- Broadcast Scoreboard also uses concentric sheets of about 20-24 pt radius and one game per row.
- Its only non-Apple example sits inside a betting shell. Take the scoreboard component only; every
  item in the "never ship" list below still applies.

## Liveness

- Carry liveness with the clock. Glance Board adds a green dot and a clock pill. Broadcast
  Scoreboard adds a sentence describing the current play.
- Do not add a red LIVE badge to Broadcast Scoreboard. Instead: the running clock is the signal.
- A portal-style media home uses one red accent, reserved for live state (seen in ESPN).
- No haptic on a score change: no source documents one. Instead: goal alerts go to notifications.

## Team colour

- Team or country colour goes on identity surfaces only, over the base. Never fill whole data
  tables with it. Instead: tables stay neutral and aligned.
- Team colour is never a status colour. Instead: status uses semantic colour (rating chips, live
  dot).
- A two-team gradient driven by real team colours is data, not a decorative gradient.
- Seen holding in F1: team colour only on driver cards and timing-tower ticks.

## Data rules

- Ship one signature visualisation with named inputs, such as a momentum chart or a shot map. No
  decorative sparkline. (text-sourced)
- Dense tables keep columns aligned across sections, truncate team names and wrap headers under
  Dynamic Type. Do not split starters and bench into separately built tables under one header; the
  columns misalign. Instead: one table. (text-sourced)
- Completeness beats polish: "No amount of beautiful presentation is going to make up for missing
  data." Do not drop box-score columns for looks. (text-sourced)
- If odds are shown, give the user an in-app switch that turns them off. (text-sourced)
- Align score columns in code. Do not cite a sports app as proof of tabular figures: the records
  that claimed them rested on right-aligned columns only. (unverified)

## The portal rule

- The user's teams rank above network tiles and promos on the home screen.
- Never ship the "everything portal" home where news, video, bets and promos outrank the user's
  own team or league. Instead: followed teams and leagues first, then the rest.
- The portal shape itself is structure, not a look: stacked modules, a vertical short-video rail,
  a docked player, all-caps tracked headers and one red live marker (seen in ESPN and NBA).

## Live surfaces

Store frames showed Live Activities for Apple Sports (two-team gradient cards) and FotMob (a glass
Lock Screen card with flag avatars). The rules marked below rest on text.

- The Live Activity uses the sport's own state grammar, not a generic score-plus-clock template
  (text-sourced; theScore's per-sport Live Activities were absent from its frames):

| Sport | State shown |
|---|---|
| NBA | Score and clock |
| MLB | Bases, balls and strikes, outs |
| NHL | Power play and shootouts |
| NFL | Down and distance, timeouts, possession |

- theScore reports up to 5 Live Activities shown on iOS and up to 8 on the Android lock screen.
  (text-sourced)
- Let the user schedule a Live Activity in advance, and show key stats during breaks in play.
  (text-sourced)
- Repeat the same readout on the Live Activity, the widget and the Watch (a Glance Board
  signature).
- Widgets shipped in more than one size: smaller ones in Apple Sports, extra-large in FotMob.
  (text-sourced)
- "Live Activities dressed in country colors" was not borne out: only flag avatars on a neutral
  glass card were seen. Do not flood a Live Activity with country colour on that evidence.

## Never ship these near a score: Pick'em Arcade

Eight signatures, each seen in at least two of Sleeper, Underdog, PrizePicks and DraftKings.

| Signature | Instead |
|---|---|
| Binary pick buttons with the "over" side promoted (filled MORE, outlined LESS) | No pick controls on score surfaces. If a choice exists, both sides get equal weight. |
| Multipliers as the primary number (`1.79x`, `~10.83x`) | The score and the clock are the primary numbers. |
| The wallet balance with an add-funds + in the top bar | The top bar holds a title or search. |
| Promo chips and banners inside the core flow | The user's teams first; promos never above them. |
| 3D jersey or helmet renders instead of player photos | Crests, player photos and a field graphic. |
| Card packs and casino props | One signature visualisation with named inputs. |
| Social proof on the bet ("25K People Place This Bet") | Show stakes and payout plainly, with no crowd counts. |
| A neon-on-dark shell with glowing selected-card outlines | The neutral base or the tinted dark base from the table above; selection without glow. |

Related tell: dark navy or black plus a neon accent plus a team-logo grid reads as a default for
"sports". Instead: choose a column of the two-signal table.

## Four claims that were not borne out

Do not repeat these as facts in copy, comments or design rationale.

1. "Pick'em apps hide the payout." Underdog, Sleeper and DraftKings all show the payout up front.
   PrizePicks shows no slip, so its claim is untested. (unverified)
2. PrizePicks' goblin and demon modifiers appear in no frame. (unverified)
3. Green-as-safety was not seen. DraftKings colours every price green, so there green means
   "bettable money", a different misuse.
4. Confetti appears nowhere in the betting frames.

Field corrections from the same pass: Sofascore has five tabs, not four; Apple Sports' home is deep
green (`#002c00`), not dark blue; no ESPN BET panel appears in ESPN's frames.

## Lint and checks

- Score numeral style matches the chosen variant: condensed heavy only with a tinted dark base and
  a team-colour surface.
- Team colour tokens are referenced only by identity surfaces and data visuals, never by table
  backgrounds or status styles.
- Glance Board: a live row has a green dot and a clock pill. Broadcast: no red LIVE badge.
- At most one red live marker style in the app.
- Home screen order: followed teams render before network tiles and promos.
- Tables: one table per stat group; columns align; headers wrap at the largest Dynamic Type size.
- An odds toggle exists if odds are rendered.
- No haptic call in score-update handlers.
- Live Activity layout switches on sport and shows that sport's state fields.
- No multiplier, wallet balance, promo banner, card pack, crowd count or glow outline on any screen
  that renders a score.
- Every chart on a match page has named inputs in its legend or caption.

## Sources

On-screen evidence is the round 3 visual pass (`research/reports/Mobile app visual corpus pass.md`).

- https://video.thescore.com/news/2885302/thescore-now-features-live-activities-events
- https://lickability.com/blog/apple-sports/
- https://leancrew.com/all-this/2024/04/a-tardy-assessment-of-the-apple-sports-app/
- https://macrumors.com/2026/04/01/apple-sports-2026-fifa-world-cup
- https://appleinsider.com/articles/25/09/16/apple-sports-update-makes-it-easier-to-follow-your-favorite-teams-everywhere
- https://apps.apple.com/us/app/apple-sports/id6446788829
- https://apps.apple.com/US/app/id488575683
- https://www.sofascore.com/news/how-sofascores-attack-momentum-changed-sport-analysis
- https://focusstate.substack.com/p/winning-by-design-deceptive-ux-patterns
