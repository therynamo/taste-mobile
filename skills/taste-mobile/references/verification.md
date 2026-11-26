# Verification

Open this before you capture and critique. It covers what to capture, how the scripts reach each
screen, the eight critique passes, and what no script can check.

## What a pass means

| Layer | Checked by | Catches | Cannot catch |
|---|---|---|---|
| Lint | `scripts/lint.mjs` | Greppable tells, motion and haptic misuse, text scaling switched off | Anything visual |
| Pixels | `scripts/capture.mjs` | Blank screens, dark that equals light, text that does not scale | Whether it looks good |
| Tree | `capture.mjs` with idb | Small targets, unlabelled buttons, a system dialog over the screen | Hit regions larger than the frame |
| Eyes | You, on every screenshot | Hierarchy, sameness, defaults, clipped text | Motion, haptics, sound |
| Device | A person holding a phone | Motion, haptics, sound, reach, real performance | Nothing: this is the real check |

A `GATE: PASS` covers the first four rows. Report the fifth as unchecked unless someone did it.

## Reach every screen with a launch argument

Capture relaunches the app once per screen. Make each screen open directly.

```swift
// SwiftUI: read "-screen detail" at launch
let args = ProcessInfo.processInfo.arguments
let screen = args.firstIndex(of: "-screen").flatMap { args.indices.contains($0 + 1) ? args[$0 + 1] : nil } ?? "home"
```

```ts
// React Native / Expo on iOS: the same arguments, with no native code.
// iOS files "-key value" pairs in NSUserDefaults, and Settings reads them at startup.
import { Settings } from 'react-native';
const arg = (key: string) => { const v = Settings.get(key); return v == null || v === '' ? undefined : String(v); };
const screen = arg('screen') ?? 'home';   // build the navigator's initial state from this
```

- **Use launch arguments on iOS.** `xcrun simctl launch <udid> <bundle-id> -screen detail`. In
  React Native this was verified on a Release build with the bundle embedded (Expo SDK 58, iOS 26.5
  simulator): see `examples/reading-assistant/src/launch.ts`. Android was not tried.
- **Rounds.** One round is one capture. `capture.mjs` and `gate.mjs` print the same number, and
  the last round's critique is kept as `critique-round-<n>.md`.
- **Small targets (C10)** skips the sheet grabber and bar buttons of 36 pt or more in the top
  120 pt: system chrome reports a frame smaller than its hit region. A custom control placed
  there is skipped too, so check it by eye.
- **A custom-scheme deep link shows an "Open in app?" dialog** the first time it is used on a
  simulator. It stays on screen until someone taps Open, and it covers every later screenshot.
  With idb installed, capture taps Open for you. Without idb, approve it once by hand first.
- Seed each screen with plausible data from the launch argument too (`-state empty`,
  `-state error`), so empty, loading and error states can be captured.
- Freeze anything that moves: a fixed clock, fixed sample data, no network.

`screens.json` lists them:

```json
{
  "bundleId": "com.example.app",
  "settleMs": 1500,
  "screens": [
    { "name": "home", "args": ["-screen", "home"] },
    { "name": "home-empty", "args": ["-screen", "home", "-state", "empty"] },
    { "name": "detail", "args": ["-screen", "detail"] }
  ]
}
```

## Capture

```sh
node <skill>/scripts/capture.mjs devices                 # booted simulators and their udids
node <skill>/scripts/capture.mjs run --udid <udid> --dir <project>
node <skill>/scripts/capture.mjs motion on --udid <udid> # Reduce Motion, then relaunch and look
```

It sets a clean status bar (9:41, full battery), then for each pass sets the appearance and text
size, opens each screen, waits `settleMs` and takes a screenshot. It restores light appearance and
the default text size when it ends. It never boots, erases or shuts down a simulator.

| Pass | Appearance | Text size |
|---|---|---|
| `light` | light | default (`large`) |
| `dark` | dark | default |
| `large` | light | `accessibility-extra-extra-extra-large` |

Output, all under `<project>/.taste-mobile/`:

