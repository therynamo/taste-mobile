# iOS 26/27 design rules

Open this before you build or review any iOS screen. It holds Apple's Liquid Glass rules, the fixed
glass chrome recipe, and the numbers for radii, hit targets, contrast, type and safe areas.

## Two layers

Every screen has a content layer and a floating layer of controls and navigation above it. Liquid
Glass belongs to the floating layer. Brand and art direction belong to the content layer: "The
content layer is the best opportunity to express your brand identity."

## Liquid Glass rules

| Rule | Instead |
|---|---|
| No glass in the content layer (cards, lists, tables, app backgrounds). | Use standard materials there. Exception: sliders and toggles take glass only while activated. |
| No glass on glass. | Put fills, transparency and vibrancy on top of glass so the top element reads as part of the material. |
| Never mix Regular and Clear. | Pick one. Default to Regular; it works at any size over any content. Use Regular for text-heavy parts (alerts, sidebars, popovers). |
| Clear only when all three hold: it sits over media-rich content, a dimming layer will not hurt that content, and the content on top is bold and bright. | Otherwise use Regular. |
| Clear over bright content has no legibility of its own. | Add a dark dimming layer of 35% opacity. Skip it when the content is already dark or AVKit playback controls supply their own. Small glass elements may use localized dimming. |
| Tint only the primary action. "Refrain from adding color to the background of multiple controls." | Apply the tint to the control's background, not its glyph. Keep other bar symbols and text monochrome. Put more colour in the content layer. |
| No glass effects spread across custom controls. | "Limit these effects to the most important functional elements in your app." |
| No glass button inside an already tappable row (practitioner opinion, David Smith). | Move row actions such as share and delete into a detail sheet. |
| At rest, content and glass do not intersect. | Reposition or scale content to keep them apart. |
| Legibility never depends on a translucency level. | Users can shift glass from clear to tinted, so check the most opaque setting and the clearest. |

System glass adapts on its own to Reduce Transparency (frostier), Increase Contrast (mostly black
or white with a border) and Reduce Motion (less effect, no elastic behaviour). Hand-rolled glass
does none of this. See `stacks.md` when the stack cannot reach the native material.

## The fixed glass chrome recipe

Glass is chrome, never the app's identity. It was visible in 33 of 114 studied app records and no
record's primary direction was glass. The anatomy did not vary, so do not design it:

- A floating capsule tab bar of 3-5 items, often with one detached circular accessory button.
- Circular glass buttons in the header.
- Toolbar items in grouped capsules, grouped "by function and frequency".
- Optional: glass sheets, popovers and menus; a glass composer or keyboard row.

Seen with a distinct identity underneath in Moonlitt, Apple Invites, Beeper and Paku. Identity
comes from one governing asset and at most one display type treatment, both in the content layer.

Bar rules:

- No custom bar background or border. Instead, express hierarchy through layout and grouping.
- No symbol grouped with a text item in one container; they read as a single button. Instead, give
  each its own group.
- Keep the tinted primary action in its own group. Put secondary actions in a More menu.
- No hairline divider or solid fill under a bar. Instead, use one scroll edge effect per view, and
  only where floating UI sits over scrolling content.
- No screen-specific action (for example checkout) in the tab bar accessory. Instead, place it
  with its content. The accessory is for persistent features such as media playback.
- No persistent logo or solid brand fill on bars. Instead, move the colour into the scroll view.
- Extend full-screen background content under bars. Keep text and controls out of the extension.

## Concentric radii

| Shape | Radius |
|---|---|
| Concentric (nested) | inner radius = outer radius - padding |
| Capsule | height / 2 |

- On phones, use a capsule with extra margin near the screen edge.
- Fix any corner that looks pinched or flared.
- Apple publishes no numeric radius for sheets, list sections or controls. Do not hard-code one.
  Instead, use the system containers or derive the radius from the parent.
- APIs named by Apple's adoption guide: `ConcentricRectangle`, `rect(corners:isUniform:)`,
  `cornerConfiguration`, `UICornerConfiguration`.

## Hit targets

| Rule | Value |
|---|---|
| Hit region for every interactive element | 44x44 pt |
| Absolute floor (Apple allows it, do not aim for it) | 28x28 pt |
| Padding around bezeled controls | about 12 pt |
| Padding around borderless controls, from the visible edges | about 24 pt |

- A small glyph is fine. Enlarge its hit region, not the glyph.
- A custom gesture is never the only way to do something important. Instead, pair it with a
  visible control; a swipe-to-dismiss view also gets a button.

## Contrast

| Element | Minimum |
|---|---|
| Text | 4.5:1 |
| Text at 18 pt regular or larger, or 14 pt bold or larger | 3:1 |
| Icons, control boundaries, focus and selected states | 3:1 against adjacent colours |

