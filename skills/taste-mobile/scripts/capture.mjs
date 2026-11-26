#!/usr/bin/env node
// taste-mobile capture. Zero dependencies, Node 18+.
//
// Drives a simulator through every screen in light, dark and the largest text size,
// saves the screenshots, and runs the pixel checks a script can do. The judgement
// passes are yours: capture writes .taste-mobile/critique.md for you to fill in.
//
//   node capture.mjs init [--dir .]             write a .taste-mobile/screens.json to edit
//   node capture.mjs devices                    list booted iOS simulators
//   node capture.mjs run --udid <udid> [--dir .] [--passes light,dark,large] [--keep-status-bar]
//   node capture.mjs motion on|off --udid <udid>   toggle Reduce Motion (relaunch the app after)
//   node capture.mjs check [--dir .]            re-run the pixel checks and rebuild the contact sheet
//   node capture.mjs run --android [--serial <id>]   same passes through adb (best effort, untested)
//
// It never boots, erases or shuts down a simulator. Boot the one you want first.
//
// With idb installed (optional: https://fbidb.io) it also saves each screen's accessibility
// tree, checks target sizes and labels, and accepts the "Open in app?" dialog that iOS shows
// the first time a custom-scheme link is opened on a simulator. Without idb, open screens
// with launch arguments, or approve that dialog once by hand before capturing.

