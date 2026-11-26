# Tells registry

Patterns that make a mobile app read as a default or a template. Open it when reviewing a screen,
a flow or a store listing, and before settling a palette, a type pairing or a home layout.

**Registry date: 2026-11.** Defaults move: the purple gradient in 2025, cream + serif + orange in
2026. Expect the next one. Escapes turn into defaults too: haptic spam, squish on every touchable,
warm serif as the way out of Inter.

Report a hit as "reads as a default" or "reads as a template". Never guess how an app was made.

## Scope rules (apply these before any tell fires)

1. **Purple.** Brand-owned purple confined to tokens does not fire (seen in Nubank, Mercury,
   Discord, Kraken). Content-driven purple does not fire (Moonlitt's night sky, The Outsiders'
   per-metric washes). The tell covers only unowned purple-to-blue gradients in chrome.
2. **Emoji.** Allowed inside toy-style directions (Rooms' action tiles) and in user-chosen content
   (categories, project icons, the user's poster). Fires on emoji used as the app's own icons.
3. **Cream + serif + orange.** Fires only when copied, or when no governing asset anchors it. It
   is one combination; no single part fires.
4. **Chrome only.** Every tell is scoped to chrome, never to user-authored surfaces (posters,
   wallpapers, categories, themes). Store marketing frames are judged apart (last section).

A hit is a warning to justify, not a verdict: 69 of the 114 corpus apps carry at least one tell.

## The registry

Detect codes: **G** grep or lint on code, **T** accessibility or view tree, **S** screenshot
judgement, **R** running app or flow capture, **X** cross-screen or cross-brief comparison.
Order: how often the community and the corpus saw it. (n/114) is the app count in the
store-screenshot corpus; rows without one come from community threads and peer catalogs.

| Tell | Scope / when it does NOT fire | Instead | Detect |
|---|---|---|---|
| **Converged chat skeleton**: circular menu top-left, new-chat capsule top-right, tinted user bubble over bubble-less prose, composer with +, mic and a filled voice disc (sameness 7/114, with the next row) | Fires on the whole skeleton, never on one part | Change the page structure or add a status visual that encodes state; see `modules/chat-ai.md` | X, S |
| **Neobank home template**: centred balance over a row of three or four round labelled action buttons | The money-core rules themselves (label above the balance, one currency format) | Keep the money core; compose the home from the dealt direction's governing asset | X, S |
| Crashes, slow launch, missing empty, error or loading states | none | Build the empty, error and loading states before polish | R |
| Emoji as the app's icon system, in headers, tabs or Live Activities (20/114, 10 in chrome) | Scope rule 2 | One drawn icon set: system icons or an authored set | G |
| Onboarding or paywall "out of nowhere": quiz funnel, three-slide carousel, paywall on screen two, permission prompt on cold start | A paywall the user opened | Show a real, differentiating feature early in the first session; ask for a permission when the feature needs it | R |
| Purple-to-blue gradient on heroes and CTAs (`#6366F1`, `#8B5CF6`, `#7C3AED`); default `#007AFF` or `#6750A4` as the only brand colour (purple 11/114, all exempt) | Scope rule 1 | One owned colour, named as a token and used with intent | G, S |
| Gradient backgrounds and gradient text (15/114) | Gradients that carry meaning or come from content or a user choice | Flat surfaces; tint from content only (a cover, an artwork) | G, S |
| Entrance animation on every element; staggered fade-up (`delay: i * 0.1`, `FadeInDown.delay(i * 100)`) | The one hero moment | Lists appear in place; keep motion for state changes | G, R |
| Per-screen drift: button shape or style changes screen to screen; navigation chrome rebuilt per screen; a tab bar that gains or loses an item between screens (1/114, Cal AI) | none | Define buttons and chrome once; reuse them on every screen | X, T, S |
| Cards everywhere (19/114): icon top-right, title top-left, description bottom; an icon in a 40x40 tinted rounded square on every row; stat triplet or 2x2 stat grid; left-border accent cards | Cards that hold real content; weak on its own | Plain rows and sections; a card only for one self-contained object | S, T |
| Fake data: "John Doe", "Jane Doe", "Acme", "$99.99", invented testimonials | none | Plausible domain data and designed empty states | G |
| Keyboard that will not dismiss on tap-outside; full keyboard on a numeric amount field; keyboard hiding the input or the submit button | none | Dismiss on tap outside; match keyboard type to the field; keep field and submit visible | R, T |
| Subtitles on everything; descriptions of obvious UI; an eyebrow label over every heading | Tool descriptions in a chat "+" sheet, which are required | Label only what is not obvious | G, T |
| Not native: hand-rolled header and "< Back", left-arrow back on iOS, hamburger or FAB as primary navigation on iOS, iOS chevrons on Android, Settings or Logout as a tab (2/114) | A declared custom cross-platform posture (seen in Discord) | Platform navigation containers and back behaviour; conventional placement, labelled | T, S, G |
| Generic font: Inter or Geist standing in for the system face; Poppins or Nunito (3/114) | System type for UI text is never a tell; a face the brand chose | System face for body; identity from one governing asset and at most one display treatment | G |
| Neon glow and glowing badges (10/114) | Glow that encodes a state (Raycast's record rings) | Glow only as a state signal | G, S |
| Unstyled default sheet; white background, grey borders, system sizes, default controls (1/114) | none | Style sheets and controls with the direction's colour, size, spacing and radius tokens | S |
| Flat, opaque bars on iOS 26 in a cross-platform build (3/114, all stale frames) | Other platforms: never replicate glass where the platform lacks it | Native bar material as a fixed chrome recipe: a capsule tab bar of 3 to 5 items, circular header buttons | T, S |
| Safe-area gaps, a grey top inset against the theme, double titles, ads covering controls, magic `paddingTop: 50` | none | Lay out from safe-area insets; one title per screen | T, G |
| Sparkle with no label; sparkle for a non-AI meaning; shimmer "thinking" text on other async work (6/114) | A labelled sparkle; sparkle in user content | Add a text label; see `modules/chat-ai.md` | G, T |
| Cream ground + serif reading face + orange or terracotta accent, the 2026 default (5/114) | Scope rule 3; a non-orange accent (seen in Pi, Granola) | A non-orange accent or a non-cream ground, plus a governing asset | G |
| Streak counter with a fire emoji (5/114) | An illustrated, owned version | No streak by default; show progress with the direction's own asset | G |
| Dead settings rows, a toggle persisted nowhere, one real tab, a product "optimized for screenshots" | none | Ship only rows and tabs that work; cut the rest | R, T |
| Copy: "Welcome back, John!" with a wave emoji; exclamation voice; "Elevate", "Seamless", "Supercharge"; `Alert.alert` for success or validation; placeholder used as the label | none | Plain, specific copy; a visible label per field; feedback shown in the screen | G |
| Generated-looking app icon; machine-translated strings that mix registers ("usted" and "tu"); boilerplate release notes | Weak alone; never flag on the icon by itself | Draw the icon from the governing asset; one register per locale; notes that name the change | S, G |
| 3D iridescent coins inside UI cards | none | Plain token icons; a verified check badge beside token names | S |
| Electric-cyan CTA on navy | none | Primary action as a black or white ink pill; brand colour stays off semantic colour | G, S |
| Mixed cents treatment within one app | none | Pick one treatment once (same size, small on baseline, superscript, or dropped) | G, X |
| ASCII hyphen used as a minus sign | none | A true minus or an en dash before amounts | G |
| Wallet balance with an add-funds button in the top bar of a non-betting app | Betting and pick'em apps | Balance on the home surface with its label above it | T, S |

Watch item: grey two-tone cents. A money-core option today; it becomes a tell if it spreads.

## Downgraded: do not flag

- Rounded pills, glassmorphism, bento grids, aurora or blob backgrounds. Low counts and strong
  pushback that they predate the current wave; the aurora count was a keyword artifact.
- Em dash and the shadcn/Tailwind kit. Zero hits in the mobile sample; these are web tells.

## App Store 4.2 and 4.3 pre-submission check

Apple's clauses are about thinness and sameness: 4.2 wants features and UI that "elevate it beyond
a repackaged website"; 4.2.6 rejects apps "created from a commercialized template or app
generation service"; 4.3(a) forbids near-duplicates and is judged across the whole account;
4.3(b) refuses apps "indistinguishable from what's already widely available".

Flag before submission:

- Dead settings rows (Account, About, Terms, Privacy that lead nowhere).
- One-real-tab layouts.
- A web view as primary content.
- The habit-tracker template: habit list, daily checklist, streak counter, reminder and settings
  page; three onboarding questions that drop into one empty list (vendor list, unverified).
- Screenshot or metadata sameness: the same hero copy with only a colour swap (unverified, but
  cheap to check). Run the X comparison across the developer's own apps, not only across briefs.
- A saturated 4.3(b) category: dating, flashlight, sound effects, wallpaper, simple timers,
  fortune telling. Instead of proceeding as is, make the plan name a differentiating feature that
  is visible early in the first session.

**Bolting on native features is not a fix.** A May 2026 4.2 notice said "push notifications, Core
Location, or sharing do not provide a robust enough experience". Instead, deepen the core flow.

**Store-listing tell: award, laurel or press-logo screenshot frames** (27/114). It is a marketing
tell for the screenshot check and never counts against the in-app design. Instead, spend those
frames on real screens.

## Sources

- https://developer.apple.com/app-store/review/guidelines/
- https://developer.apple.com/forums/thread/822686
- https://www.reddit.com/r/iOSProgramming/comments/1t8bm21/rejection_from_app_store_42/
- https://ptkd.com/journal/app-store-rejection-4-3-a-ai-slop-design-spam
- https://github.com/JCarterJohnson/vibecoded-design-tells
- https://www.reddit.com/r/iosdev/comments/1ua360i/what_are_the_obvious_tells_that_a_swiftui_app_was/
- https://blog.jim-nielsen.com/2026/ai-aesthetic/
- https://github.com/draftbit/mobile-taste-skill/blob/main/skills/_shared/references/tells.md
- https://github.com/expo/skills/blob/main/plugins/expo/skills/expo-design-system/references/native-slop.md
