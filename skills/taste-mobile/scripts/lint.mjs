#!/usr/bin/env node
// taste-mobile lint. Zero dependencies, Node 18+.
//
// Regex heuristics over SwiftUI, Compose and React Native source. It finds the tells that
// can be found in code; the ones that need eyes are in references/tells.md.
// FAIL = a functional or platform rule. WARN = a pattern to justify or remove.
//
//   node lint.mjs [--dir .] [--kind money] [--platform ios|android|both] [--json]
//
// Waive a finding with a reason, either inline on the line or the line above:
//   // taste-mobile-ignore T03: brand-owned purple, token brand.primary
// or in .taste-mobile/waivers.json:
//   [{ "rule": "T03", "file": "src/theme", "reason": "brand-owned purple" }]

import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { dirname, join, relative, resolve, extname, basename } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));

const SKIP_DIRS = new Set([
  'node_modules', '.git', 'build', 'dist', 'Pods', '.expo', '.taste-mobile', 'DerivedData', '.gradle',
  '.build', 'vendor', '__tests__', '__mocks__', 'coverage', '.next', 'web-build', '.idea', 'xcuserdata',
]);
const CODE_EXT = new Set(['.tsx', '.ts', '.jsx', '.js', '.mjs', '.swift', '.kt']);
const CONFIG_NAMES = /^(Info\.plist|app\.json|app\.config\.(js|ts|mjs))$/;
const RN = new Set(['.tsx', '.ts', '.jsx', '.js', '.mjs']);

const stackOf = (file) => {
  const e = extname(file);
  if (RN.has(e)) return 'rn';
  if (e === '.swift') return 'swift';
  if (e === '.kt') return 'kotlin';
  return 'config';
};

// ---------- patterns shared by several rules ----------

