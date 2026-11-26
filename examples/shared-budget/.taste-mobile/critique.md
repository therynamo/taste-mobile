# Critique, round 3

Look at every screenshot in `.taste-mobile/shots/` (open `contact.html` to see them side by side).
Answer each pass for the screens it applies to. Write findings as "reads as a default" or "reads as
a template", name the screen, and say what to change. Then pick the top three fixes. Replace every TODO.

Screens: home, home-empty, home-over, add, add-saved, paid, month
Device: taste-mobile-shared-budget (iOS 26.5)

## Checks from capture
- WARN C10 (add, tree): 1 control with an accessibility frame under 44x44 pt: "Cancel" 77x36. Confirm the hit region is 44x44 or larger.

## One second
After one second, what is this screen for and what is its main action? If you cannot say, the hierarchy is wrong.

- home: what is left this month ($1,284.30 in the lime level); main action is the ink "Add spend" pill. Clear.
- home-empty: full jug, $3,200.00, same pill. Clear. home-over: red figure with a warning symbol and "Over this month". Clear.
- add: amount, who paid, category, keypad, "Save spend". Clear, but reads as a default form: nothing on it is from the jug, by the restraint rule.
- add-saved: the spend row, then the jug and the new figure. Clear. The lower third is empty at default text size.
- paid: two totals and one split bar, then the list. Clear. month: the pace sentence leads, the chart backs it. Clear.

## Squint
Blur your eyes. One thing should dominate, and it should be the thing that matters. Hierarchy must survive without colour.

- home: the lime slab and the black figure dominate. In grey the figure still wins on size and weight.
- month: the lime step area dominates; the sentence above it is second. Fine.
- paid: the split bar and the title compete a little; the bar is the heavier mark. Acceptable.
- add: the amount and the two ink pills (Groceries chip, Save spend) share weight. The selected chip is heavier than it needs to be. Left as is.

## Cover the logo
Hide the name and logo. Could this be any app? Name the governing asset you can see on this screen.

- home, home-empty, home-over: the level with its graduation ticks and dashed even-pace line. Not any app.
- add-saved: the small jug with the same level and ticks. month: the level as a step chart with the same dashed even line.
- paid: no lime by rule; carries only the dashed "even" mark and the solid/outlined pair. Reads as a plain list app above the fold.
- add: none. Reads as a template entry sheet. This is the weakest screen for identity.

## Thumb reach
The primary action sits where a thumb reaches. Targets are 44 pt (48 dp) or larger with space between them.

- "Add spend", "Save spend", "Done" are full-width 54 pt pills at the bottom. Keypad keys are 56 pt, chips 44 pt, payer choices 56 pt.
- C10 warning: the "Cancel" button in the sheet toolbar reports 77x36. It is the system toolbar button; I did not resize it and did not verify its hit region on a device. Left open.
- The Haptics toggle sits in the top-right menu, out of thumb reach. Acceptable for a setting.

## Trunk test
Dropped onto this screen cold: where am I, how did I get here, where can I go next?

- Tabs "Left", "Who paid", "Month" with the selected one marked; titles "November 2026", "Who paid", "November".
- "Left" and "Month" both show November in the title; the tab label is what tells them apart. Slightly weak.
- add and add-saved are a sheet titled "Add spend" / "Saved" with Cancel or Done as the way out.

## Dark
Dark is designed, not inverted: surfaces stay distinct, colour roles keep their meaning, text keeps its contrast.

- Lime keeps its meaning and stays lime with dark ink on it. The red is lightened for the dark ground. Pills invert to light ink.
- Keypad keys and chips sit one step above the ground and stay distinct. The category bar track on month.dark is faint but visible.
- Round 2 defect, fixed: on home-empty.dark the top tick at the brim drew light on lime.

## Largest text
At the largest text size nothing is clipped, overlapped or truncated into nonsense, and the layout reflows.

- Round 1 defects, fixed: home.large and home-over.large scale labels ran into "Even pace today"; add-saved.large pinned buttons covered the jug and figure; paid.large broke "$1,008.00" across two lines; month.large legend wrapped into two columns.
- Round 2 defect, fixed: home.large pushed the lime level under the "Add spend" bar at first view.
- Still true: at the largest size the pinned pill is about 100 pt tall, so add.large shows only the amount and who paid before scrolling; category and keypad are below it. home.large shows the figure and the level; "Latest" is below the fold.
- month.large: the legend is partly behind the tab bar at first view; it scrolls clear.
- The "Cancel" toolbar label and tab labels do not scale; that is system behaviour.

## Sameness
Across screens: one button shape, one chrome, one radius scale, a tab bar that never changes. Across projects: does this look like the last app you built?

- One pill shape (ink, or outlined for the secondary), one 14 pt control radius, plain rows with hairlines, the same tab bar on all three tabs.
- The saved-result jug has walls and a rounded base; Home's jug is full bleed with none. Same level, two drawings. Acceptable, noted.
- paid and the lower half of month are close to stock list screens.

## Top three fixes this round
1. home.large: stacked jug shortened (340 to 250 pt) so the lime level is in view above the "Add spend" bar. Done and re-captured.
2. home-empty.dark: brim tick drew light on lime; ticks at the level now use the on-level ink. Done and re-captured.
3. month.large: legend swatches stayed 22x12 pt beside very large text; they now scale with text. Done and re-captured.

Earlier rounds: round 1 fixed the four largest-text defects listed above and moved the bottom pills to a system safe-area bar so rows blur under them. I looked at round 1 and fixed it without writing its critique down first; this file records those findings after the fact.

Open after three rounds, not fixed: add reads as a template form; add-saved has an empty lower third; add.large needs a scroll to reach the keypad.

## Could not check
- Motion, haptics and sound cannot be judged from stills. The level-settling animation on save and the success haptic were not seen or felt on a device; the code path was read, not exercised by hand. There is no sound.
- Not run: a physical device, VoiceOver, increased contrast, reduce motion, right-to-left, iPad, landscape, small phones.
- The "Cancel" hit region (C10) was not measured beyond the accessibility frame the tool reported.
- States not captured: paid and month with no spends, the over-limit line on the add sheet, the Haptics menu open.