import { execFileSync } from 'node:child_process';
import { readFileSync, writeFileSync, mkdirSync, existsSync, statSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { inflateSync } from 'node:zlib';

const LARGEST = 'accessibility-extra-extra-extra-large';
const PASSES = {
  light: { appearance: 'light', size: 'large', label: 'Light' },
  dark: { appearance: 'dark', size: 'large', label: 'Dark' },
  large: { appearance: 'light', size: LARGEST, label: 'Largest text' },
};

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const run = (cmd, args, opts = {}) => execFileSync(cmd, args, { stdio: ['ignore', 'pipe', 'pipe'], maxBuffer: 64 * 1024 * 1024, ...opts });
const tryRun = (cmd, args) => {
  try {
    return { ok: true, out: run(cmd, args).toString() };
  } catch (e) {
    return { ok: false, out: String(e.stderr || e.message) };
  }
};

// ---------- idb (optional) ----------

let idbState = null;
export function hasIdb() {
  if (idbState === null) idbState = tryRun('idb', ['--help']).ok;
  return idbState;
}

function idbTree(udid) {
  const r = tryRun('idb', ['ui', 'describe-all', '--udid', udid]);
  if (!r.ok) return null;
  try {
    return JSON.parse(r.out);
  } catch {
    return null;
  }
}

const isOpenDialog = (tree) => Array.isArray(tree) && tree.some((e) => e.type === 'StaticText' && /^Open in\b/.test(e.AXLabel ?? ''));

/** Checks one accessibility tree. Frames are accessibility frames, which can be smaller than the hit region. */
export function treeChecks(screen, tree) {
  const out = [];
  if (!Array.isArray(tree)) return out;
  if (isOpenDialog(tree)) {
    out.push({ id: 'C12', severity: 'FAIL', screen, pass: 'tree', message: 'A system "Open in app?" dialog is covering the screen. Approve it once on this simulator, or open the screen with launch arguments.' });
    return out;
  }
  const controls = tree.filter((e) => ['Button', 'Link', 'Switch', 'Slider', 'TextField', 'SearchField'].includes(e.type) && e.enabled !== false && e.frame);
  const small = controls.filter((e) => e.frame.width > 0 && e.frame.height > 0 && (e.frame.width < 44 || e.frame.height < 44) && e.frame.height < 100);
  const tiny = small.filter((e) => e.frame.width < 28 || e.frame.height < 28);
  const name = (e) => `"${(e.AXLabel || e.type).slice(0, 28)}" ${Math.round(e.frame.width)}x${Math.round(e.frame.height)}`;
  if (small.length) {
    out.push({
      id: 'C10', severity: 'WARN', screen, pass: 'tree',
      message: `${small.length} control${small.length > 1 ? 's' : ''} with an accessibility frame under 44x44 pt${tiny.length ? ` (${tiny.length} under 28 pt)` : ''}: ${small.slice(0, 4).map(name).join(', ')}${small.length > 4 ? ', ...' : ''}. Confirm the hit region is 44x44 or larger.`,
    });
  }
  const unlabelled = controls.filter((e) => ['Button', 'Link'].includes(e.type) && !(e.AXLabel ?? '').trim() && !(e.title ?? '').trim());
  if (unlabelled.length) {
    out.push({ id: 'C11', severity: 'WARN', screen, pass: 'tree', message: `${unlabelled.length} button${unlabelled.length > 1 ? 's' : ''} with no accessibility label.` });
  }
  return out;
}

// ---------- PNG reading (enough for simulator screenshots) ----------

export function readPng(buf) {
  if (buf.readUInt32BE(0) !== 0x89504e47) throw new Error('not a PNG');
  let pos = 8;
  let ihdr = null;
  const idat = [];
  while (pos < buf.length) {
    const len = buf.readUInt32BE(pos);
    const type = buf.toString('latin1', pos + 4, pos + 8);
    const data = buf.subarray(pos + 8, pos + 8 + len);
    if (type === 'IHDR') ihdr = { width: data.readUInt32BE(0), height: data.readUInt32BE(4), depth: data[8], color: data[9], interlace: data[12] };
    else if (type === 'IDAT') idat.push(data);
    else if (type === 'IEND') break;
    pos += 12 + len;
  }
  if (!ihdr) throw new Error('PNG has no header');
  return { ...ihdr, idat };
}

/** Returns a small greyscale grid (values 0..1), or null when the PNG variant is not supported. */
export function thumbnail(buf, cols = 24, rows = 52) {
  const png = readPng(buf);
  const channels = { 0: 1, 2: 3, 4: 2, 6: 4 }[png.color];
  if (!channels || png.interlace || (png.depth !== 8 && png.depth !== 16)) return { width: png.width, height: png.height, grid: null };
  const bps = png.depth / 8;
  const bpp = channels * bps;
  const stride = png.width * bpp;
  const raw = inflateSync(Buffer.concat(png.idat));
  const out = Buffer.alloc(png.height * stride);
  for (let y = 0; y < png.height; y++) {
    const filter = raw[y * (stride + 1)];
    const src = y * (stride + 1) + 1;
    const dst = y * stride;
    for (let x = 0; x < stride; x++) {
      const a = x >= bpp ? out[dst + x - bpp] : 0;
      const b = y > 0 ? out[dst + x - stride] : 0;
      const c = x >= bpp && y > 0 ? out[dst + x - stride - bpp] : 0;
      let v = raw[src + x];
      if (filter === 1) v += a;
      else if (filter === 2) v += b;
      else if (filter === 3) v += (a + b) >> 1;
      else if (filter === 4) {
        const p = a + b - c;
        const pa = Math.abs(p - a);
        const pb = Math.abs(p - b);
        const pc = Math.abs(p - c);
        v += pa <= pb && pa <= pc ? a : pb <= pc ? b : c;
      }
      out[dst + x] = v & 255;
    }
  }
  const luma = (x, y) => {
    const i = y * stride + x * bpp;
    if (channels < 3) return out[i] / 255;
    return (0.2126 * out[i] + 0.7152 * out[i + bps] + 0.0722 * out[i + 2 * bps]) / 255;
  };
  const grid = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      let sum = 0;
      for (let sy = 0; sy < 4; sy++) {
        for (let sx = 0; sx < 4; sx++) {
          const x = Math.min(png.width - 1, Math.floor(((c + (sx + 0.5) / 4) * png.width) / cols));
          const y = Math.min(png.height - 1, Math.floor(((r + (sy + 0.5) / 4) * png.height) / rows));
          sum += luma(x, y);
        }
      }
      grid.push(sum / 16);
    }
  }
  return { width: png.width, height: png.height, grid };
}

const mean = (a) => a.reduce((s, v) => s + v, 0) / a.length;
const stdev = (a) => {
  const m = mean(a);
  return Math.sqrt(mean(a.map((v) => (v - m) ** 2)));
};
const diff = (a, b) => mean(a.map((v, i) => Math.abs(v - b[i])));

