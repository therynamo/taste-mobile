---
name: taste-mobile
description: Art direction and design review for mobile apps in SwiftUI, Jetpack Compose and React Native/Expo. Deals one direction from a studied corpus of shipped apps, makes you commit to it in writing, then lints the code, captures the simulator and critiques the screenshots before you report. Use it when building, redesigning or reviewing mobile app screens.
---

# taste-mobile

A mobile app built with no direction comes out the same every time: a centred balance over round
buttons, a tinted chat bubble over a circular menu, cards on every row. This skill replaces that
default with a dealt direction, a written commitment, and a check you cannot talk your way past.

`<skill>` below is the directory this file is in. The scripts need Node 18 or later and nothing else.

## House rules

1. **Deal before you design.** Never pick a direction from memory. Run the dealer and take a hand.
2. **Write the commitments before any UI code.** `MOBILE-DESIGN.md` holds them. The gate reads it.
3. **Identity comes from one governing asset**, used on at least three surfaces, and at most one
   display treatment. Body text is the platform face. Do not deal yourself a body typeface.
4. **Modules outrank directions.** Money, crypto, chat, sports, fitness and feed rules are fixed
   per kind. A direction changes how they look, never what they do.
5. **Each platform keeps its own material.** System glass on iOS chrome only, Material 3 surfaces on
   Android. Never rebuild one platform's material on the other, and never replicate system glass
   with a blur view.
6. **Calm by default.** One to three hero moments per app, each a spring with a matched haptic.
   Everything else uses the default spring with no bounce.
7. **Real apps are evidence, not targets.** The dealer lists where a direction was seen. Do not
   copy an app, its name, its assets or its screens.
8. **Say "reads as a default" or "reads as a template".** Never guess how an app was made.
9. **Nothing invented.** No fake names, fake numbers, fake testimonials or fake press logos. Use
   plausible domain data and design the empty state.
10. **Look before you report.** A screen you have not seen running is not verified. Say so.

## The run

### 1. Read the brief

Decide four things. If the brief does not say, choose and state your choice in the report.

| Decide | Options |
|---|---|
| Kind | `node <skill>/scripts/deal.mjs kinds` lists the fourteen. Pick by what the app is for |
| Audience | `general`, `pro` (dense, expert), `gentle` (calm, care), `playful` |
| Platform | `ios`, `android`, `both` |
| Stack | `swiftui`, `compose`, `expo` |

### 2. Deal

```sh
node <skill>/scripts/deal.mjs deal --kind <kind> --audience <audience> \
  --platform <platform> --stack <stack> --dir <project>
```

It prints three complete hands and writes `<project>/.taste-mobile/deal.json` and
`<project>/MOBILE-DESIGN.md`. Take hand 1 unless it clashes with the brief. To take another:
`deal.mjs take 2 --dir <project>`. Do not re-deal until you like the result: that is choosing from
memory with extra steps.

- The brief names a direction: add `--direction <id>` (`deal.mjs directions` lists them).
- The brief supplies brand assets: add `--brand "<what is owned>"`. Brand colour, type and logo
  replace the dealt governing asset and display treatment. The axes and modules still apply.
- The "Never build these" list is the anti-references for this kind. Do not build them.

### 3. Fill in MOBILE-DESIGN.md

Replace every TODO. The three that matter most:

- **Governing metaphor.** One sentence in this exact form: "In this app, [domain object] becomes
  [real-world analogy]." It decides shape, motion and copy. "In this app, a budget becomes a fuel
  gauge" gives you a dial, a needle and the word "left".
- **Restraint rule.** One sentence that starts with Never or Only. The dealt corpus warning says
  how this direction goes wrong; your rule says how this app will not.
- **Not doing.** Three things this design refuses.

Then the colour roles (name roles, not hues), the hero moments with a spring, haptic and sound
each, the modes you support, and one row per screen with the launch argument that opens it.

### 4. Open the references you need

Read a file in full when its row applies. Do not read the others.

| When | File |
|---|---|
| Any iOS screen | `references/ios.md` |
| Any Android screen | `references/android.md` |
| Once the stack is known, before navigation, sheets, fonts or glass | `references/stacks.md` |
| Before any animation, transition, gesture or press state | `references/motion.md` |
| Before any haptic or UI sound | `references/haptics-sound.md` |
| Before adding a photo, illustration, icon set or font | `references/assets.md` |
| For each module the deal attached | `references/modules/<module>.md` |
| To see every direction's full signature | `references/directions.md` |
| Before the critique, and before settling a palette or a home layout | `references/tells.md` |
| Before capture and critique | `references/verification.md` |

### 5. Build in this order

1. **Tokens.** Colour roles for each supported mode, the type scale from platform text styles, one
   radius scale, one spacing scale, the motion tokens. One file. Nothing hard-coded after this.
2. **Shell.** Navigation from platform containers, the tab bar, safe areas, the haptics module
   (one module, every haptic routed through it, a settings toggle).
3. **One hero screen, complete.** Real content, empty, loading and error states, dark, largest
   text. Capture it and look before building anything else.
4. **The remaining screens**, reusing the shell and the tokens. Nothing new per screen.
5. **Launch arguments.** Every screen opens directly from a launch argument such as
   `-screen detail`, so capture can reach it.

