# Critique, round 3

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

- today, today-error, match: the two slanted condensed numerals first, the clock between them second. Passes.
- fixtures: pinned board first, then the live row's 2–1. Passes.
- table: "3rd of 10", then the bold Ashcombe row. Passes.
- today-empty: "No match today" and one button. Passes.

## Squint
Blur your eyes. One thing should dominate, and it should be the thing that matters. Hierarchy must survive without colour.

- One flooded block per screen on a plain ground; everything else is ink. Holds on all six, light and dark.
- Still true: a result row's score sits on the row's watermark (fixtures "2–1" on OLD, today-empty "1–3" on BRI). Legible, but busy. Not fixed.

## Cover the logo
Hide the name and logo. Could this be any app? Name the governing asset you can see on this screen.

- Slanted club-code watermarks and slanted condensed numerals on every screen; the direction is recognisable without the name.
- The row score no longer meets the row edge.

## Thumb reach
The primary action sits where a thumb reaches. Targets are 44 pt (48 dp) or larger with space between them.

- Tabs, pin buttons (44 pt), Unpin, Try again and See all fixtures (44 pt capsules) are in reach.
- C10 remains on today, today-empty, today-error: the system toolbar Settings button reports a 36x36 accessibility frame. It is the system's glass toolbar button, left as it is and reported as a warning.

## Trunk test
Dropped onto this screen cold: where am I, how did I get here, where can I go next?

- Large title plus tab bar on the three tabs; inline "FEN v ASH" title and system back on match. Passes.

## Dark
Dark is designed, not inverted: surfaces stay distinct, colour roles keep their meaning, text keeps its contrast.

- Oxblood-black ground, raised surface on the empty card, pink-tinted selected tab, light ink marks on the timeline. The flood is the same in both modes by design. Nothing inverted or lost.

## Largest text
At the largest text size nothing is clipped, overlapped or truncated into nonsense, and the layout reflows.

- Nothing clipped or truncated on any of the six. Boards reflow to one club per line with the score leading; the table reflows to two lines per club; page notes use their short form.
- At this size a board is taller than one screen (the footer line scrolls). Accepted: it is the largest accessibility size.
- The tab bar's glass picks up the flood colour behind it (system behaviour).

## Sameness
Across screens: one button shape, one chrome, one radius scale, a tab bar that never changes. Across projects: does this look like the last app you built?

- One capsule, one board radius, one slant angle. The match scorer line now names the side: "Won away. J. Holloway 44′, D. Acton 83′. Fenwick Park: L. Garrow 9′."

## Top three fixes this round
1. Not fixed (round limit reached): row scores sit on the row watermark; move the watermark clear of the score or lower its weight under a score.
2. Not fixed: the system Settings toolbar button reports a 36x36 accessibility frame (C10).
3. Not fixed: the watermark slant is a shear, not a true italic; San Francisco has no italic at expanded width.

## Could not check
- Motion, haptics and sound cannot be judged from stills. Say what was checked another way, or list it as open.
- Looked at the 9 screenshots that changed since round 2 (fixtures and match in all three passes, today-empty in light and dark, large-today-empty excepted). The other 9 are byte-identical to the round 2 images, all of which were looked at.
- The pin and go-final animations, the Reduce Motion paths and the pin haptic were not exercised. The `-state final` board was built but is not in the capture set.
- Only iPhone 17 Pro on iOS 26.5 was run. No device, no VoiceOver pass, no increased-contrast screenshot.
