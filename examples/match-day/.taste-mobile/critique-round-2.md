# Critique, round 2

Look at every screenshot in `.taste-mobile/shots/` (open `contact.html` to see them side by side).
Answer each pass for the screens it applies to. Write findings as "reads as a default" or "reads as
a template", name the screen, and say what to change. Then pick the top three fixes. Replace every TODO.

Screens: today, today-empty, today-error, fixtures, match, table
Device: taste-mobile-match-day (iOS 26.5)

## Checks from capture
- WARN C10 (today, tree): 1 control with an accessibility frame under 44x44 pt: "Settings" 36x36. Confirm the hit region is 44x44 or larger.
- WARN C10 (today-empty, tree): 1 control with an accessibility frame under 44x44 pt: "Settings" 36x36. Confirm the hit region is 44x44 or larger.
- WARN C10 (today-error, tree): 1 control with an accessibility frame under 44x44 pt: "Settings" 36x36. Confirm the hit region is 44x44 or larger.

## One second
After one second, what is this screen for and what is its main action? If you cannot say, the hierarchy is wrong.

- today, today-error, match: the two slanted condensed numerals are read first, the clock between them second. Passes.
- fixtures: pinned board first, then the live row's 2–1. Passes.
- table: "3rd of 10", then the bold Ashcombe row. Passes.
- today-empty: "No match today" and one button. Passes.

## Squint
Blur your eyes. One thing should dominate, and it should be the thing that matters. Hierarchy must survive without colour.

- One flooded block per screen on a plain ground; everything else is ink. Holds on all six in light and dark.
- fixtures and today-empty: a result row's score still sits on the row watermark. Legible in both modes, but it is the busiest spot in the app.

## Cover the logo
Hide the name and logo. Could this be any app? Name the governing asset you can see on this screen.

- The slanted club-code watermark and the slanted condensed numerals now render on every screen and read as one family. The dealt direction is recognisable without the name.
- today-empty: the row score "1–3" touches the right edge of the row; the shear pushes the top of the last numeral into the clip.

## Thumb reach
The primary action sits where a thumb reaches. Targets are 44 pt (48 dp) or larger with space between them.

- Tabs, pin buttons (44 pt), Unpin, Try again and See all fixtures (44 pt capsules) are in reach.
- C10 remains on today, today-empty, today-error: the system toolbar Settings button reports 36x36. It is system chrome in the glass bar; not changed.

## Trunk test
Dropped onto this screen cold: where am I, how did I get here, where can I go next?

- Large title plus tab bar on the three tabs; inline "FEN v ASH" title and system back on match. Passes.

## Dark
Dark is designed, not inverted: surfaces stay distinct, colour roles keep their meaning, text keeps its contrast.

- All six dark screenshots looked at. Oxblood-black ground, raised surface on the empty card, pink-tinted selected tab, white ink marks on the timeline. The flood is the same in both modes by design. Nothing inverted or lost.

## Largest text
At the largest text size nothing is clipped, overlapped or truncated into nonsense, and the layout reflows.

- All six looked at. The short page notes ("Sat 28 Nov", "2026–27 season", "Division One") keep the board on the first screen. Scores lead each club line; nothing is clipped or truncated; long lines wrap.
- The tab bar's glass picks up the flood behind it at this size (system behaviour).

## Sameness
Across screens: one button shape, one chrome, one radius scale, a tab bar that never changes. Across projects: does this look like the last app you built?

- One capsule, one board radius, one slant angle shared by numerals and watermarks. Passes.
- match: the scorer line lists home then away with only a dot between, so it is not clear who scored for whom.

## Top three fixes this round
1. Row score: give the slanted numeral room so it never meets the row edge.
2. Match: name the side on the scorer line, supported club first.
3. Fixtures: capitalise "Away" / "At home" on the Pinned line.

## Could not check
- Motion, haptics and sound cannot be judged from stills. Say what was checked another way, or list it as open.
- Looked at all 18 screenshots this round.
- The pin and go-final animations and the pin haptic were not exercised. Only iPhone 17 Pro on iOS 26.5 was run.