// ---------- pixel checks ----------

export function pixelChecks(shots) {
  const checks = [];
  const byScreen = {};
  for (const s of shots) (byScreen[s.screen] ??= {})[s.pass] = s;
  for (const s of shots) {
    if (!s.grid) continue;
    if (stdev(s.grid) < 0.012) {
      checks.push({ id: 'C03', severity: 'FAIL', screen: s.screen, pass: s.pass, message: 'The screenshot is one flat colour. The screen did not render, or the capture ran before it settled.' });
    }
    if (s.pass === 'dark' && mean(s.grid) > 0.6) {
      checks.push({ id: 'C04', severity: 'WARN', screen: s.screen, pass: s.pass, message: `The dark pass is mostly light (mean luminance ${mean(s.grid).toFixed(2)}).` });
    }
  }
  for (const [screen, p] of Object.entries(byScreen)) {
    if (p.light?.grid && p.dark?.grid && diff(p.light.grid, p.dark.grid) < 0.02) {
      checks.push({ id: 'C01', severity: 'WARN', screen, pass: 'dark', message: 'Dark looks the same as light. Either dark is not implemented, or the app is single-mode: say so under Modes in MOBILE-DESIGN.md.' });
    }
    if (p.light?.grid && p.large?.grid && diff(p.light.grid, p.large.grid) < 0.004) {
      checks.push({ id: 'C02', severity: 'WARN', screen, pass: 'large', message: 'The largest text size looks the same as the default. Text is not following the system size.' });
    }
  }
  return checks;
}

// ---------- drivers ----------

function iosDriver(udid) {
  const sim = (...a) => run('xcrun', ['simctl', ...a]);
  return {
    platform: 'ios',
    id: udid,
    describe() {
      const all = JSON.parse(sim('list', 'devices', '-j').toString()).devices;
      for (const [runtime, list] of Object.entries(all)) {
        const d = list.find((x) => x.udid === udid);
        if (d) return { udid, name: d.name, runtime: runtime.replace('com.apple.CoreSimulator.SimRuntime.', '').replace(/^(\w+)-(\d+)-(\d+)$/, '$1 $2.$3'), state: d.state };
      }
      throw new Error(`No simulator with udid ${udid}`);
    },
    setPass(p) {
      sim('ui', udid, 'appearance', p.appearance);
      sim('ui', udid, 'content_size', p.size);
    },
    statusBar(on) {
      if (on) tryRun('xcrun', ['simctl', 'status_bar', udid, 'override', '--time', '9:41', '--batteryState', 'charged', '--batteryLevel', '100', '--cellularBars', '4', '--wifiBars', '3']);
      else tryRun('xcrun', ['simctl', 'status_bar', udid, 'clear']);
    },
    open(screen, bundleId) {
      if (screen.args || (!screen.url && bundleId)) {
        tryRun('xcrun', ['simctl', 'terminate', udid, bundleId]);
        sim('launch', udid, bundleId, ...(screen.args ?? []));
      }
      if (screen.url) sim('openurl', udid, screen.url);
    },
    shot(path) {
      sim('io', udid, 'screenshot', '--type=png', path);
    },
    tree() {
      return hasIdb() ? idbTree(udid) : null;
    },
    /** Accepts the first-use "Open in app?" dialog. Returns true when one was found. */
    acceptOpenDialog() {
      if (!hasIdb()) return false;
      let found = false;
      for (let i = 0; i < 4; i++) {
        const tree = idbTree(udid);
        if (!isOpenDialog(tree)) break;
        const open = tree.find((e) => e.type === 'Button' && e.AXLabel === 'Open');
        if (!open) break;
        found = true;
        tryRun('idb', ['ui', 'tap', '--udid', udid, String(Math.round(open.frame.x + open.frame.width / 2)), String(Math.round(open.frame.y + open.frame.height / 2))]);
        execFileSync('sleep', ['1']);
      }
      return found;
    },
    restore() {
      tryRun('xcrun', ['simctl', 'ui', udid, 'appearance', 'light']);
      tryRun('xcrun', ['simctl', 'ui', udid, 'content_size', 'large']);
    },
  };
}

