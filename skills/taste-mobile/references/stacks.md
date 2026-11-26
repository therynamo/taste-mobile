# Stack adapters: SwiftUI, Jetpack Compose, React Native/Expo

Open this once you know the stack, before you build navigation, sheets, fonts or any glass
surface. The design rules live in `ios.md` and `android.md`; this file says how each stack
reaches them.

## Platform posture

Declare one posture in `MOBILE-DESIGN.md` before building.

| Posture | What it means | Seen in |
|---|---|---|
| Native per platform | Each platform gets its own native components | - |
| iOS-first | Designed for iOS first | - |
| Unified custom system | One custom component system on both platforms | Discord (React Native) |
| Web-wrapped | A web app inside a native shell | Watch Duty |

- A unified custom system must still honour each platform's accessibility behaviour.
- Do not mix platform idioms. No hamburger as primary navigation or FAB on iOS, and no iOS
  chevrons on Android. Instead, use each platform's own navigation pattern.

## Glass by reach

Pick one platform-material value. Apple's glass rules in `ios.md` apply to every value.

| Value | Use when | Seen in |
|---|---|---|
| Native adopter | The stack reaches the system material | Moonlitt, Apple Invites, Beeper, Paku |
| Content-carrying glass | Native glass over rich content | Gemini (glass over a live gradient) |
| Bespoke glass | Exists in shipped apps; this skill does not deal it. The rules below govern. | Linear (moving specular highlight, no refraction) |
| Honest opaque | The stack cannot reach the material, or the product is a unified custom system | Spotify, Discord, ESPN, Threads, Bluesky show no glass |
| Android M3 or M3 Expressive | Any Android build | - |

Rules:

1. Use native bars, sheets and menus wherever the stack can reach them. They bring the material.
2. When the stack cannot reach the native material, use an honest opaque or blurred surface.
3. Never build a fake glass replica. Hand-rolled glass will not refract, flip between light and
   dark, or respond to Reduce Transparency, Increase Contrast and Reduce Motion. Instead, apply
   rule 2.
4. Never put a Liquid Glass replica on Android. Reactions to Telegram's port "have not exactly
   been positive". Instead, use M3 or M3 Expressive.
5. An opaque build still keeps the structure: two layers, concentric radii, monochrome bar icons,
   one tinted primary action, controls grouped by function, no bar background or border.
6. A flat cross-platform UI that ignores Liquid Glass on iOS 26 reads as a template. Fix it with
   rule 1, not with an imitation.

## SwiftUI

- Chrome: use the system navigation bar, tab bar, toolbar, sheets, popovers and menus. They carry
  Liquid Glass and its accessibility behaviour for free. Do not set custom bar backgrounds or
  borders. Instead, group toolbar items and tint one primary action.
- Radii: Apple's adoption guide names `ConcentricRectangle` and `rect(corners:isUniform:)`
  (UIKit: `cornerConfiguration`, `UICornerConfiguration`). Use them for nested shapes. Do not
  hard-code a nested radius.
- Type: use system text styles so Dynamic Type works. A custom face must support Dynamic Type
  and Bold Text.
- Colour: use semantic colours (`systemBackground`; `label`, `secondaryLabel`, `tertiaryLabel`,
  `quaternaryLabel`). No hard-coded system colour values.
- Motion anchors: `.smooth` (0.5 s, bounce 0) for most state changes; `.snappy` (bounce 0.15) for
  small components.
- Do not rely on `UIDesignRequiresCompatibility`. It is ignored when building for iOS 27 or
  later. Instead, adopt the native chrome.
- Trap: laying SwiftUI out like a web page ("swiftui like html") reads as a template. Instead,
  start from the platform containers: navigation stack, list, sheet.
- Trap: default blue `#007AFF` as the only brand colour reads as a default. Instead, deal a
  palette.

Reduce Motion check (iOS simulator):

```sh
xcrun simctl spawn <udid> defaults write com.apple.Accessibility ReduceMotionEnabled -bool true
```

## Jetpack Compose

- Chrome: use Compose Material3 components. Version 1.5.0 is stable with 14 expressive
  components, including standalone Sheet and Scrim, `FloatingToolbar` and `AppBarWithSearch`.
- Theme: `MaterialExpressiveTheme` at the top level defaults to the Expressive motion scheme.
  Read springs from `MaterialTheme.motionScheme`, not `LocalMotionScheme` (deprecated).
- Glass: none. Blur is a depth accent for sheets, menus and overlays (text-sourced).
- Targets: `Button`, `IconButton` and `ListItem` enforce 48dp. A custom interactive element must
  set its own size.
- Spacing tokens (`space100` = 8dp) ship for Compose only.
- `MaterialShapes` is still experimental in 1.5.0. Expect the API to change.
- Do not start new Material UI in Views. Material Views 1.14.0 is the last stable Views release.
  Instead, use Compose.
- Fonts: Google Sans Flex is published under the OFL. Check each family's licence (`assets.md`).
- Trap: Material purple `#6750A4` as the only brand colour reads as a default. Instead, deal a
  palette.
- Trap: opting out of edge-to-edge or intercepting back. Both break on API 36. Instead, pad with
  insets and use the navigation library's back handling.
- Test: Compose 1.8 `enableAccessibilityChecks()` checks contrast, target size and labels.

