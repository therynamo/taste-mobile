# Android: Material 3 Expressive rules

Open this before you build or review any Android screen. It holds the M3 Expressive spring
tokens, the motion-scheme ruling, shapes, type, components, spacing, touch targets, contrast and
the behaviours Android 16 enforces.

## Expression as hierarchy

M3 Expressive is not a look to apply everywhere. It is five levers (colour, shape, size, motion,
containment) used "to draw attention to key actions and group related items."

- Make the single most important action unmistakable: the largest filled control, in the thumb
  zone, in its own colour. Google reports people found a Send button four times faster once it
  was larger, above the keyboard and in a secondary colour (self-reported, not replicated).
- Spend expression on 1-3 hero moments per app: the core action, a completion or celebration,
  onboarding or first run (unverified: an inference from Wear OS guidance).
- Keep lists, settings, forms, money and destructive flows conventional and labelled. Banking
  needs established patterns.
- "Expressive can mean quiet. And it can also mean loud." A calm product is still valid.

| Do not | Instead |
|---|---|
| Maximum weight and roundness on everything; it reads as childish. | Emphasize one element per screen. Leave the rest at baseline. |
| Bounce on every element; it reads as "wobbly". | Standard scheme for recurring interactions. Overshoot only on hero moments. |
| A container on every list row; it reads as cluttered and dense. | Contain only groups that need separation. |
| Replace a list with imagery, or drop text labels from actions. Both reduced usability in Google's studies. | Keep the list and the labels. Add expression around them. |
| Material purple `#6750A4` as the only brand colour; it reads as a default. | Deal a palette for the product. |
| A Liquid Glass replica on Android. Reactions to Telegram's port "have not exactly been positive". | Use M3 or M3 Expressive, or an honest opaque surface. See `stacks.md`. |
| Blur as a global aesthetic. | Use blur as a depth accent on sheets, menus and overlays only (text-sourced). |

## Motion schemes and spring tokens

Values are damping ratio / stiffness, from the Compose Material3 token files.

| Token | Standard | Expressive |
|---|---|---|
| FastSpatial | 0.9 / 1400 | 0.6 / 800 |
| DefaultSpatial | 0.9 / 700 | 0.8 / 380 |
| SlowSpatial | 0.9 / 300 | 0.8 / 200 |
| FastEffects | 1.0 / 3800 | 1.0 / 3800 |
| DefaultEffects | 1.0 / 1600 | 1.0 / 1600 |
| SlowEffects | 1.0 / 800 | 1.0 / 800 |

| Choice | Rule |
|---|---|
| Spatial | Position, orientation, size and shape. May overshoot. |
| Effects | Colour and opacity. Never overshoot; alpha must not bounce past 100%. |
| Fast | Small components: switches, buttons. |
| Default | Partial-screen motion: bottom sheets. |
| Slow | Full-screen transitions. |

- A press that changes shape and colour uses two springs: one spatial, one effects.
- Read tokens from `MaterialTheme.motionScheme`. `LocalMotionScheme` is deprecated in 1.5.0.
- Springs can be interrupted and retargeted at the current velocity.

### Motion-scheme ruling

- Pick one scheme per product. Utilitarian, money and pro tools get Standard. Consumer and
  expressive products get Expressive.
- Within a product, swap schemes only to emphasize a hero moment.
- `MaterialExpressiveTheme` at the top level defaults to the Expressive scheme. A Standard
  product must set Standard explicitly.

## Shapes: 35 `MaterialShapes`

Circle, Square, Slanted, Arch, Fan, Arrow, SemiCircle, Oval, Pill, Triangle, Diamond, ClamShell,
Pentagon, Gem, Sunny, VerySunny, Cookie4Sided, Cookie6Sided, Cookie7Sided, Cookie9Sided,
Cookie12Sided, Ghostish, Clover4Leaf, Clover8Leaf, Burst, SoftBurst, Boom, SoftBoom, Flower,
Puffy, PuffyDiamond, PixelCircle, PixelTriangle, Bun, Heart.

- Each is a `RoundedPolygon` with `toShape` and `toPath` extensions.
- The library is still experimental in Compose Material3 1.5.0. Treat the names as vocabulary,
  not a frozen API.

## Type: 15 emphasized styles

Each baseline role has an emphasized twin with the same size and line height. Only the weight
rises. Size / line height in sp.

| Role | Large | Medium | Small | Baseline to emphasized weight |
|---|---|---|---|---|
| Display | 57/64 | 45/52 | 36/44 | Regular to Medium |
| Headline | 32/40 | 28/36 | 24/32 | Regular to Medium |
| Title | 22/28 | 16/24 | 14/20 | Large: Regular to Medium. Medium, Small: Medium to Bold |
| Body | 16/24 | 14/20 | 12/16 | Regular to Medium |
| Label | 14/20 | 12/16 | 11/16 | Medium to Bold |

- Compose names follow the pattern `displayLargeEmphasized`.
- Layouts survive font scale 2.0 with no new truncation or overlap.
- For API 36 targets `elegantTextHeight` is ignored. Leave room for taller line heights in Arabic,
  Thai, Tamil and Telugu.