// Best effort. Written from the adb documentation and not run by the authors: treat a pass
// from this driver as unverified until you have looked at the screenshots yourself.
function androidDriver(serial) {
  const adb = (...a) => run('adb', [...(serial ? ['-s', serial] : []), ...a]);
  return {
    platform: 'android',
    id: serial ?? 'default',
    describe() {
      return { udid: serial ?? 'default', name: adb('shell', 'getprop', 'ro.product.model').toString().trim(), runtime: `Android ${adb('shell', 'getprop', 'ro.build.version.release').toString().trim()}`, state: 'device' };
    },
    setPass(p) {
      adb('shell', 'cmd', 'uimode', 'night', p.appearance === 'dark' ? 'yes' : 'no');
      adb('shell', 'settings', 'put', 'system', 'font_scale', p.size === LARGEST ? '2.0' : '1.0');
    },
    statusBar() {},
    open(screen, bundleId) {
      if (screen.url) adb('shell', 'am', 'start', '-W', '-a', 'android.intent.action.VIEW', '-d', screen.url);
      else if (bundleId) adb('shell', 'monkey', '-p', bundleId, '-c', 'android.intent.category.LAUNCHER', '1');
    },
    shot(path) {
      writeFileSync(path, adb('exec-out', 'screencap', '-p'));
    },
    tree() {
      return null;
    },
    acceptOpenDialog() {
      return false;
    },
    restore() {
      try {
        adb('shell', 'cmd', 'uimode', 'night', 'no');
        adb('shell', 'settings', 'put', 'system', 'font_scale', '1.0');
      } catch {
        /* leave it */
      }
    },
  };
}

// ---------- files ----------

const stateDir = (dir) => join(resolve(dir), '.taste-mobile');

const SCREENS_TEMPLATE = {
  _note: 'One entry per screen. Give each launch arguments (args) or a deep link (url) that opens it directly. Prefer args on iOS: a custom-scheme link shows an "Open in app?" dialog the first time it is used on a simulator. settleMs is the wait before the screenshot.',
  bundleId: 'com.example.app',
  settleMs: 1500,
  screens: [
    { name: 'home', args: ['-screen', 'home'] },
    { name: 'detail', args: ['-screen', 'detail'] },
  ],
};

export const CRITIQUE_PASSES = [
  ['One second', 'After one second, what is this screen for and what is its main action? If you cannot say, the hierarchy is wrong.'],
  ['Squint', 'Blur your eyes. One thing should dominate, and it should be the thing that matters. Hierarchy must survive without colour.'],
  ['Cover the logo', 'Hide the name and logo. Could this be any app? Name the governing asset you can see on this screen.'],
  ['Thumb reach', 'The primary action sits where a thumb reaches. Targets are 44 pt (48 dp) or larger with space between them.'],
  ['Trunk test', 'Dropped onto this screen cold: where am I, how did I get here, where can I go next?'],
  ['Dark', 'Dark is designed, not inverted: surfaces stay distinct, colour roles keep their meaning, text keeps its contrast.'],
  ['Largest text', 'At the largest text size nothing is clipped, overlapped or truncated into nonsense, and the layout reflows.'],
  ['Sameness', 'Across screens: one button shape, one chrome, one radius scale, a tab bar that never changes. Across projects: does this look like the last app you built?'],
];

