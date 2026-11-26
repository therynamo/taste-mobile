# Money core

**Applies when:** the app shows a balance, moves money, budgets, or tracks investments.

The money core is the part of a money app that does not vary, whatever art direction is dealt on
top. Open it before building a balance, a transaction list, amount entry or a confirm step.

## Visible conventions

Seen on screen in store frames of nine finance apps, plus nine crypto and payment apps where noted.

| Rule | What to do | Lintable form |
|---|---|---|
| Spending is neutral ink | Set debits in the text ink colour. Use red only for investment loss and for over-limit or overspend. Give credits a plus sign; green on credits is optional. | No red on ordinary debit rows. Colour roles limited to the five below. |
| Label above the balance | Put a smaller, regular-weight label above the hero figure (7 of 9 finance apps, 5 crypto apps). | The hero balance has a label node above it. |
| Currency symbol full size | Set the symbol at the same size as the digits, with no space before them (8 of 9). Use one format everywhere. | One currency format per app. Flag `$ 2,394.08` next to `$2,394.08`. |
| One change-line grammar | Order: arrow or triangle, amount, (percent), period. Up is green. The quietest form colours only the triangle (seen in Uniswap). | Tokens in that order. Flag colouring the whole line by default. |
| Bare hero chart | One line on a bare field: no axes, no gridlines. Put a range-chip row below it; the selected range is a filled pill (4 of 4 apps with a line chart). A dotted reference line is allowed. | No axis labels or gridlines on the hero chart. |
| Ink-pill primary action | Make the primary action a black or white ink pill, not the brand colour. This matters most on the confirm step. | Flag a brand-coloured primary on the confirm step. |
| Cents chosen once | Pick one treatment and use it on every amount: same size as units; smaller on the baseline; raised superscript; grey two-tone at the same size; or dropped on balances. | Flag mixed cents treatments within one app. |
| True minus | Use a true minus sign or an en dash for negatives, never a hyphen. Keep the thousands separator on negative amounts. | Grep for an ASCII hyphen before amounts. |

Notes on the table:

- Loud shells drew the chart as a bare stroke (Robinhood, Cash App); quiet shells used a gradient
  fill (Monarch, Mercury).
- Grey two-tone cents (seen in Zerion, Uniswap) is an option today and a watch item: it becomes a
  template tell if it spreads.
- Balance weight is a free choice: bold in consumer apps, regular or medium in investing and
  premium apps.

## The five colour roles

| Role | Used for | Treatment |
|---|---|---|
| Credit | Income, money in | Plus sign; green optional |
| Spending | Ordinary debits | Neutral ink |
| Loss / over-limit | Investment loss, overspend, over-limit | Red |
| Interactive | Links, selection, net figures | One colour, separate from the semantic set |
| Pending / warning | Pending and unsettled items | Yellow or amber |

- Keep the set closed. Do not add a sixth money colour.
- Keep semantic colours "not neon": a green that is "bright but not neon", a red that is "clear but
  not alarming" (text-sourced).
- Example values from third-party teardowns (text-sourced): credit `#34D399` or `#00CC4B`, pending
  `#FBBF24` or `#FECE4C`, interactive `#1C6CFF`.

## Functional rules enforced in code

- **Tabular figures.** Turn on `tnum` for every amount in lists, tables and live-updating figures.
  This is a functional rule checked in code, not a visual signature: none of the 18 finance and
  crypto records confirmed tabular figures on screen, and columns aligned by right edge only. Do
  not claim any app as proof of it.
- **Money math in integer cents.** Finance launches now state this up front to earn trust.
- **Test the formatter on the real runtime.** React Native: `Intl.NumberFormat.formatToParts`
  crashed on Hermes in one skill-pack evaluation. Treat money formatting as a regression gate.

## Brand colour stays in the shell

- Put the owned colour on one shell surface: a pay screen, an account card, a header, a logo token.
- Never let it reach transaction lists, status colours or the confirm sheet. Instead: lists are ink
  on a plain ground, status uses the five roles, and the confirm button is an ink pill.
- Never reuse the brand hue as a semantic colour (for example a brand-coloured gain figure, or a
  green Send button beside green gains). Instead: pick a brand hue that is not a role colour.
- Seen holding in Cash App, Monzo, Nubank and Klarna lists. Nubank's purple confirm button and
  Mercury's indigo Send pill break the confirm rule.

## Convergence risk: the neobank template