## Components: 14 expressive components

The stable Compose Material3 1.5.0 release (Nov 18, 2026) carries 14 expressive components. Use
them before building a custom one. Names in the release notes:

- Buttons: `ToggleButton`, `SplitButton`, `ButtonGroup`.
- Toolbars: `FloatingToolbar`, `HorizontalFloatingToolbar`.
- Progress: `LoadingIndicator`, `ContainedLoadingIndicator`, `WavyLinearProgressIndicator`,
  `WavyCircularProgressIndicator`.
- Also: expressive text fields, chips, menus and submenus; `VibrantTimePickerDialog`; standalone
  Sheet and Scrim; Expressive and Segmented `ListItem`; `AppBarWithSearch`.

Material Views 1.14.0 is the last stable Views release. Build new Material UI in Compose.

## Spacing: the 8dp scale

| Rule | Value |
|---|---|
| Base unit | `space100` = 8dp; other tokens are multipliers of it |
| Sub-steps | 2, 4, 6dp |
| Top of the scale | 48, 56, 64, 72dp |
| Search container | 8dp vertical padding, 8dp horizontal gaps, 24dp margins (12dp focused) |

- Prefer padding and gaps to margins. "Material rarely uses margins in components."
- No left/right padding. Instead, use leading/trailing; they swap in right-to-left languages.
- Lint: reject values off the 2dp grid; warn on values off the 8dp grid.
- The spacing tokens ship for Jetpack Compose only. In other stacks, type the dp values.
- Per-breakpoint grid and margin values were not read. Do not invent them (unverified).

## Touch targets and contrast

| Rule | Value |
|---|---|
| Touch target for every interactive element | 48x48 dp |
| Text smaller than 18sp, or bold smaller than 14sp | 4.5:1 |
| All other text | 3:1 |
| Icons, control boundaries, focus and selected states | 3:1 against adjacent colours |

- Compose `Button`, `IconButton` and `ListItem` already enforce 48dp. A custom interactive
  element must set its own size.
- WCAG's 24x24 CSS px is the AA floor, not the goal. Do not size to it. Instead, use 48dp.
- Compose 1.8 `enableAccessibilityChecks()` tests contrast, target size, labels and traversal.

## Android 16 (API 36) enforced behaviours

| Behaviour | Do not | Instead |
|---|---|---|
| Edge-to-edge cannot be opted out. | Rely on `windowOptOutEdgeToEdgeEnforcement`; it is disabled. | Draw behind transparent system bars, pad with insets, and let scroll content pass under the gesture bar. |
| Predictive back is on by default. `onBackPressed` is not called; `KEYCODE_BACK` is not dispatched. | Intercept back with custom handling. | Use the navigation library's back handling so the system preview works. |
| Orientation, resizability and aspect-ratio locks are ignored at smallest width 600dp and up. | Lock to portrait. | Reflow. A navigation bar on a phone becomes a navigation rail on a tablet. |

## Checkable rules

1. One motion scheme per product; a second appears only on a hero moment.
2. Opacity and colour animate with effects springs. No overshoot on alpha.
3. Every touch target is at least 48x48 dp.
4. Text meets 4.5:1 (3:1 at 18sp, or 14sp bold, and larger). Non-text meets 3:1.
5. Spacing sits on the 2dp grid, mostly the 8dp grid. Padding uses leading/trailing.
6. Content draws under transparent system bars; nothing is clipped by the gesture bar.
7. No custom back interception.
8. No new truncation or overlap at font scale 2.0.
9. One unmistakable primary action per screen. 1-3 hero moments per app.
10. Lists, settings, forms and money flows keep standard components and text labels.
11. No iOS chevrons and no glass replica on Android.

## Sources

- [StandardMotionTokens.kt](https://github.com/androidx/androidx/blob/androidx-main/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/tokens/StandardMotionTokens.kt)
- [ExpressiveMotionTokens.kt](https://github.com/androidx/androidx/blob/androidx-main/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/tokens/ExpressiveMotionTokens.kt)
- [MaterialShapes.kt](https://github.com/androidx/androidx/blob/androidx-main/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/MaterialShapes.kt)
- [TypeScaleTokens.kt](https://github.com/androidx/androidx/blob/androidx-main/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/tokens/TypeScaleTokens.kt)
- [Compose Material 3 release notes](https://developer.android.com/jetpack/androidx/releases/compose-material3)
- [M3: Spacing](https://m3.material.io/styles/spacing)
- [M3 blog: Expressive motion theming](https://m3.material.io/blog/m3-expressive-motion-theming)
- [M3 blog: What's new at I/O 2026](https://m3.material.io/blog/whats-new-at-io26)
- [Android: Make apps more accessible](https://developer.android.com/guide/topics/ui/accessibility/apps)
- [Android 16 behavior changes](https://developer.android.com/about/versions/16/behavior-changes-16)
- [Google Design: Expressive Material Design research](https://design.google/library/expressive-material-design-google-research)