### 6. Check: lint, capture, critique, fix

```sh
node <skill>/scripts/lint.mjs --dir <project>
node <skill>/scripts/capture.mjs init --dir <project>      # once: then edit screens.json
node <skill>/scripts/capture.mjs run --udid <udid> --dir <project>
```

- **Lint.** FAIL is a functional or platform rule: fix it. WARN is a pattern to remove or justify.
  Waive only with a reason: `// taste-mobile-ignore T03: brand-owned purple, token brand.primary`.
- **Capture** drives a booted simulator through every screen in light, dark and the largest text
  size. It never boots or erases one: boot your own and pass its udid.
- **Critique.** Open every screenshot. Answer the eight passes in `.taste-mobile/critique.md`:
  one second, squint, cover the logo, thumb reach, trunk test, dark, largest text, sameness.
- **Fix the top three.** Not everything. Then capture again and critique the new screenshots.
- **Three rounds at most.** After the third, stop and report what remains.

### 7. Gate and report

```sh
node <skill>/scripts/gate.mjs --dir <project>
```

| Verdict | Meaning | Do |
|---|---|---|
| `GATE: PASS` | Everything a script and stills can check was checked | Report, with the warnings |
| `GATE: FAIL` | Something failed | Fix and run again, three rounds at most |
| `GATE: OPEN` | Nothing failed, but something was not checked | Report exactly what. Never call it verified |

The report, in this order:

1. The direction, the governing metaphor and the restraint rule, one line each.
2. The gate verdict and round count.
3. What you saw running: device, OS, modes, text sizes.
4. What you did not check: motion, haptics and sound always; any platform not run; any state not
   reached. Say it plainly.
5. Waivers and remaining warnings, each with its reason.
6. Where the screenshots are.

## Tells to avoid while building

Each row reads as a default. The dated registry with scope rules is `references/tells.md`.

| Tell | Instead |
|---|---|
| Purple-to-blue gradient on heroes and buttons | One owned colour, named as a token |
| Emoji as the app's icons | One drawn icon set: system icons or an authored set |
| Inter, Geist, Poppins or Nunito as the UI face | The platform face. Identity from the governing asset |
| A card around every row, an icon in a tinted square on every row | Plain rows and sections. A card for one self-contained object |
| Entrance animation on every element, `index * 100` stagger | Lists appear in place. Motion for state changes only |
| Bounce on everything, squish on every touchable | Default spring, bounce 0. Press scale on bounded controls only |
| Haptic on every tap, on mount or on scroll | A haptic for a visible cause, fired when the result arrives |
| Hand-rolled header, back button, tab bar or sheet | Platform containers and system back behaviour |
| A blur view rebuilt as a glass tab bar | Native tabs, or an honest opaque bar |
| Settings or Logout as a tab | Tabs are places visited every session |
| Button shape or chrome that changes screen to screen | Define once, reuse everywhere |
| "Welcome back, John!", "Seamless", "Supercharge", "Elevate" | Plain, specific copy in the product's voice |
| "John Doe", "Acme", "$99.99", invented reviews | Plausible domain data and a designed empty state |
| Sparkle with no label, shimmer on non-AI work | A verb label. The glyph of the real action |
| Streak counter with a flame | No streak by default. Progress in the direction's own asset |
| Magic top padding, content under the notch or home bar | Layout from safe-area insets |
| Success shown in an alert | The result shown in the screen |
| Text that will not scale, sizes below 11 pt | Platform text styles. Fix the layout that breaks |
| Centred balance over a row of round action buttons | Keep the money rules. Compose the home from the governing asset |
| Circular menu, new-chat capsule, tinted bubble, + and mic composer | Change the page structure. See `modules/chat-ai.md` |
| Cream ground, serif and orange accent together | Change the accent or the ground, and anchor it with an asset |
| Quiz funnel, paywall on screen two, permission prompt at launch | A real feature first. Ask when the feature needs it |

Do not flag rounded pills, glass, bento grids or soft blob backgrounds on their own. They are not
tells in mobile.

## When something is missing

| Situation | Do |
|---|---|
| No simulator or emulator | Lint, then run the gate. It prints `GATE: OPEN`. Report that no screen was seen running |
| Android | Build it. `capture.mjs run --android` is best effort and was not run by the authors. Check each screenshot by eye and say so |
| An existing app to redesign | Read its tokens and screens first. Deal with `--brand`. Keep what is owned. Change one screen fully before touching the rest |
| A review, not a build | Skip the deal. Run lint and capture, critique against `references/tells.md`, report findings as "reads as a default" |
| The user rejects the direction | `deal.mjs take 2` or `take 3`. Deal again only if all three are refused |
| A deep link shows an "Open in app?" dialog | Use launch arguments, approve it once by hand, or install idb so capture can accept it |
| No idb | Capture still works. Target sizes and labels are not checked by script: check thumb reach by eye |
| App Store submission is the goal | Run the 4.2 and 4.3 check at the end of `references/tells.md` |

## What this skill does not do

- It does not pick components, state libraries or architecture.
- It does not judge motion, haptics or sound from stills. Check them on a device, or report them
  as unchecked.
- It does not guarantee an App Store approval, an accessibility audit or a good product.
- Its directions come from store screenshots of shipped apps. They describe what was visible, not
  how those apps were made.
