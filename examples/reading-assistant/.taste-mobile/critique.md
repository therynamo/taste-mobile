# Critique, round 3

Look at every screenshot in `.taste-mobile/shots/` (open `contact.html` to see them side by side).
Answer each pass for the screens it applies to. Write findings as "reads as a default" or "reads as
a template", name the screen, and say what to change. Then pick the top three fixes.

Screens: book, answer, answer-streaming, answer-error, passage, kept, kept-empty, type
Device: taste-mobile-reading-assistant (iOS 26.5)

All 24 screenshots of this round were opened and read one by one (8 light, 8 dark, 8 largest text).

## Checks from capture
- WARN C10 (type, tree): 2 controls with an accessibility frame under 44x44 pt (1 under 28 pt): "Sheet Grabber" 73x24, "Done" 55x42. Confirm the hit region is 44x44 or larger.
- Not waived. "Sheet Grabber" is the system grabber of the native form sheet, not a control this app draws. "Done" is a header bar item with `minHeight: 44` in code; the system bar reports its frame as 42 pt high. Its real hit region was not measured, so this stays an open warning.

## One second
After one second, what is this screen for and what is its main action? If you cannot say, the hierarchy is wrong.

- book: a page of a book with an ask line at the foot. Clear. The "Ask" label is grey while the line is empty, so the main action is the placeholder, not the button; acceptable, but the button reads weak.
- answer: a question, then numbered paragraphs each followed by the quoted passage and its page. Main action "Keep this answer" / "Kept · remove" at the foot. Clear.
- answer-streaming: the three steps are ticked, the answer is part written, "Writing from 3 passages" has the spinner, the keep button is disabled. Clear.
- answer-error: says why it stopped and that no answer was written; one action, "Try again". Clear.
- passage: the cited paragraph is washed and numbered, with the question it answers as a footnote. Clear.
- kept: an index of kept answers under the chapter they were asked in. Clear.
- kept-empty: says nothing is kept and how something gets here; one action. Clear, but the lower two thirds of the screen are empty paper.
- type: a specimen, four faces, four page tints, a haptics switch. Clear.

## Squint
Blur your eyes. One thing should dominate, and it should be the thing that matters. Hierarchy must survive without colour.

- book, passage: the block of book text dominates; on passage the washed paragraph is the darkest area. Right.
- answer: the answer paragraphs dominate; quotes are a step lighter and indented behind a rule. Right. The outlined "Kept · remove" pill is as heavy as the question title; acceptable.
- kept: the three sans questions are the darkest marks, which is what you scan for. Right.
- kept-empty, answer-error: the filled ink button is the heaviest thing on the screen, heavier than the explanation. On answer-error that is correct; on kept-empty it slightly outweighs a secondary action.

## Cover the logo
Hide the name and logo. Could this be any app? Name the governing asset you can see on this screen.

- The governing asset is the book page: running head with a hairline rule, numerals hung in the left margin, serif text set as a page, a folio at the foot. Visible on book, passage, answer, answer-streaming, kept. There is no bubble, card or thread anywhere.
- The ribbon hangs from the running-head rule on answer (kept) and kept. It is absent on answer-streaming, answer-error and kept-empty, which is the intended meaning.
- type reads closest to a default: a list of rows with a tick and a row of swatches in a system sheet. The specimen line in the chosen face is the only part that is specific to this app.
- answer-error and kept-empty read as a template empty state (text block, full-width button) apart from the running head.

## Thumb reach
The primary action sits where a thumb reaches. Targets are 44 pt (48 dp) or larger with space between them.

- book, passage: ask line at the foot. answer: keep button at the foot. Both in reach.
- answer: each quoted passage is a full-width press target taller than 44 pt. "Show steps" is a full-width row 44 pt high.
- kept: each entry is a full-width target. Top bar items (Kept, Aa, back, Done) are at the top, as system bar items are; "Done" is reported 42 pt high (see checks).
- kept-empty, answer-error: the one button sits in the upper half, out of easy reach. Not fixed.

## Trunk test
Dropped onto this screen cold: where am I, how did I get here, where can I go next?

- Every screen carries the book title in the running head and what this page is on the right (chapter, "Asked at p. 148", "Index").
- answer, passage, kept have a back button and were opened with the screens beneath them on the stack, so back works from a direct launch.
- passage: the footnote says "Passage 2 of 3 in this answer" under the question, which is how you got here.
- book: "Kept" and "Aa" are the two ways out. "Aa" is a convention, not a label; its accessibility label is "Type and page".

## Dark
Dark is designed, not inverted: surfaces stay distinct, colour roles keep their meaning, text keeps its contrast.

- book, answer, passage, kept, kept-empty, answer-error, answer-streaming: the paper is a warm near-black, text is off-white, the ribbon colour is lifted to a salmon so numerals and page references keep their role. The passage wash is a dark red-brown and still reads as a mark.
- answer-streaming (dark): the disabled keep button is low contrast, grey on grey. It is disabled, but the label is hard to read.
- type (dark): the "Night" swatch is the same colour as the sheet behind it and is only told apart by its hairline border.

## Largest text
At the largest text size nothing is clipped, overlapped or truncated into nonsense, and the layout reflows.

- Nothing is truncated or overlapped in the eight largest-text screenshots. The running head stacks to two lines, hung numerals become an inline label ("Passage 1", "Kept answer 1"), the status row stacks above "Show steps", step ticks scale with the text, the keep button moves into the page flow.
- book, passage (large): the ask-line placeholder takes two lines, so about three lines of book text are visible at once. It scrolls, and nothing is cut off, but reading is cramped.
- type (large): the sheet shows only the specimen; the faces, tints and switch are a long scroll below.
- kept (large): one entry fills the screen.
- Text sizes are capped per style at the iOS AX5 size for that style (React Native otherwise scales every style by the same 3.57). No text is fixed-size except bar items, which follow the system bar's own cap.

## Sameness
Across screens: one button shape, one chrome, one radius scale, a tab bar that never changes. Across projects: does this look like the last app you built?

- One button shape (ink pill, filled or outlined), one running head, one rule weight, no tab bar by design. Type roles are consistent: serif for the book and words about it, sans for furniture and questions.
- The answer page does not look like a chat app, which was the point. The type sheet and the two empty/error states are the least distinctive screens.

## Top three fixes this round
1. Remaining, not fixed (round limit reached): book and passage at the largest text size give too little room to the page; shorten the ask line to one line there.
2. Remaining, not fixed: kept-empty and answer-error put their one button in the upper half and leave the rest of the page blank; move the action to the foot like the keep button.
3. Remaining, not fixed: type sheet at the 0.75 detent cuts the Haptics row at the sheet edge, and the Night swatch has no contrast in dark.

Fixed in round 1 (after capture 1): blank type sheet; unbounded text scaling; ribbon shown on streaming and error states; passages below the fold; kept index numeral alignment.
Fixed in round 2 (after capture 2): status row squeezed beside "Show steps" at large text; step ticks not scaling; fourth tint swatch wrapping alone; stray "Index" folio under the empty state.

## Could not check
- Motion, haptics and sound cannot be judged from stills. The two hero moments (chrome receding when the ask line takes focus; the ribbon dropping when an answer is kept), the word-by-word stream, the reduced-motion branch and the success haptic were not seen or felt on a device. Only their code was read. There is no sound in this app.
- VoiceOver was not run; only the accessibility trees saved by capture were read by the C10 check.
- The real hit region of the "Done" bar item was not measured.
- Typing a question and the "found no passages" state were not captured; no launch argument was made for them.
- Android was not run (iOS only by the brief). No physical device was used.