function critiqueTemplate(index) {
  const screens = [...new Set(index.shots.map((s) => s.screen))];
  const auto = index.checks.length
    ? index.checks.map((c) => `- ${c.severity} ${c.id} (${c.screen}, ${c.pass}): ${c.message}`).join('\n')
    : '- none';
  return `# Critique, round ${index.round}

Look at every screenshot in \`.taste-mobile/shots/\` (open \`contact.html\` to see them side by side).
Answer each pass for the screens it applies to. Write findings as "reads as a default" or "reads as
a template", name the screen, and say what to change. Then pick the top three fixes. Replace every TODO.

Screens: ${screens.join(', ')}
Device: ${index.device.name} (${index.device.runtime})

## Checks from capture
${auto}

${CRITIQUE_PASSES.map(([name, q]) => `## ${name}\n${q}\n\n- TODO`).join('\n\n')}

## Top three fixes this round
1. TODO
2. TODO
3. TODO

## Could not check
- Motion, haptics and sound cannot be judged from stills. Say what was checked another way, or list it as open.
- TODO (anything else: a platform that was not run, a state that could not be reached)
`;
}

function contactSheet(index) {
  const screens = [...new Set(index.shots.map((s) => s.screen))];
  const passes = [...new Set(index.shots.map((s) => s.pass))];
  const cell = (screen, pass) => {
    const s = index.shots.find((x) => x.screen === screen && x.pass === pass);
    return s ? `<figure><img src="${s.file}" alt="${screen}, ${PASSES[pass]?.label ?? pass}" loading="lazy"><figcaption>${PASSES[pass]?.label ?? pass}</figcaption></figure>` : '<figure class="missing">not captured</figure>';
  };
  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>taste-mobile contact sheet</title>
<style>
  :root { color-scheme: light dark; --bg: #f4f3f0; --ink: #16171a; --mute: #6b6f76; --line: #d9d7d2; }
  @media (prefers-color-scheme: dark) { :root { --bg: #121315; --ink: #ecebe7; --mute: #9a9da3; --line: #2b2d31; } }
  body { margin: 0; padding: 24px 16px 64px; background: var(--bg); color: var(--ink); font: 15px/1.5 -apple-system, system-ui, sans-serif; }
  h1 { font-size: 20px; margin: 0 0 4px; } p { margin: 0 0 24px; color: var(--mute); }
  h2 { font-size: 15px; margin: 32px 0 12px; padding-top: 16px; border-top: 1px solid var(--line); }
  .row { display: grid; grid-template-columns: repeat(${passes.length}, minmax(0, 260px)); gap: 16px; }
  figure { margin: 0; } img { width: 100%; display: block; border-radius: 18px; border: 1px solid var(--line); }
  figcaption { margin-top: 6px; font-size: 13px; color: var(--mute); }
  .missing { display: grid; place-items: center; min-height: 200px; border: 1px dashed var(--line); border-radius: 18px; color: var(--mute); }
  li { margin-bottom: 4px; }
</style></head><body>
<h1>Contact sheet, round ${index.round}</h1>
<p>${index.device.name} · ${index.device.runtime} · captured ${index.captured_at}</p>
${index.checks.length ? `<ul>${index.checks.map((c) => `<li><strong>${c.severity} ${c.id}</strong> ${c.screen} (${c.pass}): ${c.message}</li>`).join('')}</ul>` : ''}
${screens.map((sc) => `<h2>${sc}</h2><div class="row">${passes.map((p) => cell(sc, p)).join('')}</div>`).join('\n')}
</body></html>
`;
}

function analyse(dir, index) {
  const shots = index.shots.map((s) => {
    const p = join(stateDir(dir), 'shots', s.file);
    if (!existsSync(p)) return { ...s, missing: true };
    try {
      const buf = readFileSync(p);
      const t = thumbnail(buf);
      return { ...s, width: t.width, height: t.height, bytes: buf.length, grid: t.grid };
    } catch (e) {
      return { ...s, error: e.message };
    }
  });
  index.checks = pixelChecks(shots);
  for (const t of index.trees ?? []) {
    try {
      index.checks.push(...treeChecks(t.screen, JSON.parse(readFileSync(join(stateDir(dir), 'shots', t.file), 'utf8'))));
    } catch {
      /* an unreadable tree is skipped */
    }
  }
  index.shots = shots.map(({ grid, ...rest }) => ({ ...rest, luminance: grid ? Number(mean(grid).toFixed(3)) : null }));
  return index;
}

function writeOutputs(dir, index, { freshCritique }) {
  const state = stateDir(dir);
  writeFileSync(join(state, 'shots', 'index.json'), JSON.stringify(index, null, 2) + '\n');
  writeFileSync(join(state, 'shots', 'contact.html'), contactSheet(index));
  const critique = join(state, 'critique.md');
  if (freshCritique || !existsSync(critique)) writeFileSync(critique, critiqueTemplate(index));
}