- Apple's own table allows 3:1 for bold at any size. Use the stricter rule above.
- Check light and dark. Under glass, check against the worst-case content behind it.
- Do not use quaternary label colour on thin or ultraThin materials. Instead, use a higher label
  level.
- Every custom colour needs light, dark and increased-contrast variants, even in a single-mode
  app. No raw hex in components and no hard-coded system colour values. Instead, use semantic
  colour tokens.
- Never signal with colour alone. Instead, add a label, symbol or shape.

## Type floors and Dynamic Type

These floors come from the HIG Typography page and were not re-read in the verification pass
(unverified).

- Body text defaults to 17 pt. No text below 11 pt.
- No Ultralight, Thin or Light weights. Instead, use Regular, Medium, Semibold or Bold.
- Layouts survive Dynamic Type up to AX5 (body at 53 pt). Never truncate. Instead, let labels
  wrap, switch rows to stacked layouts, and scale meaningful icons with the text.
- A custom font meets the same minimum sizes and supports Dynamic Type and Bold Text.
- System text for UI and body is never a tell. Do not deal a custom body face for
  distinctiveness. Instead, put any custom face on display text only.

| Style | Size/leading (pt) | Style | Size/leading (pt) |
|---|---|---|---|
| Large Title | 34/41 | Callout | 16/21 |
| Title 1 | 28/34 | Subhead | 15/20 |
| Title 2 | 22/28 | Footnote | 13/18 |
| Title 3 | 20/25 | Caption 1 | 12/16 |
| Headline (Semibold) | 17/22 | Caption 2 | 11/13 |
| Body | 17/22 | | |

## Safe areas and layout

- Respect safe areas, margins and layout guides so the Dynamic Island and system UI never cover
  content. No magic top padding. Instead, read the safe-area insets.
- Lay out by size class, not device type or orientation. Keep functionality the same across them.
- Safe-area gaps, a grey top inset and double titles read as a template.

## `UIDesignRequiresCompatibility` is ignored on iOS 27

The system ignores this Info.plist key "when you build for iOS 27 or later". The key still exists;
it is ignored, not removed. Do not propose keeping the pre-glass look for native components.
Instead, adopt the native glass chrome and spend identity in the content layer.

iOS 27 also reportedly added a darkened glass edge, a uniform toolbar under scrolled content and a
clear-to-tinted transparency slider (unverified: secondary reporting only).

## Checkable rules

1. Glass or blur appears only on bars, sheets, menus and transient controls. None on content.
2. No glass element sits on another glass element. Regular and Clear never share a screen.
3. Clear glass sits only over media, with a 35% dark dim over bright content.
4. At most one tinted item per bar. Bar icons are monochrome. No custom bar background or border.
5. One scroll edge effect per view. No hairline under bars.
6. Nested radii are concentric: inner = outer - padding. Capsules use height / 2.
7. Every hit region is at least 44x44 pt; none is under 28x28 pt.
8. Text meets 4.5:1 (3:1 for large text). Icons and control boundaries meet 3:1.
9. Body is 17 pt or larger; no text under 11 pt; no Light, Thin or Ultralight (unverified).
10. No new truncation or overlap at AX5.
11. Each colour token has light, dark and increased-contrast values.
12. No persistent logo or solid brand fill on bars.
13. No system permission dialog on cold start.
14. The tab bar is a floating capsule of 3-5 items.

## Sources

- [HIG: Materials](https://developer.apple.com/design/human-interface-guidelines/materials)
- [HIG: Color](https://developer.apple.com/design/human-interface-guidelines/color)
- [HIG: Accessibility](https://developer.apple.com/design/human-interface-guidelines/accessibility)
- [HIG: Buttons](https://developer.apple.com/design/human-interface-guidelines/buttons)
- [HIG: Typography](https://developer.apple.com/design/human-interface-guidelines/typography)
- [HIG: Layout](https://developer.apple.com/design/human-interface-guidelines/layout)
- [WWDC25 219: Meet Liquid Glass](https://developer.apple.com/videos/play/wwdc2025/219/)
- [WWDC25 356: Get to know the new design system](https://developer.apple.com/videos/play/wwdc2025/356/)
- [Adopting Liquid Glass](https://developer.apple.com/documentation/technologyoverviews/adopting-liquid-glass)
- [UIDesignRequiresCompatibility](https://developer.apple.com/documentation/bundleresources/information-property-list/uidesignrequirescompatibility)
- [WCAG 2.2](https://www.w3.org/TR/WCAG22/)
- [WWDC26 251: Communicate your brand identity on iOS](https://developer.apple.com/videos/play/wwdc2026/251/)