A centred balance over a row of three or four round labelled action buttons reads as a template. It
appears in Revolut, Nubank and Klarna, and in squircle form in Wealthsimple.

- Do not default to it. Instead: let the dealt direction shape the home screen. A chart at the top
  of home and an account card were both seen as alternatives.
- Related tells: unlabelled identical round buttons over a list with a decorative sparkline
  (text-sourced); a wallet balance in the top bar of a non-betting app.
- A card graphic on home that carries no data is a tell (text-sourced). Instead: make colour or
  artwork tell accounts apart.

## Text-sourced rules, not verified on screen

These three come from maker essays and press. No store frame shows them.

- **The amount animates from entry into confirmation**, so that "the amount entered is indeed the
  amount being sent". Morph the button label; do not swap it. (text-sourced)
- **Hidden balances shimmer** to show they are still updating. Only a static mask with an eye glyph
  was seen on screen. (text-sourced)
- **Trades confirm with a swipe**: swipe up to confirm, designed for "no accidental orders".
  (text-sourced)

More behaviour rules from the same sources (all text-sourced):

- Friction scales with irreversibility. No one-tap commit on an irreversible move. Instead: a
  confirm sheet, swipe or hold.
- An assistant never moves money without a confirmation sheet.
- No confetti or particle bursts on sends, trades or swaps. Instead: save celebration for rare
  moments such as a backup or a milestone.
- Errors use the active voice and name the actor ("we blocked the payment"). Aim for three words
  or fewer on short copy. No passive, legal-sounding errors.
- Charts are navigation: they scrub, and the numbers and arrow update with the scrub.

## Motion

- Android (Material 3): use the Standard motion scheme for the whole product. Material describes
  Standard as the scheme "for utilitarian products".
- Never use the Expressive scheme on money flows: entry, confirm, send, trade. Instead: Standard
  springs there, with emphasis saved for a rare hero moment outside the flow.
- Google's own banking caveat: "No amount of emotion can compensate for a lack of clarity."

## Anti-references

| Anti-reference | What it is | Instead |
|---|---|---|
| Social Ledger | Feed-first money: a public feed of payments with emoji and GIF expression. In retreat: Venmo removed its global feed and Coinbase reversed its social app. No visual exemplar is left. | Money activity is private by default. Keep expression in the note layer of a payment. |
| Funnel-First Utility | Visual identity is subordinate to quiz, plan and paywall pacing (Cal AI). | Let the product screens carry the identity. Reach the first real screen fast. |

## Lint and checks

- No red token on debit rows; red only on loss and over-limit states.
- Exactly five money colour roles; brand hue is not one of them.
- A label node sits above every hero balance.
- One currency format string and one cents treatment across the app.
- No ASCII hyphen before an amount; thousands separator present on negatives.
- Change line tokens in order: arrow, amount, percent, period.
- Hero chart has no axis or gridline elements and has a range-chip row.
- Primary button on the confirm step is ink, not the brand colour.
- Brand colour absent from list rows, status chips and confirm sheets.
- `tnum` set on every amount style; money stored as integer cents.
- Formatter test runs on the shipping JS engine (React Native).
- No celebration effect in send, trade or swap handlers.
- Every assistant-initiated money action routes through a confirm sheet.
- Android money flows reference the Standard motion scheme only.
- Home is not a centred balance over a row of round labelled buttons by default.

## Sources

On-screen evidence is the round 3 visual pass (`research/reports/Mobile app visual corpus pass.md`).

- https://hn.jakechampion.name/reader/https://benji.org/family-values
- https://www.iphoneincanada.ca/2026/11/05/wealthsimple-fey-uikit-trading-app-sneak-peek/
- https://designcompass.org/en/2025/12/03/cash-apps-new-design-language-and-ai-moneybot/
- https://robinhood.com/us/en/newsroom/the-top-secret-robinhood-design-story
- https://monzo.com/blog/weve-made-our-writing-system-available-to-all
- https://blakecrosley.com/guides/design/copilot-money
- https://blakecrosley.com/guides/design/mercury
- https://designprotocol.substack.com/p/rainbows-color-strategy
- https://design.google/library/expressive-material-design-google-research
- https://m3.material.io/blog/m3-expressive-motion-theming
- https://www.theblock.co/post/414115/coinbase-rebrands-base-app-back-to-coinbase-wallet-after-just-over-a-year-as-social-experiment-falls-short