// ---------- commands ----------

function bootedDevices() {
  const all = JSON.parse(run('xcrun', ['simctl', 'list', 'devices', 'booted', '-j']).toString()).devices;
  return Object.entries(all).flatMap(([runtime, list]) => list.map((d) => ({ udid: d.udid, name: d.name, runtime: runtime.replace('com.apple.CoreSimulator.SimRuntime.', '').replace(/^(\w+)-(\d+)-(\d+)$/, '$1 $2.$3') })));
}

async function cmdRun(args) {
  const dir = args.dir ?? '.';
  const state = stateDir(dir);
  const cfgPath = join(state, 'screens.json');
  if (!existsSync(cfgPath)) throw new Error(`No ${cfgPath}. Run: node capture.mjs init --dir ${dir}`);
  const cfg = JSON.parse(readFileSync(cfgPath, 'utf8'));
  if (!Array.isArray(cfg.screens) || !cfg.screens.length) throw new Error('screens.json lists no screens.');
  if (cfg.bundleId === SCREENS_TEMPLATE.bundleId) throw new Error('screens.json still has the template bundleId. Edit it first.');

  let driver;
  if (args.android) driver = androidDriver(args.serial);
  else {
    let udid = args.udid;
    if (!udid) {
      const booted = bootedDevices();
      if (booted.length !== 1) {
        throw new Error(`Pass --udid. Booted simulators:\n${booted.map((d) => `  ${d.udid}  ${d.name} (${d.runtime})`).join('\n') || '  none: boot one first'}`);
      }
      udid = booted[0].udid;
    }
    driver = iosDriver(udid);
  }
  const device = driver.describe();
  if (driver.platform === 'ios' && device.state !== 'Booted') throw new Error(`${device.name} is not booted. Boot it first: xcrun simctl boot ${device.udid}`);

  const passes = (args.passes ?? 'light,dark,large').split(',').map((p) => p.trim()).filter(Boolean);
  for (const p of passes) if (!PASSES[p]) throw new Error(`Unknown pass "${p}". Use light, dark, large.`);
  const settle = Number(cfg.settleMs ?? 1500);

  let round = 1;
  const prev = join(state, 'shots', 'index.json');
  if (existsSync(prev)) {
    try {
      round = (JSON.parse(readFileSync(prev, 'utf8')).round ?? 0) + 1;
    } catch {
      /* start again at 1 */
    }
  }

  const shots = [];
  const trees = [];
  const customLinks = cfg.screens.filter((s) => s.url && !/^https?:/.test(s.url));
  if (driver.platform === 'ios' && customLinks.length && !hasIdb()) {
    console.log(`Note: ${customLinks.length} screen${customLinks.length > 1 ? 's open' : ' opens'} through a custom-scheme link. iOS shows an "Open in app?" dialog the first`);
    console.log('time such a link is used on a simulator, and this script cannot accept it without idb. Approve it once');
    console.log('by hand, or use launch arguments. Look at the screenshots before trusting them.\n');
  }
  if (!args['keep-status-bar']) driver.statusBar(true);
  try {
    for (const [n, p] of passes.entries()) {
      mkdirSync(join(state, 'shots', p), { recursive: true });
      driver.setPass(PASSES[p]);
      await sleep(600);
      for (const screen of cfg.screens) {
        driver.open(screen, cfg.bundleId);
        await sleep(Number(screen.settleMs ?? settle));
        if (screen.url && driver.acceptOpenDialog()) await sleep(Number(screen.settleMs ?? settle));
        const file = `${p}/${screen.name}.png`;
        driver.shot(join(state, 'shots', file));
        shots.push({ screen: screen.name, pass: p, file });
        if (n === 0) {
          const tree = driver.tree();
          if (tree) {
            mkdirSync(join(state, 'shots', 'tree'), { recursive: true });
            writeFileSync(join(state, 'shots', 'tree', `${screen.name}.json`), JSON.stringify(tree, null, 1) + '\n');
            trees.push({ screen: screen.name, file: `tree/${screen.name}.json` });
          }
        }
        console.log(`  ${p.padEnd(6)} ${screen.name}`);
      }
    }
  } finally {
    driver.restore();
    if (!args['keep-status-bar']) driver.statusBar(false);
  }

  const index = analyse(dir, {
    round,
    platform: driver.platform,
    verified_driver: driver.platform === 'ios',
    device,
    captured_at: new Date().toISOString(),
    passes,
    shots,
    trees,
    checks: [],
  });
  writeOutputs(dir, index, { freshCritique: true });
  console.log(`\nCaptured ${shots.length} screenshots on ${device.name} (${device.runtime}), round ${round}.`);
  console.log(trees.length ? `Saved ${trees.length} accessibility trees (idb).` : 'No accessibility trees: idb is not installed, so target sizes and labels were not checked.');
  for (const c of index.checks) console.log(`${c.severity} ${c.id}  ${c.screen} (${c.pass}): ${c.message}`);
  console.log(`\nContact sheet  ${join(state, 'shots', 'contact.html')}`);
  console.log(`Critique       ${join(state, 'critique.md')}  (look at every screenshot, then fill it in)`);
  if (driver.platform === 'android') console.log('\nThe Android driver is best effort and was not run by the authors. Check each screenshot by eye.');
}

