# Motion

Open this before you write any animation, transition, gesture release or press state. It gives the
tokens to type from, their spelling per stack, four rulings, and the tells to remove.

## Tokens

For mass-1 springs: damping ratio = 1 - bounce, and response = 2*pi / sqrt(stiffness). With a
mass: ratio = damping / (2 * sqrt(stiffness * mass)), response = 2*pi / sqrt(stiffness / mass).

| Token | Duration / response | Bounce (damping ratio) | Use |
|---|---|---|---|
| `spring.default` | 0.35-0.5 s | 0 (1.0) | Most state changes |
| `spring.snappy` | ~0.3 s | 0.1-0.15 (0.85-0.9) | Small components |
| `spring.release` | 0.3-0.4 s, plus the gesture velocity | 0.15-0.2 (0.8-0.85) | Sheet or card release after a drag |
| `spring.expressive` | 0.22-0.44 s | 0.3 or less, never above 0.4 | Hero moments only |
| `spring.effects` | ~0.1-0.22 s | 0, always (1.0) | Opacity and colour |
| `tween.press` | 100-160 ms, `cubic-bezier(0.23, 1, 0.32, 1)` | none | Press feedback |
| `tween.small` | 150-250 ms | none | Dropdowns, chips, toggles |
| `sheet` | 500 ms, `cubic-bezier(0.32, 0.72, 0, 1)` | none | Full-width edge sheets. A small floating drawer gets ~200 ms |
| Stagger | 30-80 ms steps, non-uniform, total 300 ms or less, first ~5 items only | none | Groups in product UI |
| Reduced motion | Opacity crossfade, 150-200 ms | 0 | Replaces travel under Reduce Motion |

- The set is a synthesis of shipped values, not one source. The default has no bounce.
- Keep UI tweens under 300 ms. Sheets, modals, drawers and toasts are the only exceptions.
- Use bounce only on a release after a drag. A button-triggered open or close gets bounce 0.
- Opacity, colour and blur never overshoot.
- While a finger is down, track it 1:1 with no spring and no easing. On lift, seed the release
  spring with the gesture velocity. Rubber-band at edges.
- The more often an interaction happens, the less it animates.

## Per stack

**SwiftUI**
- `.smooth` = `spring(duration: 0.5, bounce: 0)`: use for `spring.default`.
- `.snappy` is the same with bounce 0.15. `.bouncy` has bounce 0.3: hero moments only.
- Finger tracking: `.interactiveSpring` = `spring(duration: 0.15, bounce: 0.15, blendDuration: 0.25)`.
- Type the other tokens as `spring(duration:bounce:)` with the table values.
- Legacy `.spring(response:dampingFraction:)` defaults to 0.5 / 0.825 (bounce 0.175). Set both.
- `withAnimation` springs by default, and SwiftUI carries gesture velocity into the final spring.
- Continuity: `.navigationTransition(.zoom(sourceID:in:))` with `.matchedTransitionSource`.

**Compose (Material 3)**
- Read springs from `MaterialTheme.motionScheme` (`LocalMotionScheme` is deprecated in Material3
  1.5.0). Each scheme has default / fast / slow specs for Spatial and Effects, built with
  `spring(dampingRatio, stiffness)`:

| Damping ratio / stiffness | Fast | Default | Slow |
|---|---|---|---|
| Standard spatial | 0.9 / 1400 | 0.9 / 700 | 0.9 / 300 |
| Expressive spatial | 0.6 / 800 | 0.8 / 380 | 0.8 / 200 |
| Effects (both schemes) | 1.0 / 3800 | 1.0 / 1600 | 1.0 / 800 |

- Fast is for small components, default for partial-screen motion (sheets), slow for full screen.
- Pick one scheme per product. Utilitarian, money and pro tools get Standard. Use Expressive
  spatial springs only on hero moments. Colour and opacity always use the effects springs.

**Reanimated 4** (duration form)

```ts
withSpring(x, { duration: 400, dampingRatio: 1 });             // spring.default
withSpring(x, { duration: 400, dampingRatio: 0.8, velocity }); // snap back after a drag
withSpring(x, { duration: 300, dampingRatio: 0.8, velocity }); // sheet or drawer release
// must not pass a hard edge: add overshootClamping: true
```

- Easing: `Easing.bezier(0.23, 1, 0.32, 1)` for UI, `(0.77, 0, 0.175, 1)` for on-screen moves,
  `(0.32, 0.72, 0, 1)` for sheets. Press 100-150 ms; toggle, chip or small change 150-200 ms.
- For M3 values pass `dampingRatio` and `stiffness` directly (they assume mass 1).
- Navigation is native first: native stack transitions at the platform default, and
  `presentation: 'formSheet'` for sheets.

## React Native traps

- **Reanimated 3 default spring.** Stiffness 100, damping 10, mass 1 is damping ratio 0.5 (bounce
  0.5), above the 0.4 ceiling. Flag a bare `withSpring(x)` on Reanimated 3 and any use of
  `Reanimated3DefaultSpringConfig`. Instead pass an explicit config from the block above.
- **Perceptual duration.** Reanimated's `duration` is perceptual: "actual duration is 1.5 times
  this value". Budget for the settle time. Duration props override physics props; do not mix them.

## Four rulings

1. **Platform tab bars do not slide.** Switch tabs with no animation (RN: `animation: 'none'`).
   A directional slide is allowed only in a low-tab-count, brand-signature app dealt Fluid
   Continuity. It must be fast and interruptible, and it becomes a crossfade under Reduce Motion.