## React Native / Expo

### Native chrome

- Use a native-backed navigation library for stack headers, tab bars and transitions. "Never
  hand-roll this."
- Sheets: `presentation: 'formSheet'` gives "a real UISheetPresentationController, free and
  correct". Do not build a web-style modal or a sheet with only an X. Instead, use the native
  sheet and keep both drag-to-dismiss and a button.
- Glass: `@callstack/liquid-glass` reaches the native effect on iOS 26+ only. It needs RN 0.80+
  and is "not supported in Expo Go". Without it, use an honest opaque or blurred surface.
- Platform tab bars do not slide. Do not animate a tab switch as a horizontal push.
- Android: draw behind transparent system bars, pad with safe-area insets, and let scroll
  content pass under the gesture bar.
- Type and colour: keep `allowFontScaling` on. Use `PlatformColor` or `DynamicColorIOS` for
  semantic colours instead of fixed hex.
- Icons: one open family such as `lucide-react-native`. SF Symbols only through `expo-symbols` on
  iOS, with the open family as the Android fallback.

### Fonts: the Expo variable-font cliff

| Fact | Consequence |
|---|---|
| Variable fonts work on iOS and Android only from SDK 58. | On SDK below 58, ship static files. |
| On iOS only named instances work. "A weight that no named instance covers is out of reach." | A dealt display face must ship a named instance for every weight it uses. |
| On Android the `wght` axis needs Android 10+; `ital` needs Android 15+. | Do not depend on `ital` for required styling. |
| `useFonts` loads at runtime and reads only the weight axis. | Use `fontVariationSettings` (RN 0.88+) for other axes. |
| The `expo-font` config plugin embeds fonts at build time; it needs a dev build, not Expo Go. | Plan for a dev build. |
| Platform font names differ: Android `Inter_900Black`, iOS `Inter-Black`. | Map names per platform. |
| SDK 58+ takes multi-face families as `FontFamilyDefinition` arrays. | "Declare weight and style on every face". |

Do not load Inter to stand in for the system font. Instead, use the system font for UI and body
text and spend the custom face on display text.

### Traps

| Trap | Instead |
|---|---|
| Hand-rolled header with a "< Back" label, manual back button, nested tab bars | The navigator's native header and one tab bar |
| Chrome re-implemented on every screen | One navigator layout owns bars |
| `paddingTop: 50`; grey top inset; double titles | Safe-area insets; one title, owned by the header |
| `shadowColor` without `elevation` (dead shadow on Android) | Set both, per platform |
| `Alert.alert` for success or validation | Inline feedback in the screen |
| `TouchableOpacity` flash as the only press state | A press state you design |
| Animation on the JS thread | Animation that runs off the JS thread |
| `FadeInDown.delay(i * 100)` on every list | Entrance motion on a hero moment only |
| Bare `withSpring(x)`. The Reanimated 3 default (stiffness 100, damping 10, mass 1) has a damping ratio of 0.5 | Pass `dampingRatio` and `stiffness` explicitly (token values assume mass 1). Reanimated 4's default is 1.0 |
| Treating Reanimated spring duration as real time: "actual duration is 1.5 times this value" | Budget for the longer settle |
| expo-haptics `impactAsync` / `notificationAsync` on Android: "simulated with the Vibrator service" | `performAndroidHapticsAsync` on Android |
| react-native-haptic-feedback with `ignoreAndroidSystemSettings: true` or `enableVibrateFallback: true` | Leave both off |
| `Intl.NumberFormat.formatToParts` in money formatting; it crashes on Hermes | Format without `formatToParts`; test on Hermes |
| Unstyled defaults (white, grey borders, system sizes); reads as a default | Apply the dealt tokens to every surface |
| True polygon shape morphs with plain views | Corner-radius morphs; polygon morphs need Skia or SVG path interpolation |

## Sources

- [Adopting Liquid Glass](https://developer.apple.com/documentation/technologyoverviews/adopting-liquid-glass)
- [UIDesignRequiresCompatibility](https://developer.apple.com/documentation/bundleresources/information-property-list/uidesignrequirescompatibility)
- [WWDC25 219: Meet Liquid Glass](https://developer.apple.com/videos/play/wwdc2025/219/)
- [Linear: Liquid Glass](https://linear.app/blog/linear-liquid-glass)
- [9to5Google: Telegram for Android redesign](https://9to5google.com/2026/02/07/telegram-for-android-redesign-goes-all-in-on-liquid-glass-rolling-out-now/)
- [Callstack: Liquid Glass in React Native](https://www.callstack.com/blog/how-to-use-liquid-glass-in-react-native)
- [Expo: Fonts](https://docs.expo.dev/develop/user-interface/fonts/)
- [animate-expo SKILL.md](https://github.com/emilkowalski/skills/blob/main/skills/animate-expo/SKILL.md)
- [Compose Material 3 release notes](https://developer.android.com/jetpack/androidx/releases/compose-material3)
- [Compose accessibility testing](https://developer.android.com/develop/ui/compose/accessibility/testing)
- [Expo: Haptics](https://docs.expo.dev/versions/latest/sdk/haptics/)
- [react-native-haptic-feedback](https://github.com/mkuczera/react-native-haptic-feedback)