function parseArgs(argv) {
  const out = { _: [] };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a.startsWith('--')) {
      const next = argv[i + 1];
      if (next === undefined || next.startsWith('--')) out[a.slice(2)] = true;
      else out[a.slice(2)] = argv[++i];
    } else out._.push(a);
  }
  for (const k of ['dir', 'udid', 'passes', 'serial']) if (out[k] === true) delete out[k];
  return out;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const cmd = args._[0] ?? 'help';
  const dir = args.dir ?? '.';

  if (cmd === 'init') {
    const state = stateDir(dir);
    mkdirSync(state, { recursive: true });
    const p = join(state, 'screens.json');
    if (existsSync(p)) return console.log(`Kept the existing ${p}`);
    writeFileSync(p, JSON.stringify(SCREENS_TEMPLATE, null, 2) + '\n');
    return console.log(`Wrote ${p}. Set bundleId and list every screen with a deep link or launch arguments.`);
  }
  if (cmd === 'devices') {
    const b = bootedDevices();
    if (!b.length) return console.log('No booted simulators. Boot one: xcrun simctl boot <udid>');
    return b.forEach((d) => console.log(`${d.udid}  ${d.name} (${d.runtime})`));
  }
  if (cmd === 'run') return cmdRun(args);
  if (cmd === 'motion') {
    const on = args._[1] === 'on';
    if (!args.udid) throw new Error('Pass --udid.');
    run('xcrun', ['simctl', 'spawn', args.udid, 'defaults', 'write', 'com.apple.Accessibility', 'ReduceMotionEnabled', '-bool', on ? 'true' : 'false']);
    return console.log(`Reduce Motion ${on ? 'on' : 'off'}. Relaunch the app for it to take effect.`);
  }
  if (cmd === 'check') {
    const p = join(stateDir(dir), 'shots', 'index.json');
    if (!existsSync(p)) throw new Error(`No ${p}. Capture first.`);
    const index = analyse(dir, JSON.parse(readFileSync(p, 'utf8')));
    writeOutputs(dir, index, { freshCritique: false });
    for (const c of index.checks) console.log(`${c.severity} ${c.id}  ${c.screen} (${c.pass}): ${c.message}`);
    return console.log(`${index.shots.length} screenshots, ${index.checks.length} pixel findings.`);
  }
  console.log(`taste-mobile capture

  node capture.mjs init [--dir .]                 write .taste-mobile/screens.json to edit
  node capture.mjs devices                        list booted iOS simulators
  node capture.mjs run --udid <udid> [--dir .]    light, dark and largest-text screenshots of every screen
        [--passes light,dark,large] [--keep-status-bar] [--android [--serial <id>]]
  node capture.mjs motion on|off --udid <udid>    toggle Reduce Motion on a simulator
  node capture.mjs check [--dir .]                re-run pixel checks, rebuild the contact sheet`);
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main().catch((e) => {
    console.error(`capture: ${e.message}`);
    process.exit(2);
  });
}
