# Haptics and sound

Open this before you add a haptic or a UI sound, and again when you review a build. It maps each
interaction to the right haptic per stack and lists the checks that catch misuse.

## Governing rules

- Use a system pattern only for its documented meaning. If none fits, use a generic pattern or play none.
- Tie every haptic to a visible cause. Match its intensity and sharpness to the animation.
- Keep haptics rare, short and optional. The app must work with them off, so a haptic is never
  the only feedback. No library reports whether the user has haptics enabled.
- Stock toggles, sliders and pickers already play a system haptic. Do not add another.
- Android: "Given the choice of buzzy haptics or no haptics for touch feedback, choose no
  haptics." Use `HapticFeedbackConstants`; the platform picks the effect per device. Do not use
  `createOneShot`, `Vibrator.vibrate(long)` or `vibrate(long[], int)` for feedback.
- Scale strength to importance and frequency. Frequent events are very subtle or silent.
- Use the same effect for all similar interactions.
- iOS plays nothing in Low Power Mode, with System Haptics off, while the camera is active, or
  during dictation.

## Mapping

| Interaction | iOS | Android | React Native | Sound |
|---|---|---|---|---|
| Stock toggle, slider or picker | None. The system already plays one. | Stock: none. Custom switch: `TOGGLE_ON` / `TOGGLE_OFF` (API 34) | Do not add one | None |
| Committed async success (sent, saved, paid) | `.success`, only after the result resolves | `CONFIRM` (API 30) | `notificationAsync(Success)` on iOS; `performAndroidHapticsAsync(Confirm)` on Android | Optional completion sound |
| Failure or invalid input | `.error` | `REJECT` (API 30) | `Error` / `Reject` | Optional, and not on every validation error |
| Warning | `.warning` | No constant: use none | iOS only | None |
| Snap, drop or collision | `.impact(weight:)` matched to the object's visual mass | `DRAG_START` (API 34) for pickup. Landing has no constant; a `THUD` primitive is reserved for signature moments. | `impactAsync` (Light to Heavy) on iOS only | Optional |
| Discrete value change (picker, chart scrub, stepper) | `.selection` | `SEGMENT_TICK`; dense values use `SEGMENT_FREQUENT_TICK` or `CLOCK_TICK` | `selectionAsync` / `Segment_Tick` | Directional ticks, with variations |
| Gesture threshold (pull-to-refresh, swipe action) | Light impact, or `.increase` / `.decrease` for significant thresholds | `GESTURE_THRESHOLD_ACTIVATE` / `DEACTIVATE` (API 34) | Not in expo-haptics: needs react-native-haptic-feedback | None |
| Drag aligns to a guide | `.alignment` | `SEGMENT_TICK` | react-native-haptic-feedback | None |
| Activity start or stop (timer, session) | `.start` / `.stop` | `CONFIRM`, or none | iOS via a native module | Optional |
| Custom keypad | Selection or light impact | `KEYBOARD_TAP` / `VIRTUAL_KEY` | `Keyboard_Tap` | 8-12 random variations |
| Rare milestone (1-3 hero moments) | Core Haptics AHAP paired with an `AudioCustom` sound | `VibrationEffect.Builder` composition with automatic fallback | Needs AHAP via react-native-haptic-feedback | Paired sound in a shared sonic family |
| Scroll, navigation, tab switch, plain tap | None | None | None | None |
| Camera or microphone active | None. iOS suppresses haptics here anyway. | None | None | None |

## Stack notes

**SwiftUI (iOS 17+).** Bind the haptic to a state change, not a tap handler. The modifier plays
when the trigger value changes. Variants take a `condition: (old, new) -> Bool`, or a closure that
returns an optional feedback so it can return nil and stay silent.

```swift
// SwiftUI
.sensoryFeedback(.success, trigger: saved)
```

`SensoryFeedback` members: `success`, `warning`, `error`, `selection`, `increase`, `decrease`,
`start`, `stop`, `alignment`, `levelChange`, `pathComplete`, `impact`, `impact(weight:intensity:)`,
`impact(flexibility:intensity:)`.

**Compose.** Call `LocalHapticFeedback.current.performHapticFeedback` with a `HapticFeedbackType`:
`Confirm`, `Reject`, `ContextClick`, `GestureEnd`, `GestureThresholdActivate`, `SegmentTick`,
`SegmentFrequentTick`, `ToggleOn`, `ToggleOff`, `VirtualKey` (Compose UI 1.8), `KeyboardTap` (1.9),
`LongPress`, `TextHandleMove` (1.0). The reference lists no `GestureThresholdDeactivate`,
`GestureStart` or `DragStart`. In Views, use `performHapticFeedback` with `HapticFeedbackConstants`.

**Android custom effects.** Keep them to one or two signature moments. `VibrationEffect.Composition`
has no automatic fallback: one unsupported primitive fails the whole effect, so check
`areAllPrimitivesSupported` and disable the whole experience if it fails. From "Android 16 (26Q4)",
`VibrationEffect.Builder(composition).build()` adds framework fallback.

## React Native pitfalls

- expo-haptics (SDK 58): on Android, `impactAsync` and `notificationAsync` "are simulated with the
  Vibrator service", the buzzy path. Instead branch on `Platform.OS === 'android'` and call
  `performAndroidHapticsAsync(AndroidHaptics.X)`, which maps to `HapticFeedbackConstants`.