2. **Dismissal triggers on distance OR velocity.** Distance: about 25% for full-height sheets,
   40-50% for small cards. Velocity: 0.1-0.4 px/ms, lower for toasts, higher for sheets (Vaul
   ships 25% or above 0.4 px/ms; Sonner 45 px or above 0.11 px/ms). Use a 10 pt hysteresis before
   locking an axis. Elements dismiss the way they entered. Native sheets keep system behaviour.
3. **Exits use a short ease-out or a critically damped spring.** Do not use ease-in on UI. Exits
   run all at once and leave along the entry path. Material's accelerate curve
   `(0.3, 0, 0.8, 0.15)` is only for full off-screen exits the user will not watch to the end.
   Native Android transitions keep platform defaults. "Exits 20-30% shorter" is unverified.
4. **Press feedback is mandatory, instant on press-in, and visible.** Scale to 0.96-0.98 over
   100-150 ms, as a tween with no bounce, only on bounded controls: buttons, chips, primary-action
   cards, icon buttons. Rows, cells and links get a background highlight or opacity change
   instead. Never scale every touchable.

## Hero moments

- Pick 1 to 3 per app, typically the core action, a completion, and first run.
- Each pairs a spatial spring (`spring.expressive`), a matched haptic and an optional sound
  (mapping in `haptics-sound.md`).
- Build each on motion the user causes: a shared-element zoom from a card, a sheet that unfolds
  from its trigger, a morph at completion. Do not use an ambient effect. Everything else stays calm.

## Reduce Motion

Fewer and gentler, not zero. Declare the reduced variant next to every animation.

| Normal | Under Reduce Motion |
|---|---|
| Translate, scale, zoom, parallax, depth, blur in or out, overshoot | Opacity crossfade of 150-200 ms, or an instant change |
| Spring with bounce | Critically damped, bounce 0 |
| Gesture tracking | Stays 1:1. The release is a short settle with no bounce and no fling |
| Stagger | One group fade: drop the delays and movement, keep the opacity |
| Screen transition | Platform fade (RN: `animation: 'fade'`) |

- Never remove a change that conveys state. Instead keep its opacity or colour change.
- Reanimated: `reduceMotion` defaults to `ReduceMotion.System`. Flag `ReduceMotion.Never`, and
  `entering` / `exiting` animations with no `.reduceMotion()` or `useReducedMotion` branch.
- Toggle it on the iOS Simulator, then relaunch the app (`simctl ui` has no option for it):

```sh
xcrun simctl spawn <udid> defaults write com.apple.Accessibility ReduceMotionEnabled -bool true
```

## Motion tells

Each reads as a default. All are binary and most are greppable.

| Tell | Instead |
|---|---|
| Mount fade or translate on more than one container per screen | One entrance per container; never animate a parent and stagger its children |
| Uniform `index * N` stagger, or a stagger on a primary-surface list | Non-uniform 30-80 ms steps on the first ~5 items; none on lists opened many times a day |
| Stagger total over 300 ms in product UI | Cap the group at 300 ms; run parts together |
| Bounce on opacity, colour, or a button-triggered open or close | `spring.effects`; bounce only on a release after a drag |
| Bounce above 0.3 (damping ratio under 0.7) outside a declared hero moment, including bare Reanimated 3 `withSpring` | `spring.default`, or an explicit config |
| `scale(0)` or `scale: 0` entrance | Start from scale 0.9-0.97 plus opacity 0 |
| `Easing.in` or `ease-in` on UI | Ease-out `(0.23, 1, 0.32, 1)` or a critically damped spring |
| Keyframe or timing animation on a draggable | 1:1 tracking, then a velocity-seeded spring |
| Distance-only dismissal | Distance OR velocity (ruling 2) |
| Hard stop at drag bounds | Rubber-band resistance |
| Scale squish on full-width rows | Background highlight or opacity change |
| Animated tab switches | No animation (ruling 1) |
| Hand-rolled screen transitions or sheets | The native stack and the native sheet (`formSheet` in RN) |
| Height, width or margin animation | Animate transform and opacity |
| Spinner or shimmer for a wait under 300 ms, or a blocking spinner | No indicator under 300 ms; optimistic UI or a skeleton for longer waits |
| Count-up or chart redraw on mount | Animate when the value changes, not on load |
| Idle loops and wiggles on persistent chrome | Static chrome; motion only when the user causes it |
| Parallax or scroll-linked transforms with no informational purpose | Remove them |
| Haptic on mount, scroll or every tap | A haptic only for a visible cause (see `haptics-sound.md`) |
| No reduced-motion variant | Declare one beside each animation |

## Sources

- https://developer.apple.com/videos/play/wwdc2023/10158/
- https://developer.apple.com/videos/play/wwdc2018/803/
- https://developer.apple.com/design/human-interface-guidelines/accessibility
- https://github.com/androidx/androidx/blob/androidx-main/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/tokens/ExpressiveMotionTokens.kt
- https://raw.githubusercontent.com/material-components/material-components-android/master/docs/theming/Motion.md
- https://docs.swmansion.com/react-native-reanimated/docs/animations/withSpring/
- https://github.com/software-mansion/react-native-reanimated/blob/main/packages/react-native-reanimated/src/animation/spring/springConfigs.ts
- https://github.com/emilkowalski/skills/blob/main/skills/animate-expo/SKILL.md
- https://github.com/emilkowalski/skills/blob/main/skills/review-animations/STANDARDS.md
- https://github.com/emilkowalski/vaul/blob/main/src/constants.ts