- `shots/<pass>/<screen>.png` and `shots/contact.html`, a side-by-side contact sheet.
- `shots/tree/<screen>.json`, the accessibility tree, when idb is installed.
- `shots/index.json`, the record the gate reads.
- `critique.md`, a fresh template each run.

### Device matrix

| Loop | Devices |
|---|---|
| Fast, every round | One small phone, one current phone, in light and dark, plus one largest-text pass |
| Before reporting | iPhone SE (375x667 pt), iPhone 17 Pro (402x874), iPhone 17 Pro Max (440x956), and one Android phone |
| If tablets are in scope | iPad mini (744x1133) |

Run capture once per device with a different `--udid`. One device is the minimum for the gate.

### Checks capture runs

| Code | Level | Meaning |
|---|---|---|
| C01 | WARN | Dark looks the same as light. Not implemented, or the app is single-mode: declare it under Modes |
| C02 | WARN | The largest text size looks the same as the default. Text is not following the system size |
| C03 | FAIL | The screenshot is one flat colour. Nothing rendered, or it was taken too early |
| C04 | WARN | The dark pass is mostly light |
| C10 | WARN | Controls with an accessibility frame under 44x44 pt. Confirm the hit region |
| C11 | WARN | Buttons with no accessibility label |
| C12 | FAIL | A system "Open in app?" dialog is covering the screen |

The frame in the tree is the accessibility frame. A control can have a larger hit region than its
frame, so C10 is a prompt to check, not a verdict.

## The eight critique passes

Answer each in `critique.md`, per screen where it applies. Name the screen and say what to change.

| Pass | Question | A finding looks like |
|---|---|---|
| One second | After one second, what is this screen for and what is its main action? | "Home: three things compete; the balance is not the largest thing" |
| Squint | Blurred, does one thing dominate, and is it the right thing? | "Detail: the chart and the button have equal weight" |
| Cover the logo | With the name hidden, could this be any app? Where is the governing asset? | "Settings reads as a template: no trace of the asset" |
| Thumb reach | Is the primary action in reach, with targets of 44 pt (48 dp) or more? | "Add is top-right on a 6.9 inch phone" |
| Trunk test | Dropped here cold: where am I, how did I get here, where next? | "Detail has no title and no way back but a swipe" |
| Dark | Is dark designed? Do surfaces stay distinct and colour roles keep their meaning? | "Dark: the card and the ground are the same value" |
| Largest text | At the largest size, is anything clipped, overlapped or truncated to nonsense? | "Row amounts collide with labels; stack them" |
| Sameness | Same button shape, chrome and radius on every screen? Same as your last app? | "The tab bar loses an item on Detail" |

Then write the top three fixes. Fix those, capture again, and critique the new screenshots. Stop
after three rounds and report what remains.

## What stills cannot show

- **Motion.** Read the code against `motion.md`, run with Reduce Motion on, and say that a person
  has not watched it unless one has.
- **Haptics and sound.** Simulators do not play haptics. Route every haptic through one module
  that logs `{interaction, type, timestamp, screen}` in debug builds, read the log, and report
  that they were not felt on a device.
- **Performance.** A simulator on a fast Mac hides dropped frames.

## Android

`capture.mjs run --android [--serial <id>]` runs the same passes through adb: night mode with
`cmd uimode night yes|no`, text size with `settings put system font_scale`, screens with
`am start -a android.intent.action.VIEW -d <url>`, screenshots with `exec-out screencap -p`.

**This driver was written from documentation and was not run by the authors.** The gate holds at
`GATE: OPEN` for an Android-only capture. Look at every screenshot and say so in the report.

## Other tools

Capture needs only `xcrun simctl`. idb adds the accessibility tree and taps. Tools that drive taps
and read trees and were found in research but not run here: mobile-mcp, Maestro, agent-device.
Use one if the project already has it; do not add one for this skill.

## Sources

- https://developer.apple.com/documentation/xcode/running-your-app-in-simulator-or-on-a-device
- https://developer.apple.com/design/human-interface-guidelines/accessibility
- https://fbidb.io/docs/commands
- https://developer.android.com/tools/adb