- expo-haptics lacks the `GESTURE_THRESHOLD_*` constants, Core Haptics and AHAP, Android
  composition primitives, and SwiftUI's `sensoryFeedback` semantics (`increase`, `decrease`,
  `start`, `stop`, `alignment`, `levelChange`, `pathComplete`). Instead use
  react-native-haptic-feedback (`gestureThresholdActivate`, `gestureThresholdDeactivate`,
  `playAHAP(file)` on iOS, `playHaptic(ahap, fallbackPattern)`) or a native module.
- react-native-haptic-feedback: `ignoreAndroidSystemSettings: true` ignores the user's setting and
  `enableVibrateFallback: true` produces buzzy vibration. Both are anti-patterns for UI feedback.
  Instead leave both off.
- Below API 30 (`CONFIRM`, `REJECT`) or API 34 (toggle, drag, threshold and segment constants),
  prescribe no haptic. Do not fall back to a `Vibrator` one-shot.

## Sound rules

- Use `AVAudioSession.Category.ambient` for UI sound. It mixes with other audio, and the Silent
  switch and screen lock silence it.
- Flag a `playback` or `playAndRecord` category used only for UI sound effects: it ignores the
  Silent switch and may interrupt the user's audio. `playback` is for sound "central to the
  successful use of your app". Instead use `ambient`.
- Pair every sound with a haptic and a visual. For a hero moment, author both in one AHAP: an
  `AudioCustom` event references the .wav so sound and haptic stay in sync.
- Reserve sound for completion, celebration and errors. Taps and navigation stay silent.
- Give the app a sound toggle that is separate from its haptics toggle.
- A repeated sound gets 8-12 variations (pitch, volume, timing) played at random, and related
  actions share a sonic family. This is practitioner opinion (Not Boring), not a platform rule.
- Android UI-sound APIs were not researched: follow the same behaviour and name no API from here.

## Static checks

Grep for `UIImpactFeedbackGenerator`, `UINotificationFeedbackGenerator`,
`UISelectionFeedbackGenerator`, `.sensoryFeedback(`, `CHHapticEngine`, `performHapticFeedback`,
`HapticFeedbackConstants.`, `Vibrator.vibrate`, `createOneShot`, `Haptics.impactAsync`,
`notificationAsync`, `selectionAsync`, `performAndroidHapticsAsync`,
`ReactNativeHapticFeedback.trigger`. Flag each of these:

| Flag | Instead |
|---|---|
| Haptic inside `onScroll`, `onScrollViewDidScroll`, `onGestureEvent` or `Animated.event` with no threshold or index-change guard | Fire only when a threshold is crossed or the index changes |
| `.success`, `Confirm` or `notificationSuccess` on a plain tap or `onPress` with no awaited result | Fire it in the async-resolution or commit path; a plain tap gets none |
| `Heavy` or `rigid` impact on small controls (chips, icons), or the same heavy impact on every button | Weight the impact to the object's visual mass |
| Haptic calls in more than about 30-40% of `onPress` handlers (heuristic, unverified) | Keep the haptics the mapping names; delete the rest |
| Buzzy Android one-shots: `Vibrator.vibrate(long)`, `createOneShot`, expo `impactAsync` with no Android branch, `ignoreAndroidSystemSettings: true` | A `HapticFeedbackConstants` value, or none |
| No in-app haptics or sound toggle in settings | Add both toggles |
| Explicit haptic on a stock iOS toggle, slider or picker (double haptic) | Remove it; the control plays its own |

## Verification

- Haptics cannot be felt on the iOS Simulator or the Android emulator. A physical device is needed.
- Route every haptic through one module (`haptics.ts` or `Haptics.swift`). In debug builds it logs
  `{interaction, type, timestamp, screen}` for each call.
- Assert the mapping from that log in a simulator UI test: which haptic fired for each
  interaction, that a scroll produced fewer than N events, and that each event had a state change
  within about 50 ms.
- On Android, `performHapticFeedback` returns a boolean, and `NO_HAPTICS` returns false.
- The log tests the mapping, not the feel. In the final round, a person checks on a device and
  notes each haptic against the debug log. Test sound with the phone not silenced.
- Neither platform ties haptics to Reduce Motion. Scaling celebrations back under it is a design
  choice, not a platform rule.

## Sources

- https://developer.apple.com/design/human-interface-guidelines/playing-haptics
- https://developer.apple.com/documentation/swiftui/sensoryfeedback
- https://developer.apple.com/videos/play/wwdc2021/10278/
- https://developer.apple.com/documentation/avfaudio/avaudiosession/category-swift.struct/ambient
- https://developer.android.com/develop/ui/views/haptics/haptics-principles
- https://developer.android.com/reference/android/view/HapticFeedbackConstants
- https://developer.android.com/reference/kotlin/androidx/compose/ui/hapticfeedback/HapticFeedbackType
- https://developer.android.com/develop/ui/views/haptics/custom-haptic-effects
- https://docs.expo.dev/versions/latest/sdk/haptics/
- https://github.com/mkuczera/react-native-haptic-feedback
- https://notbor.ing/words/the-sound-of-software
