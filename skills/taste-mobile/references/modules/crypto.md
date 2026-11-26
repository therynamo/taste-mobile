# Crypto trust module

**Applies when:** the app holds keys, signs transactions, connects to dApps, or swaps or trades
tokens.

This module layers on top of `money.md`; every money-core rule still applies. Open it before
building a signing sheet, a connect sheet, a send flow, a swap screen or a token list. For any
self-custody app the signing sheet is the hero surface and this module is mandatory.

## Evidence status

Nine store listings were checked (Venmo, Coinbase Wallet, Phantom, Rainbow, Family, Zerion,
Uniswap, Kraken, Rabby). None shows a transaction simulation, a balance-delta preview or a
severity-tiered signing warning, including the two apps this module is built on. The requirements
stand, but they are split below by how they are known.

## Visible in the corpus

Build these as described. Each was seen on screen in store frames.

| Requirement | What to build | Seen in |
|---|---|---|
| Verified badges | A small check glyph in a scalloped badge beside token names and dApp names. | Coinbase Wallet, Zerion, Rainbow, Family |
| Connect sheet anatomy | dApp icon, bold name, verified domain, then Cancel and Connect pills of equal width. Also name the wallet and the chains being connected, and add a help button. | Rainbow, Family |
| Position-risk chips | A small tinted chip next to the number, with a state word (`Health factor 16.84 · Healthy`). | Rabby |
| Approvals management | A first-class entry for token approvals: a tile on the home grid next to Send and Swap. | Rabby |
| Pending sends above history | Lift the in-flight send above the activity list, with a progress ring or a toast at the top of home. It stays in view until it settles. | Family, Kraken |
| Masked balances | A static mask with an eye-glyph toggle on the balance. | Rabby, Venmo |
| One grey fee or slippage line | Before a trade, show fee, rate or slippage as a single grey line with an info icon. | Coinbase Wallet, Uniswap, Kraken |

Limits of this evidence:

- The seen connect sheets show no permissions and no risk. Do not treat them as a complete
  signing sheet.
- The risk chips cover position risk (lending health, leverage), not signing risk.
- Activity rows seen in Family put a grey verb line ("Sent to", "Swapped") above a bold object.

## Text-sourced, not visually verified

These are requirements. Build them, and do not cite any app's screen as proof of how they look.