const HAPTIC_CALL =
  /Haptics\.\w+Async|\b(impactAsync|notificationAsync|selectionAsync|performAndroidHapticsAsync)\(|ReactNativeHapticFeedback\.trigger|\.trigger\(\s*['"](impact|notification|selection)|UI(Impact|Notification|Selection)FeedbackGenerator|\.sensoryFeedback\(|CHHapticEngine|performHapticFeedback|HapticFeedbackConstants\./;
const ANIMATION_USE =
  /\bwithSpring\(|\bwithTiming\(|\bAnimated\.(timing|spring|decay)\(|\bentering=|\bexiting=|\bwithAnimation\b|\.animation\(|\.transition\(|matchedGeometryEffect|\.symbolEffect\(|animate\w+AsState|AnimatedVisibility|updateTransition|AnimatedContent|\btween(<|\()|\bscaleIn\(|\bfadeIn\(/;
const REDUCED_MOTION =
  /useReducedMotion|isReduceMotionEnabled|accessibilityReduceMotion|reduceMotion|ReduceMotion\.|reducedMotion|ANIMATOR_DURATION_SCALE|areAnimatorsEnabled/;
const EMOJI = /[\u{1F300}-\u{1FAFF}\u{2600}-\u{2712}\u{2719}-\u{27BF}\u{2B50}\u{2B55}]/u;
const HEX = /#([0-9a-fA-F]{6})\b|0x(?:[fF]{2})?([0-9a-fA-F]{6})\b/g;

function hue(hex) {
  const r = parseInt(hex.slice(0, 2), 16) / 255;
  const g = parseInt(hex.slice(2, 4), 16) / 255;
  const b = parseInt(hex.slice(4, 6), 16) / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const d = max - min;
  if (d < 0.12) return null; // near grey: no hue to speak of
  let h;
  if (max === r) h = ((g - b) / d) % 6;
  else if (max === g) h = (b - r) / d + 2;
  else h = (r - g) / d + 4;
  return (h * 60 + 360) % 360;
}

const num = (s) => Number.parseFloat(s.startsWith('.') ? `0${s}` : s);

// ---------- line rules ----------
// Each: { id, name, severity, stacks, test(line, ctx) -> true | string | {severity, note} | false, message, instead }

const LINE_RULES = [
  {
    id: 'M01', name: 'bare-spring', severity: 'WARN', stacks: ['rn'],
    test: (l) => /\bwithSpring\(\s*[^,(){}]+\s*\)/.test(l),
    message: "withSpring with no config takes the library default. Reanimated 3's default is damping ratio 0.5, above the bounce ceiling.",
    instead: 'Pass an explicit config, for example withSpring(x, { duration: 400, dampingRatio: 1 }).',
  },
  {
    id: 'M02', name: 'ease-in-on-ui', severity: 'WARN', stacks: ['rn', 'swift'],
    test: (l, c) => (c.stack === 'rn' ? /\bEasing\.in\b(?!Out)|['"]ease-in['"]/.test(l) : /\.easeIn\b(?!Out)/.test(l)),
    message: 'Ease-in on UI starts slow and reads as lag.',
    instead: 'Ease-out (0.23, 1, 0.32, 1) or a critically damped spring.',
  },
  {
    id: 'M03', name: 'uniform-stagger', severity: 'WARN', stacks: ['rn', 'swift', 'kotlin'],
    test: (l) => /delay\w*\s*[:(=]\s*(Double\()?\s*\(?\s*(i|idx|index)\s*\)?\s*\*\s*[\d.]+/i.test(l) && !/\bmin\(/.test(l),
    message: 'Uniform index * N stagger with no cap.',
    instead: 'Non-uniform 30-80 ms steps on the first five or so items, 300 ms total. None on lists opened many times a day.',
  },
  {
    id: 'M04', name: 'scale-from-zero', severity: 'WARN', stacks: ['rn', 'swift', 'kotlin'],
    test: (l, c) => {
      if (c.stack === 'rn') return /\bscale:\s*0\s*[,}\]]/.test(l);
      if (c.stack === 'swift') return /\.scaleEffect\(\s*0(\.0)?\s*\)|\.scale\(scale:\s*0(\.0)?\s*[,)]/.test(l);
      return /initialScale\s*=\s*0(\.0)?f|\bscaleIn\(\s*\)/.test(l);
    },
    message: 'Entrance that scales from zero.',
    instead: 'Start from scale 0.9-0.97 with opacity 0.',
  },
  {
    id: 'M05', name: 'bounce-ceiling', severity: 'WARN', stacks: ['rn', 'swift', 'kotlin'],
    test: (l) => {
      let bounce = null;
      let m;
      if ((m = /\bbounce:\s*(\d?\.\d+)/.exec(l))) bounce = num(m[1]);
      else if ((m = /\b(dampingFraction|dampingRatio)\s*[:=]\s*(\d?\.\d+)/.exec(l))) bounce = 1 - num(m[2]);
      else if (/DampingRatioHighBouncy/.test(l)) bounce = 0.8;
      else if (/DampingRatioMediumBouncy/.test(l)) bounce = 0.5;
      if (bounce === null) return false;
      const b = Math.round(bounce * 100) / 100;
      if (b > 0.4) return { severity: 'FAIL', note: `Bounce ${b} is above the 0.4 ceiling.` };
      if (b > 0.3) return { severity: 'WARN', note: `Bounce ${b}: allowed only on a declared hero moment.` };
      return false;
    },
    message: 'Spring bounce over the limit.',
    instead: 'Bounce 0 by default; up to 0.3 on a hero moment or a release after a drag.',
  },
  {
    id: 'M06', name: 'long-tween', severity: 'WARN', stacks: ['rn', 'swift', 'kotlin'],
    test: (l, c) => {
      let ms = null;
      let m;
      if (c.stack === 'rn' && /withTiming|Animated\.timing|\.duration\(/.test(l)) {
        if ((m = /duration\(?:?\s*(\d{3,5})\b/.exec(l))) ms = Number(m[1]);
      } else if (c.stack === 'swift') {
        if ((m = /\.(easeOut|easeInOut|linear|easeIn)\(duration:\s*(\d*\.?\d+)\s*\)/.exec(l))) ms = num(m[2]) * 1000;
      } else if (c.stack === 'kotlin') {
        if ((m = /\btween(?:<[^>]*>)?\(\s*(?:durationMillis\s*=\s*)?(\d{3,5})\b/.exec(l))) ms = Number(m[1]);
      }
      return ms !== null && ms > 500 ? `${Math.round(ms)} ms tween.` : false;
    },
    message: 'UI tween longer than 500 ms.',
    instead: 'Keep UI tweens under 300 ms. Sheets and drawers run 500 ms at most.',
  },
  {
    id: 'M07', name: 'animated-tab-switch', severity: 'WARN', stacks: ['rn'],
    test: (l, c) => /Tabs|TabNavigator|tabBar/.test(c.text) && /animation:\s*['"](shift|fade|slide_from_right)['"]/.test(l),
    message: 'Animated tab switch. Platform tab bars do not slide.',
    instead: "animation: 'none' on tab screens.",
  },
  {
    id: 'M08', name: 'reduce-motion-never', severity: 'FAIL', stacks: ['rn'],
    test: (l) => /ReduceMotion\.Never/.test(l),
    message: 'ReduceMotion.Never overrides the user setting.',
    instead: 'Leave the default (ReduceMotion.System) and give the animation a reduced variant.',
  },
  {
    id: 'H02', name: 'success-haptic-on-tap', severity: 'WARN', stacks: ['rn'],
    test: (l) => /onPress(In)?=\{[^}]*(notificationAsync|Confirm|notificationSuccess)/.test(l) && !/await|\.then\(/.test(l),
    message: 'Success haptic fired by a plain tap, before any result.',
    instead: 'Fire it where the async result resolves. A plain tap gets none.',
  },
  {
    id: 'H03', name: 'heavy-impact', severity: 'WARN', stacks: ['rn', 'swift'],
    test: (l) => /ImpactFeedbackStyle\.(Heavy|Rigid)|impact\(weight:\s*\.heavy|FeedbackGenerator\(style:\s*\.(heavy|rigid)\)|['"]impactHeavy['"]/.test(l),
    message: 'Heavy or rigid impact.',
    instead: "Weight the impact to the object's visual mass. Small controls get light or none.",
  },
  {
    id: 'H04', name: 'buzzy-android-haptic', severity: 'FAIL', stacks: ['rn', 'kotlin'],
    test: (l) => /createOneShot|\bvibrator\??\.vibrate\(|\bVibration\.vibrate\(|ignoreAndroidSystemSettings:\s*true|enableVibrateFallback:\s*true/.test(l),
    message: 'Vibrator one-shot or fallback: the buzzy path.',
    instead: 'A HapticFeedbackConstants value through performHapticFeedback, or no haptic.',
  },
  {
    id: 'S01', name: 'playback-category-for-ui-sound', severity: 'WARN', stacks: ['swift'],
    skip: (c) => c.kind === 'media',
    test: (l) => /setCategory\(\s*\.(playback|playAndRecord)\b/.test(l),
    message: 'playback audio category ignores the Silent switch and may interrupt the user\'s audio.',
    instead: 'AVAudioSession.Category.ambient for UI sound. Keep playback for sound that is central to the app.',
  },
  {
    id: 'T02', name: 'unlabelled-sparkle', severity: 'WARN', stacks: ['rn', 'swift', 'kotlin'],
    test: (l) => /✨|systemName:\s*"sparkles?"|<Sparkles?\b|name=["']sparkles?["']|Icons\.\w+\.AutoAwesome/.test(l),
    message: 'Sparkle glyph. It reads as a default unless it has a text label and means AI.',
    instead: 'Give it a verb label, or use the glyph of the actual action.',
  },
  {
    id: 'T03', name: 'default-indigo', severity: 'WARN', stacks: ['rn', 'swift', 'kotlin'],
    test: (l) => /6366F1|8B5CF6|7C3AED/i.test(l),
    message: 'Default indigo or violet hex (#6366F1, #8B5CF6, #7C3AED).',
    instead: 'One owned colour, named as a token. Waive this if the brand owns it.',
  },
  {
    id: 'T04', name: 'platform-default-as-brand', severity: 'WARN', stacks: ['rn', 'swift', 'kotlin'],
    test: (l) => /#?(007AFF|6750A4)\b/i.test(l),
    message: 'Hard-coded platform default (#007AFF or #6750A4) standing in for a brand colour.',
    instead: 'An owned colour token, or the system tint through the platform API.',
  },
  {
    id: 'T06', name: 'fake-data', severity: 'WARN', stacks: ['rn', 'swift', 'kotlin'],
    test: (l) => /John Doe|Jane Doe|\bAcme\b|Lorem ipsum|\$99\.99/.test(l),
    message: 'Placeholder data.',
    instead: 'Plausible domain data, and a designed empty state.',
  },
  {
    id: 'T07', name: 'generic-font', severity: 'WARN', stacks: ['rn', 'swift', 'kotlin'],
    test: (l) => /['"](Inter|Geist|Poppins|Nunito)(?![a-z])[-_ \w]*['"]/.test(l),
    message: 'Inter, Geist, Poppins or Nunito standing in for the system face.',
    instead: 'System face for body. Identity comes from the governing asset and at most one display treatment.',
  },
  {
    id: 'T09', name: 'magic-top-padding', severity: 'WARN', stacks: ['rn', 'swift'],
    test: (l, c) =>
      c.stack === 'rn' ? /\b(paddingTop|marginTop):\s*(4[4-9]|5\d|60)\b/.test(l) : /\.padding\(\.top,\s*(4[4-9]|5\d|60)\)/.test(l),
    message: 'Magic top padding in the status-bar range.',
    instead: 'Lay out from safe-area insets.',
  },
  {
    id: 'T10', name: 'template-copy', severity: 'WARN', stacks: ['rn', 'swift', 'kotlin'],
    test: (l) => !/^\s*import\b/.test(l) && /Welcome back,|\u{1F44B}|\b(Elevate your|Seamless(ly)?|Supercharge|Unlock the power|Effortless(ly)?)\b/u.test(l),
    message: 'Template copy.',
    instead: 'Plain, specific copy in the product\'s own voice.',
  },
  {
    id: 'T11', name: 'alert-as-feedback', severity: 'WARN', stacks: ['rn'],
    test: (l) => /Alert\.alert\(\s*['"`](Success|Saved|Done|Error|Invalid|Oops)/.test(l),
    message: 'Alert.alert used for success or validation feedback.',
    instead: 'Show the result in the screen.',
  },
  {
    id: 'T13', name: 'hand-rolled-back', severity: 'WARN', stacks: ['rn', 'swift'],
    test: (l, c) =>
      c.stack === 'rn'
        ? /['"`>]\s*(<|‹|←|<-)\s*Back\b/.test(l)
        : /\.navigationBarBackButtonHidden\(\s*(true)?\s*\)|\.navigationBarHidden\(\s*true\s*\)/.test(l),
    message: 'Hand-rolled back control or hidden system navigation bar.',
    instead: 'Platform navigation containers and the system back behaviour.',
  },
  {
    id: 'T14', name: 'settings-as-tab', severity: 'WARN', stacks: ['rn', 'swift'],
    test: (l, c) =>
      c.stack === 'rn'
        ? /Tabs?\.Screen[^>]*name=["'](settings|logout)["']/i.test(l)
        : /\bTab\(\s*"(Settings|Log ?out)"/.test(l),
    message: 'Settings or Logout as a tab.',
    instead: 'Tabs are for the places people go every session. Put settings behind a profile or toolbar button.',
  },
  {
    id: 'F02', name: 'hyphen-as-minus', severity: 'WARN', stacks: ['rn', 'swift', 'kotlin'],
    needs: 'money',
    test: (l) => /['"`>]\s*-\s?[$€£¥]\s?(\d|\$\{|\\\(|\{)/.test(l),
    message: 'ASCII hyphen used as a minus sign before an amount.',
    instead: 'A true minus (U+2212) or an en dash.',
  },
  {
    id: 'F04', name: 'celebration-on-money', severity: 'WARN', stacks: ['rn', 'swift', 'kotlin'],
    needs: 'money',
    test: (l) => /confetti/i.test(l),
    message: 'Celebration effect in an app that moves money.',
    instead: 'A calm committed state: the amount, the recipient and a success haptic after the result.',
  },
  {
    id: 'A01', name: 'text-scaling-disabled', severity: 'FAIL', stacks: ['rn', 'swift'],
    test: (l, c) =>
      c.stack === 'rn'
        ? /allowFontScaling\s*[=:]\s*\{?\s*false|maxFontSizeMultiplier\s*[=:]\s*\{?\s*1\s*[},]/.test(l)
        : /\.dynamicTypeSize\(\s*\.(xSmall|small|medium|large)\s*\)/.test(l),
    message: 'Text scaling is switched off.',
    instead: 'Let text follow the system size and fix the layout that breaks.',
  },
  {
    id: 'A02', name: 'tiny-type', severity: 'WARN', stacks: ['rn', 'swift', 'kotlin'],
    test: (l, c) => {
      let m;
      if (c.stack === 'rn') m = /\bfontSize:\s*(\d+(?:\.\d+)?)\b/.exec(l);
      else if (c.stack === 'swift') m = /\.system\(size:\s*(\d+(?:\.\d+)?)/.exec(l);
      else m = /fontSize\s*=\s*(\d+(?:\.\d+)?)\.sp/.exec(l);
      return m && Number(m[1]) < 11 ? `${m[1]} pt text.` : false;
    },
    message: 'Text below 11 pt.',
    instead: 'Keep text at 11 pt or larger (the floor is a working rule; it was not re-verified against a primary source).',
  },
  {
    id: 'P01', name: 'glass-compat-flag', severity: 'FAIL', stacks: ['config', 'swift', 'rn'],
    test: (l) => /UIDesignRequiresCompatibility/.test(l),
    message: 'UIDesignRequiresCompatibility is ignored when building for iOS 27.',
    instead: 'Adopt the system bar material and remove the flag.',
  },
];

// ---------- window rules (a trigger line, then a look-ahead) ----------

const WINDOW_RULES = [
  {
    id: 'H01', name: 'haptic-in-scroll', severity: 'FAIL', stacks: ['rn', 'swift', 'kotlin'], span: 12,
    trigger: /\bonScroll\b|useAnimatedScrollHandler|scrollViewDidScroll|onGestureEvent|Animated\.event|onScrollGeometryChange/,
    hit: (w) => HAPTIC_CALL.test(w) && !/threshold|!==|!=|crossed|\bprev\w*|lastIndex|oldValue/i.test(w),
    message: 'Haptic inside a scroll or gesture handler with no threshold or index-change guard.',
    instead: 'Fire only when a threshold is crossed or the index changes.',
  },
  {
    id: 'H08', name: 'double-haptic-on-stock-control', severity: 'WARN', stacks: ['rn', 'swift'], span: 6,
    trigger: /\bToggle\(|\bSlider\(|\bPicker\(|\bStepper\(|<Switch\b|<Slider\b/,
    hit: (w) => HAPTIC_CALL.test(w),
    message: 'Haptic added to a stock toggle, slider or picker. The system already plays one.',
    instead: 'Remove it.',
  },
  {
    id: 'T05', name: 'purple-to-blue-gradient', severity: 'WARN', stacks: ['rn', 'swift', 'kotlin'], span: 6,
    trigger: /LinearGradient|linear-gradient|linearGradient|horizontalGradient|verticalGradient|RadialGradient|AngularGradient/,
    hit: (w) => {
      const hues = [...w.matchAll(HEX)].map((m) => hue(m[1] ?? m[2])).filter((h) => h !== null);
      const named = /\.purple\b|Color\.Magenta|['"]purple['"]/.test(w) && /\.blue\b|\.indigo\b|Color\.Blue|['"]blue['"]/.test(w);
      const violet = hues.some((h) => h >= 255 && h <= 300);
      const blueOrPink = hues.some((h) => (h >= 200 && h < 255) || (h > 300 && h <= 340));
      return named || (violet && blueOrPink);
    },
    message: 'Purple-to-blue gradient. It reads as a default unless the brand owns it.',
    instead: 'Flat surfaces in one owned colour. Tint from content only. Waive this if the purple is brand-owned.',
  },
];

// ---------- file and project rules ----------

function fileRules(file, text, ctx, add) {
  const stack = ctx.stack;
  if (stack === 'rn' && ctx.platform !== 'ios' && /\b(impactAsync|notificationAsync)\(/.test(text) && !/performAndroidHapticsAsync|Platform\.OS/.test(text)) {
    add({
      rule: 'H05', name: 'expo-haptics-on-android', severity: 'WARN', file, line: lineOf(text, /\b(impactAsync|notificationAsync)\(/),
      message: 'expo-haptics impactAsync and notificationAsync use the Vibrator service on Android.',
      instead: "Branch on Platform.OS === 'android' and call performAndroidHapticsAsync, or play none there.",
    });
  }
  if (!ctx.emojiAllowed && stack !== 'config') {
    const lines = text.split('\n');
    const hits = lines.map((l, i) => (!isComment(l) && EMOJI.test(l) ? i + 1 : 0)).filter(Boolean);
    if (hits.length) {
      add({
        rule: 'T01', name: 'emoji-as-icons', severity: 'WARN', file, line: hits[0],
        message: `Emoji in source on ${hits.length} line${hits.length > 1 ? 's' : ''}. Emoji as the app's own icons read as a default.`,
        instead: 'One drawn icon set: system icons or an authored set. Emoji in user-chosen content is fine: waive it.',
        excerpt: lines[hits[0] - 1].trim().slice(0, 140),
      });
    }
  }
  if (stack !== 'config' && /streak/i.test(text) && /\u{1F525}|"flame(\.fill)?"|<Flame\b|LocalFireDepartment/u.test(text)) {
    add({
      rule: 'T12', name: 'streak-flame', severity: 'WARN', file, line: lineOf(text, /\u{1F525}|"flame(\.fill)?"|<Flame\b|LocalFireDepartment/u),
      message: 'Streak counter with a flame.',
      instead: "No streak by default. Show progress with the direction's own asset.",
    });
  }
  if (stack === 'rn' && /BlurView/.test(text) && /tabBar/i.test(text)) {
    add({
      rule: 'T15', name: 'rebuilt-glass-tab-bar', severity: 'WARN', file, line: lineOf(text, /BlurView/),
      message: 'Blur view on a custom tab bar: a replica of system glass.',
      instead: 'Native tabs, so the platform supplies the material, or an honest opaque bar.',
    });
  }
  if (stack === 'swift') {
    const fixed = (text.match(/\.system\(size:/g) || []).length;
    if (fixed > 0 && !/ScaledMetric|relativeTo:/.test(text)) {
      add({
        rule: 'A03', name: 'fixed-size-type', severity: 'WARN', file, line: lineOf(text, /\.system\(size:/),
        message: `${fixed} fixed-size system font${fixed > 1 ? 's' : ''}. Font.system(size:) does not follow Dynamic Type.`,
        instead: 'Text styles (.body, .title2 ...), or scale the size with @ScaledMetric.',
      });
    }
  }
}

function projectRules(files, ctx, add) {
  const code = files.filter((f) => f.stack !== 'config');
  const all = code.map((f) => f.text).join('\n');
  if (!code.length) return;

  // Reduced motion
  const swift = code.filter((f) => f.stack === 'swift').map((f) => f.text).join('\n');
  const kotlin = code.filter((f) => f.stack === 'kotlin').map((f) => f.text).join('\n');
  const rn = code.filter((f) => f.stack === 'rn').map((f) => f.text).join('\n');
  if (swift && ANIMATION_USE.test(swift) && !REDUCED_MOTION.test(swift)) {
    add({ rule: 'M10', name: 'no-reduced-motion-variant', severity: 'FAIL', file: '(project: Swift)', line: 0,
      message: 'Animations with no reduced-motion handling anywhere in the Swift sources.',
      instead: 'Read accessibilityReduceMotion and swap travel for a 150-200 ms crossfade.' });
  }
  if (kotlin && ANIMATION_USE.test(kotlin) && !REDUCED_MOTION.test(kotlin)) {
    add({ rule: 'M10', name: 'no-reduced-motion-variant', severity: 'WARN', file: '(project: Kotlin)', line: 0,
      message: 'Animations with no reduced-motion handling anywhere in the Kotlin sources.',
      instead: 'Respect the system animation setting and give each animation a crossfade variant.' });
  }
  if (rn) {
    const core = /\bAnimated\.(timing|spring|decay)\(/.test(rn);
    const layout = /\bentering=|\bexiting=/.test(rn);
    if ((core || layout) && !/useReducedMotion|isReduceMotionEnabled|\.reduceMotion\(/.test(rn)) {
      add({ rule: 'M10', name: 'no-reduced-motion-variant', severity: core ? 'FAIL' : 'WARN', file: '(project: React Native)', line: 0,
        message: core
          ? 'Animated.* animations with no reduced-motion handling anywhere.'
          : 'entering / exiting animations with no .reduceMotion() or useReducedMotion branch.',
        instead: 'Branch on useReducedMotion and swap travel for a 150-200 ms opacity crossfade.' });
    }
  }

  // Haptics
  const hapticFiles = code.filter((f) => HAPTIC_CALL.test(f.text));
  if (hapticFiles.length) {
    if (!/haptics?_?(enabled|on|off|setting|toggle|pref)|enableHaptics|hapticFeedbackEnabled/i.test(all)) {
      add({ rule: 'H07', name: 'no-haptics-toggle', severity: 'WARN', file: '(project)', line: 0,
        message: 'Haptics are used but no in-app haptics setting was found.',
        instead: 'Add a haptics toggle in settings, separate from the sound toggle.' });
    }
    if (hapticFiles.length > 2) {
      add({ rule: 'H09', name: 'haptics-not-centralised', severity: 'WARN', file: '(project)', line: 0,
        message: `Haptic calls in ${hapticFiles.length} files (${hapticFiles.slice(0, 4).map((f) => f.rel).join(', ')}${hapticFiles.length > 4 ? ', ...' : ''}).`,
        instead: 'Route every haptic through one module that logs {interaction, type, timestamp, screen} in debug builds.' });
    }
    const presses = (rn.match(/\bonPress(In)?=/g) || []).length;
    const rnHaptics = (rn.match(/Haptics\.\w+Async|ReactNativeHapticFeedback\.trigger/g) || []).length;
    if (presses >= 6 && rnHaptics / presses > 0.4) {
      add({ rule: 'H06', name: 'haptic-density', severity: 'WARN', file: '(project: React Native)', line: 0,
        message: `${rnHaptics} haptic calls against ${presses} press handlers. Haptics on most taps read as noise (heuristic).`,
        instead: 'Keep the haptics the mapping names. Plain taps and navigation get none.' });
    }
  }

  // Money
  if (ctx.modules.includes('money') && !/tabular-nums|monospacedDigit|tnum|fontFeatureSettings|FontFeature/.test(all)) {
    add({ rule: 'F01', name: 'no-tabular-figures', severity: 'FAIL', file: '(project)', line: 0,
      message: 'A money app with no tabular figures anywhere in the sources.',
      instead: "Turn on tabular figures for every amount (fontVariant: ['tabular-nums'], .monospacedDigit(), or the tnum feature)." });
  }
}

// ---------- engine ----------

const isComment = (l) => /^\s*(\/\/|\*|\/\*|#)/.test(l);

function lineOf(text, re) {
  const i = text.search(re);
  return i < 0 ? 0 : text.slice(0, i).split('\n').length;
}

function walk(dir, root, out = []) {
  let entries;
  try {
    entries = readdirSync(dir, { withFileTypes: true });
  } catch {
    return out;
  }
  for (const e of entries) {
    if (e.name.startsWith('.') && e.name !== '.') {
      if (e.isDirectory()) continue;
    }
    const p = join(dir, e.name);
    if (e.isDirectory()) {
      if (!SKIP_DIRS.has(e.name)) walk(p, root, out);
    } else if (e.isFile()) {
      const isCode = CODE_EXT.has(extname(e.name)) && !/\.d\.ts$|\.(test|spec)\.[jt]sx?$|\.config\.(js|ts|mjs)$/.test(e.name);
      if (isCode || CONFIG_NAMES.test(e.name)) {
        try {
          if (statSync(p).size < 600_000) out.push(p);
        } catch {
          /* unreadable: skip */
        }
      }
    }
  }
  return out;
}

function readDeal(dir) {
  const p = join(dir, '.taste-mobile', 'deal.json');
  if (!existsSync(p)) return null;
  try {
    return JSON.parse(readFileSync(p, 'utf8'));
  } catch {
    return null;
  }
}

function readWaivers(dir) {
  const p = join(dir, '.taste-mobile', 'waivers.json');
  if (!existsSync(p)) return { list: [], invalid: [] };
  try {
    const raw = JSON.parse(readFileSync(p, 'utf8'));
    const list = Array.isArray(raw) ? raw : [];
    return {
      list: list.filter((w) => w.rule && typeof w.reason === 'string' && w.reason.trim().length >= 8),
      invalid: list.filter((w) => !(w.rule && typeof w.reason === 'string' && w.reason.trim().length >= 8)),
    };
  } catch {
    return { list: [], invalid: [{ rule: '?', reason: 'waivers.json is not valid JSON' }] };
  }
}

/**
 * @param {{dir?:string, kind?:string, platform?:string}} opts
 */
export function lint(opts = {}) {
  const dir = resolve(opts.dir ?? '.');
  const dealt = readDeal(dir);
  const router = JSON.parse(readFileSync(join(HERE, '..', 'data', 'kinds.json'), 'utf8'));
  const kind = opts.kind ?? dealt?.kind ?? null;
  const platform = opts.platform ?? dealt?.platform ?? 'both';
  const modules = kind && router.kinds[kind] ? router.kinds[kind].modules : [];
  const picked = dealt?.picked ?? null;
  const ctxBase = { kind, platform, modules, picked, emojiAllowed: picked === 'toy-game-engine-tactile' };
  const waivers = readWaivers(dir);

  const files = walk(dir, dir).map((p) => {
    const text = readFileSync(p, 'utf8');
    return { path: p, rel: relative(dir, p), text, stack: stackOf(p) };
  });

  const findings = [];
  const add = (f) => findings.push(f);

  for (const f of files) {
    const ctx = { ...ctxBase, stack: f.stack, text: f.text };
    const lines = f.text.split('\n');
    lines.forEach((line, i) => {
      if (isComment(line) || line.length > 2000) return;
      for (const r of LINE_RULES) {
        if (!r.stacks.includes(f.stack)) continue;
        if (r.needs && !modules.includes(r.needs)) continue;
        if (r.skip?.(ctx)) continue;
        const res = r.test(line, ctx);
        if (!res) continue;
        const extra = typeof res === 'object' ? res : {};
        add({
          rule: r.id, name: r.name, severity: extra.severity ?? r.severity, file: f.rel, line: i + 1,
          message: typeof res === 'string' ? `${r.message} ${res}` : extra.note ?? r.message,
          instead: r.instead, excerpt: line.trim().slice(0, 140),
        });
      }
      for (const r of WINDOW_RULES) {
        if (!r.stacks.includes(f.stack) || /^\s*import\b/.test(line) || !r.trigger.test(line)) continue;
        const window = lines.slice(i, i + r.span).filter((l) => !isComment(l)).join('\n');
        if (r.hit(window)) {
          add({ rule: r.id, name: r.name, severity: r.severity, file: f.rel, line: i + 1, message: r.message, instead: r.instead, excerpt: line.trim().slice(0, 140) });
        }
      }
    });
    fileRules(f.rel, f.text, ctx, add);
  }
  projectRules(files, ctxBase, add);

  // Waivers: inline first, then the file.
  const byPath = Object.fromEntries(files.map((f) => [f.rel, f.text.split('\n')]));
  for (const f of findings) {
    const lines = byPath[f.file];
    if (lines && f.line > 0) {
      const near = `${lines[f.line - 2] ?? ''}\n${lines[f.line - 1] ?? ''}`;
      const m = new RegExp(`taste-mobile-ignore\\s+${f.rule}\\s*:\\s*(\\S.{6,})`).exec(near);
      if (m) {
        f.waived = m[1].trim();
        continue;
      }
    }
    const w = waivers.list.find((x) => x.rule === f.rule && (!x.file || f.file.startsWith(x.file) || f.file.includes(x.file)));
    if (w) f.waived = w.reason.trim();
  }

  // One finding per rule and file is enough to act on; keep the first line and a count.
  const merged = [];
  const seen = new Map();
  for (const f of findings) {
    const key = `${f.rule}|${f.file}|${f.waived ? 'w' : ''}|${f.severity}`;
    if (seen.has(key)) {
      const first = seen.get(key);
      first.count += 1;
      first.lines.push(f.line);
    } else {
      const item = { ...f, count: 1, lines: [f.line] };
      seen.set(key, item);
      merged.push(item);
    }
  }
  const order = { FAIL: 0, WARN: 1 };
  merged.sort((a, b) => (a.waived ? 1 : 0) - (b.waived ? 1 : 0) || order[a.severity] - order[b.severity] || a.rule.localeCompare(b.rule));

  const live = merged.filter((f) => !f.waived);
  return {
    dir, kind, platform, picked, files: files.length,
    findings: merged,
    invalidWaivers: waivers.invalid,
    summary: {
      fail: live.filter((f) => f.severity === 'FAIL').length,
      warn: live.filter((f) => f.severity === 'WARN').length,
      waived: merged.length - live.length,
    },
  };
}

export const RULES = [...LINE_RULES, ...WINDOW_RULES].map(({ id, name, severity, message, instead }) => ({ id, name, severity, message, instead }));

function print(r) {
  console.log(`taste-mobile lint  ${r.files} files  kind ${r.kind ?? 'unknown'}  platform ${r.platform}`);
  if (!r.files) console.log('\nNo source files found (.swift, .kt, .tsx, .ts, .jsx, .js).');
  for (const f of r.findings) {
    const where = f.line > 0 ? `${f.file}:${f.line}` : f.file;
    const more = f.count > 1 ? `  (+${f.count - 1} more: lines ${f.lines.slice(1, 6).join(', ')}${f.count > 6 ? ', ...' : ''})` : '';
    console.log(`\n${f.waived ? 'WAIVED' : f.severity.padEnd(6)} ${f.rule} ${f.name}  ${where}${more}`);
    console.log(`       ${f.message}`);
    if (f.excerpt) console.log(`       > ${f.excerpt}`);
    console.log(f.waived ? `       Waiver: ${f.waived}` : `       Instead: ${f.instead}`);
  }
  for (const w of r.invalidWaivers) console.log(`\nINVALID WAIVER for ${w.rule ?? '?'}: a waiver needs a rule and a reason of at least 8 characters.`);
  const s = r.summary;
  console.log(`\nLINT: ${s.fail ? 'FAIL' : 'PASS'}  ${s.fail} fail, ${s.warn} warn, ${s.waived} waived`);
  if (!s.fail && s.warn) console.log('Warnings do not block the gate. Fix them or waive each with a reason.');
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const argv = process.argv.slice(2);
  const flag = (n) => {
    const i = argv.indexOf(`--${n}`);
    return i > -1 ? argv[i + 1] : undefined;
  };
  if (argv.includes('--rules')) {
    for (const r of RULES) console.log(`${r.id}  ${r.severity.padEnd(4)}  ${r.name.padEnd(34)} ${r.message}`);
    process.exit(0);
  }
  try {
    const r = lint({ dir: flag('dir') ?? '.', kind: flag('kind'), platform: flag('platform') });
    if (argv.includes('--json')) console.log(JSON.stringify(r, null, 2));
    else print(r);
    process.exit(r.summary.fail ? 1 : 0);
  } catch (e) {
    console.error(`lint: ${e.message}`);
    process.exit(2);
  }
}
