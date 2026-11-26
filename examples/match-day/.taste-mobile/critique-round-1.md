# Critique, round 1

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

- today, today-error, match: the board and its two numerals are read first; the clock sits between them. Passes.
- fixtures: the pinned board is read first, then the list. Passes, but the board says "District Cup, quarter-final" twice (top line and Pinned line).
- table: "3rd of 10" is read first, then the bold Ashcombe row. Passes.
- today-empty: "No match today" and one button. Passes.

## Squint
Blur your eyes. One thing should dominate, and it should be the thing that matters. Hierarchy must survive without colour.

- All six: one dark flooded block dominates a plain ground, and it is the game (or the club's place on table). Hierarchy survives without colour because the board is also the largest block.
- fixtures: on result rows the score sits on top of the watermark; both are heavy. Legible, but the watermark competes a little at 7 percent ink.

## Cover the logo
Hide the name and logo. Could this be any app? Name the governing asset you can see on this screen.

- The club-code watermark is visible on all six screens (board, rows, table header, empty state).
- But the display treatment did not render: the score numerals came out upright and normal width, and the watermarks upright. `Font.width(.condensed).italic()` was silently ignored, so the board read closer to a default bold score card than to the dealt direction.

## Thumb reach
The primary action sits where a thumb reaches. Targets are 44 pt (48 dp) or larger with space between them.

- Tabs and the pin buttons are in reach. Pin buttons are 44 pt. Unpin and Try again are 44 pt capsules inside the board.
- C10: the Settings toolbar button reports a 36x36 accessibility frame. It is the system toolbar button in the system glass bar, not a custom control; it is top-right, which is acceptable for a rarely used action.

## Trunk test
Dropped onto this screen cold: where am I, how did I get here, where can I go next?

- Every screen has one large title (Today, Fixtures, Table) and the tab bar; match has an inline title and the system back button. Passes.

## Dark
Dark is designed, not inverted: surfaces stay distinct, colour roles keep their meaning, text keeps its contrast.

- Looked at dark today, fixtures and table in this round. The ground is an oxblood-black, rows and rules stay visible, the flooded board is unchanged. Designed, not inverted.
- Row watermarks in dark are faint but present.

## Largest text
At the largest text size nothing is clipped, overlapped or truncated into nonsense, and the layout reflows.

- Nothing is clipped or truncated on today, today-empty, fixtures or table. The board reflows to one club per line with the score leading, and the table reflows to two lines per club.
- The note line under each large title (date, season, league) wraps to three lines at the largest size and pushes the board half off the first screen on fixtures and table.

## Sameness
Across screens: one button shape, one chrome, one radius scale, a tab bar that never changes. Across projects: does this look like the last app you built?

- One capsule button shape, one board radius, one tab bar on every screen. Passes.
- Without the condensed italic numerals the board would look like any two-team gradient score card.

## Top three fixes this round
1. Make the display treatment real: condensed width through `fontWidth`, and a fixed shear for the slant, on score numerals and watermarks (San Francisco has no italic in its condensed and expanded widths).
2. Largest text: give the note under each title a short form at accessibility sizes so the board stays on the first screen.
3. Fixtures: stop the pinned board repeating its competition; the Pinned line says the date and home or away only.

## Could not check
- Motion, haptics and sound cannot be judged from stills. Say what was checked another way, or list it as open.
- Looked at this round: all six light screenshots, dark today, fixtures and table, largest-text today, today-empty, fixtures and table. The other five were left for the next capture because fix 1 changes every board.
- The pin and go-final animations and the pin haptic were not exercised.