| Requirement | What to build | Status |
|---|---|---|
| Simulated balance delta | Before signing, show which tokens leave and which arrive. | (text-sourced) |
| Label/action mismatch flag | Compare the site's label with the simulated action, so a "Claim" that is really a "Transfer" is visible. | (text-sourced) |
| Tiered pre-sign alerts | Two severities: yellow and red. | (text-sourced) |
| Honest "could not simulate" state | Say plainly when simulation was not possible. Reference copy: "This dApp could be malicious. Do not proceed unless you are certain it is safe." | (text-sourced) |
| On-chain enforcement of the preview | Where the chain allows it, enforce that the previewed state changes are what happens (Phantom's Guard Instructions). | (text-sourced) |
| Scam-token auto-hiding | Hide scam and malicious tokens from the list by default. | (text-sourced) |
| Warning labels before trading | Label risky tokens before the trade step. | (text-sourced) |
| Shimmering hidden balances | A hidden balance shimmers to show it is still updating. Only the static mask was seen. | (text-sourced) |

Rules that follow from these (text-sourced):

- A preview that only restates intent is not a preview. Instead: show the simulated outcome.
- No green "Verified" or "Safe" badge without a risk check behind it. Instead: show the badge only
  where the identity was verified, and show the domain next to it.
- Security copy is blunt and imperative, and honest about uncertainty. No reassuring green check in
  place of a warning.
- Friction scales with irreversibility; see the confirm rules in `money.md`.

## Colour: brand must not collide with semantic

- The brand colour never doubles as gain, loss, success or warning. Two collisions were seen:
  a 30-day gain drawn in the brand cyan while row gains are green (Coinbase Wallet), and green used
  for both the Send button and gains (Rabby). Instead: gains use semantic green only, and the
  primary action is an ink pill.
- Debits stay neutral, as in the money core: grey, navy or violet ink were seen. Red is for market
  price change.
- Keep semantic green and red "not neon" (text-sourced).
- The common in-app look in the nine listings is a calm light or black portfolio list with
  semantic green and red, with brand colour pushed out to the wrapper.

## Two cliches that still ship

| Cliche | Seen in | Instead |
|---|---|---|
| Iridescent 3D coins inside UI promo cards | Kraken | Keep in-app cards to data and plain token icons. If 3D art exists, it stays in marketing frames. |
| Electric-cyan CTA on navy (`#0a0f15`) | Coinbase Wallet | An ink-pill primary action. For the shell, a pastel-light theme or black with one soft accent, as most wallets now ship. |

Older cliches are weak tells, documented only in opinion pieces (text-sourced): neon on black,
cosmic imagery, floating 3D coins or gradient orbs as a hero, dots-and-lines networks. Avoid them
by default. Instead: lead with the portfolio list and the balance.

Other tells seen in this batch: emoji as section icons, unlabelled sparkle glyphs, and mixed cents
treatments within one app (Rabby, Coinbase Wallet, Kraken, Family and Venmo all mix).

## Mascots and characters

- A mascot or character never appears on a signing, approval or connect screen. Instead: those
  screens carry identity, the delta, the risk state and the two actions, nothing else.
- Characters, card art, notes and emoji belong in the brand shell: onboarding, marketing, rare
  milestones. Never on the amount or the signing sheet.
- Evidence note: Phantom shows no ghost on any screen in its listing, so there is no on-screen
  example of a mascot wallet honouring this rule. Do not cite one. (text-sourced rule)
- Celebration is for rare events such as a wallet backup, never for a send, swap or signature.
  (text-sourced)

## Lint and checks

- Every signing path renders a balance-delta component before the sign action is enabled.
- A "could not simulate" state exists and has its own copy and severity.
- Alert severity enum has exactly the tiers yellow and red, each with a distinct treatment.
- Connect sheet contains: icon, name, verified domain, wallet, chains, two equal-width pills.
- Token and dApp names can render a verified badge; the badge is data-driven, not hard-coded.
- Approvals management is reachable from home in one tap.
- A pending send renders above the history list until it settles.
- Balance has a mask toggle with an eye glyph.
- Trade and swap screens have exactly one grey fee, rate or slippage line with an info icon.
- Scam-flagged tokens are hidden by default.
- Brand hue is not used for any gain, loss, success or warning token.
- No mascot, character or illustration asset is imported by signing, approval or connect screens.
- No 3D coin art inside in-app cards; no electric-cyan primary on a navy ground.
- No celebration effect in send, swap or sign handlers.
- All `money.md` lints pass, including one cents treatment per app.

## Sources

On-screen evidence is the round 3 visual pass (`research/reports/Mobile app visual corpus pass.md`).

- https://support.rabby.io/en/articles/14124199-understanding-rabby-s-transaction-simulation
- https://help.phantom.com/hc/en-us/articles/43483612411411--This-dApp-could-be-malicious-Do-not-proceed-unless-you-are-certain-it-is-safe
- https://phantom.com/learn/blog/anti-spoofing-security
- https://www.theblock.co/post/414115/coinbase-rebrands-base-app-back-to-coinbase-wallet-after-just-over-a-year-as-social-experiment-falls-short
- https://apps.apple.com/us/app/uniswap-wallet/id6443944476
- https://hn.jakechampion.name/reader/https://benji.org/family-values
- https://designprotocol.substack.com/p/rainbows-color-strategy
- https://crypto.news/crypto-design-trends-from-rebellion-to-simplicity-opinion/
