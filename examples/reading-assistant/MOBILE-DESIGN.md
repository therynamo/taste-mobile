# MOBILE-DESIGN.md

The written commitments for this app. `deal.mjs` filled in what was dealt. Replace every TODO
before writing UI code. `gate.mjs` reads this file and fails while a TODO remains.

## Brief
- App: Margin Notes, an iPhone reader's companion: someone part-way through a novel asks a question about it, gets an answer that points to numbered passages in the book, and keeps the answers worth keeping.
- Kind: chat-ai (AI assistants, agents, answer engines, AI notes)
- Audience: general
- Platform: ios
- Stack: expo
- Brand assets given: none

## Direction
- id: typographic-writing-surface
- name: Typographic Writing Surface
- seed: 641548
- Why it fits this brief: the reader is already looking at a page, so the question, the answer and the cited passages are all set on that page instead of in a chat thread.

## Governing metaphor
In this app, an answer becomes a footnote set on the page of the book it is about.

## Governing asset
- Dealt: the page itself as the interface, with 28-30 pt margins
- What it is in this app: one page block with 30 pt margins. Body text never enters the margin; the only things hung in the left margin are note numerals, and each numeral points at a passage in the book. Every page carries a running head at the top and a folio (page number) at the foot.
- Where it appears: the book page (margin numeral beside a cited paragraph, footnotes under a short rule), the answer page (a numeral beside each paragraph, with the quoted passage and its page reference set under it), the kept index (numerals and page references set as a back-of-book index), the type sheet (a specimen page), and the empty and error states (the same page furniture with nothing on it).

## Display treatment
- Dealt: a face the user chooses per document
- The one place it is allowed: words that are the book or annotate it (book text, quoted passages, answer prose, the chapter opener). The reader picks the face per book from faces that ship with iOS: Iowan Old Style (default), New York, Charter, or San Francisco. Everything the reader types or taps (questions, labels, buttons, status lines) stays in the platform face.
- Body type: the platform face, unless the brief supplies a brand face.

## Restraint rule
- Corpus warning: Warning: flag persistent formatting toolbars, tab bars or feature chrome that compete with the page. Advanced features stay hidden until invoked (text-sourced from bear).
- My rule for this app: Never put an answer in a bubble, a card or a thread: it is set on the page, and the accent is spent only on the numerals and page references that point into the book, plus the ribbon of a kept answer.

## Axes
- Shell: quiet: chrome recedes until asked for
- Mode: user-chosen page tint
- Density: low
- Composition: editorially fixed
- Depth: none
- Posture: native iOS: system bars, sheets, gestures and glass come from the platform
- Material: Liquid Glass is chrome only: system tab bar, toolbars and sheets. It is never the identity.

## Modes
- Supported: light and dark. The page tint is the reader's choice (Match system, Bone, Fog, Night); Match system is the default, so the light pass shows Bone and the dark pass shows Night.

## Colour roles
| Role | Light | Dark | Used for |
|---|---|---|---|
| paper | #F3F4F1 (Bone) / #E4E8E8 (Fog) | #131514 (Night) | The page: every ground, including the sheet and the ask line. A cool white, not cream |
| ink | #1A1C1B | #E9E8E3 | Book text, answer prose, questions, the one filled button |
| inkSoft | #575C59 | #A3A8A4 | Running heads, folios, status lines, secondary labels |
| rule | #C5C9C3 | #3A3F3C | Hairlines: the footnote rule, the ask line, index dividers |
| ribbon | #8A2B2B | #E8948B | Note numerals, page references, the kept ribbon. Nothing else |
| mark | #EADFDC | #2E1F1E | The wash behind a cited passage on the book page |
| onInk | #F3F4F1 | #131514 | Text on the filled ink button |

## Hero moments
Budget: 2. Everything else stays calm.
1. chrome receding when writing starts: focusing the ask line fades the page text back so the question is the only full-strength thing on the page
   - spring: spring.effects (opacity only, bounce 0); under Reduce Motion a 180 ms crossfade
   - haptic: none (focusing a field is a plain tap)
   - sound: none
2. switching between documents or slots: this app holds one book, so the slot change is an answer moving into the kept index. The ribbon drops from the top edge of the page when an answer is kept
   - spring: spring.default (response 0.4 s, bounce 0); under Reduce Motion a 180 ms opacity crossfade with no travel
   - haptic: success notification, fired after the answer is written to the kept store
   - sound: none

## Motion scheme
- standard: Critically damped springs everywhere (bounce 0). On Android, the M3 Standard scheme. No overshoot on any flow that moves money, signs or deletes.

## Haptic profile
- standard: The mapping table in references/haptics-sound.md, with nothing on scroll, navigation or plain taps.

## Modules
- chat-ai: read references/modules/chat-ai.md. A direction cannot override it.

## Screens
| Screen | Job in one sentence | Deep link or launch argument |
|---|---|---|
| book | The page the reader is on, with footnotes for kept answers and the ask line at the foot | `-screen book` (no kept notes: `-state empty`) |
| passage | The book opened at a cited passage, marked, with its note numeral in the margin | `-screen passage -passage 2` |
| answer | One question and its answer, each paragraph tied by numeral to a passage; keep it here | `-screen answer` (mid-stream: `-state streaming`; failed: `-state error`) |
| kept | Kept answers set as a back-of-book index, grouped by the chapter they were asked from | `-screen kept` (none kept: `-state empty`) |
| type | Native sheet: the book's face, the page tint, haptics | `-screen type` |

## Not doing
- No chat thread: no bubbles, no avatars, no new-chat capsule, no plus-and-mic composer. One question makes one note; a follow-up is a new question asked from the page.
- No tab bar and no persistent toolbar. Kept answers and type settings sit behind two quiet header items; nothing competes with the page.
- No sparkle, shimmer, glow or orb for the assistant. Its state is said in plain status lines ("Read chapters 1 to 9", "Found 3 passages") and it never reads past the reader's place.
