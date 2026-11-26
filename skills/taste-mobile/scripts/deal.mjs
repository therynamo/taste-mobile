#!/usr/bin/env node
// taste-mobile dealer. Zero dependencies, Node 18+.
//
// The choice of art direction is made here, in code, so it cannot drift back to the
// model's favourite look. A deal is three complete hands. Take the first unless it
// clashes with the brief.
//
//   node deal.mjs kinds
//   node deal.mjs deal --kind money [--audience pro] [--platform ios] [--stack swiftui]
//                      [--seed 42] [--dir .] [--brand "owns #00D64F"] [--json]
//   node deal.mjs take 2 [--dir .]
//   node deal.mjs show glance-board
//   node deal.mjs history

import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { homedir } from 'node:os';
import { randomInt } from 'node:crypto';

const HERE = dirname(fileURLToPath(import.meta.url));
const DATA = join(HERE, '..', 'data');
export const VERSION = '0.1.0';
const RECENT_PENALTY = [0.08, 0.3, 0.6]; // most recent pick first

const readJson = (p) => JSON.parse(readFileSync(p, 'utf8'));

export function loadData() {
  const directions = readJson(join(DATA, 'directions.json'));
  const router = readJson(join(DATA, 'kinds.json'));
  const slots = readJson(join(DATA, 'slots.json'));
  return { directions, router, slots, byId: Object.fromEntries(directions.map((d) => [d.id, d])) };
}

// ---------- seeded randomness ----------

function hashSeed(input) {
  const s = String(input);
  let h = 1779033703 ^ s.length;
  for (let i = 0; i < s.length; i++) {
    h = Math.imul(h ^ s.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }
  h = Math.imul(h ^ (h >>> 16), 2246822507);
  h = Math.imul(h ^ (h >>> 13), 3266489909);
  return (h ^ (h >>> 16)) >>> 0;
}

function mulberry32(a) {
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const pickOne = (list, rng) => list[Math.floor(rng() * list.length)];

function sample(list, n, rng) {
  const pool = [...list];
  const out = [];
  while (pool.length && out.length < n) out.push(pool.splice(Math.floor(rng() * pool.length), 1)[0]);
  return out;
}

function weightedOrder(items, rng) {
  const pool = items.map((x) => ({ ...x }));
  const out = [];
  while (pool.length) {
    const total = pool.reduce((s, x) => s + x.weight, 0);
    let r = rng() * total;
    let i = 0;
    for (; i < pool.length - 1; i++) {
      r -= pool[i].weight;
      if (r <= 0) break;
    }
    out.push(pool.splice(i, 1)[0]);
  }
  return out;
}

// ---------- the deal ----------

const POSTURES = {
  ios: ['native iOS: system bars, sheets, gestures and glass come from the platform'],
  android: ['native Android: Material 3 components, edge-to-edge and predictive back'],
  both: [
    'native per platform: each platform keeps its own bars, sheets and back behaviour',
    'native per platform: each platform keeps its own bars, sheets and back behaviour',
    "unified custom system: one drawn shell on both platforms, declared in MOBILE-DESIGN.md, that never imitates the other platform's material",
  ],
};

const DEPTH = [
  'none',
  'none',
  'none',
  'one depth cue on the governing asset only, dropped under Reduce Motion (text-sourced: stills cannot show it)',
];

const MATERIAL = {
  ios: 'Liquid Glass is chrome only: system tab bar, toolbars and sheets. It is never the identity.',
  android: 'Material 3 surfaces and tonal elevation. No imitation of iOS glass.',
  both: 'Each platform keeps its own material: system glass on iOS chrome, Material 3 surfaces on Android. Where the stack cannot reach the native material, use an honest opaque surface.',
};

/**
 * Pure function: same input, same deal.
 * @param {{kind:string, audience?:string, platform?:string, stack?:string, seed:string|number, recent?:string[], brand?:string, direction?:string}} opts
 */
export function deal(opts, data = loadData()) {
  const { router, slots, byId } = data;
  const kind = router.kinds[opts.kind];
  if (!kind) throw new Error(`Unknown kind "${opts.kind}". Run: node deal.mjs kinds`);
  const audience = opts.audience ?? 'general';
  const bias = router.audiences[audience];
  if (!bias) throw new Error(`Unknown audience "${audience}". Use one of: ${Object.keys(router.audiences).join(', ')}`);
  const platform = opts.platform ?? 'both';
  if (!POSTURES[platform]) throw new Error(`Unknown platform "${platform}". Use ios, android or both.`);

  const rng = mulberry32(hashSeed(opts.seed));
  const recent = opts.recent ?? [];

  const weighted = kind.directions.map((id, i) => {
    if (byId[id]?.status !== 'ready') throw new Error(`kinds.json lists "${id}", which is not a ready direction`);
    let weight = 1 + (kind.directions.length - i) / kind.directions.length;
    if (bias.boost.includes(id)) weight *= 2;
    if (bias.drop.includes(id)) weight *= 0.25;
    const age = recent.indexOf(id);
    if (age > -1 && age < RECENT_PENALTY.length) weight *= RECENT_PENALTY[age];
    return { id, weight };
  });

  let order = weightedOrder(weighted, rng);
  if (opts.direction) {
    // The brief named a direction. It leads; the other two hands are still dealt.
    if (byId[opts.direction]?.status !== 'ready') throw new Error(`"${opts.direction}" is not a ready direction. Run: node deal.mjs directions`);
    order = [{ id: opts.direction }, ...order.filter((o) => o.id !== opts.direction)];
  }

  const hands = order
    .slice(0, 3)
    .map(({ id }) => {
      const d = byId[id];
      const s = slots[id];
      if (!s) throw new Error(`slots.json has no entry for "${id}"`);
      return {
        id,
        name: d.name,
        seen_in: d.exemplars,
        signature: d.signature,
        corpus_warning: d.restraint_rule,
        axes: {
          shell: pickOne(s.shell, rng),
          mode: pickOne(s.modes, rng),
          density: pickOne(s.density, rng),
          composition: pickOne(s.composition, rng),
          depth: pickOne(DEPTH, rng),
          posture: pickOne(POSTURES[platform], rng),
          material: MATERIAL[platform],
        },
        governing_asset: pickOne(s.governing_asset, rng),
        display_treatment: pickOne(s.display_treatment, rng),
        hero_moments: sample(s.hero_moment, kind.hero_moments, rng),
      };
    });

  return {
    version: VERSION,
    seed: String(opts.seed),
    kind: opts.kind,
    kind_label: kind.label,
    audience,
    platform,
    stack: opts.stack ?? 'unspecified',
    brand: opts.brand ?? null,
    requested_direction: opts.direction ?? null,
    picked: hands[0].id,
    hands,
    modules: kind.modules,
    motion_scheme: { id: kind.motion_scheme, rule: router.motion_schemes[kind.motion_scheme] },
    haptic_profile: { id: kind.haptic_profile, rule: router.haptic_profiles[kind.haptic_profile] },
    hero_moment_budget: kind.hero_moments,
    never_deal: kind.anti_references.map((id) => ({ id, name: byId[id].name, why: byId[id].restraint_rule })),
    note: kind.note ?? null,
  };
}

// ---------- files ----------

const stateHome = () => process.env.TASTE_MOBILE_HOME || join(homedir(), '.taste-mobile');
const projectState = (dir) => join(resolve(dir), '.taste-mobile');

function readHistory() {
  const p = join(stateHome(), 'history.json');
  if (!existsSync(p)) return [];
  try {
    const h = readJson(p);
    return Array.isArray(h) ? h : [];
  } catch {
    return [];
  }
}

function writeHistory(h) {
  mkdirSync(stateHome(), { recursive: true });
  writeFileSync(join(stateHome(), 'history.json'), JSON.stringify(h.slice(-60), null, 2) + '\n');
}

export function designTemplate(d) {
  const hand = d.hands.find((h) => h.id === d.picked);
  const heroes = hand.hero_moments
    .map((m, i) => `${i + 1}. ${m}\n   - spring: TODO (a token from references/motion.md)\n   - haptic: TODO (from the mapping in references/haptics-sound.md, or none)\n   - sound: TODO (or none)`)
    .join('\n');
  return `# MOBILE-DESIGN.md

The written commitments for this app. \`deal.mjs\` filled in what was dealt. Replace every TODO
before writing UI code. \`gate.mjs\` reads this file and fails while a TODO remains.

## Brief
- App: TODO (one sentence: what it is and who uses it)
- Kind: ${d.kind} (${d.kind_label})
- Audience: ${d.audience}
- Platform: ${d.platform}
- Stack: ${d.stack}
- Brand assets given: ${d.brand ?? 'none'}

## Direction
- id: ${hand.id}
- name: ${hand.name}
- seed: ${d.seed}
- Why it fits this brief: TODO (one sentence)

## Governing metaphor
In this app, TODO (the domain object) becomes TODO (a real-world analogy).

## Governing asset
- Dealt: ${hand.governing_asset}
- What it is in this app: TODO
- Where it appears: TODO (name at least three surfaces, for example home, detail, widget)

## Display treatment
- Dealt: ${hand.display_treatment}
- The one place it is allowed: TODO
- Body type: the platform face, unless the brief supplies a brand face.

## Restraint rule
- Corpus warning: ${hand.corpus_warning}
- My rule for this app: TODO (one sentence that starts with Never or Only)

## Axes
- Shell: ${hand.axes.shell}
- Mode: ${hand.axes.mode}
- Density: ${hand.axes.density}
- Composition: ${hand.axes.composition}
- Depth: ${hand.axes.depth}
- Posture: ${hand.axes.posture}
- Material: ${hand.axes.material}

## Modes
- Supported: TODO (light and dark | dark only | light only; give the reason if only one)

## Colour roles
| Role | Light | Dark | Used for |
|---|---|---|---|
| TODO | | | |

## Hero moments
Budget: ${d.hero_moment_budget}. Everything else stays calm.
${heroes}

## Motion scheme
- ${d.motion_scheme.id}: ${d.motion_scheme.rule}

## Haptic profile
- ${d.haptic_profile.id}: ${d.haptic_profile.rule}

## Modules
${d.modules.length ? d.modules.map((m) => `- ${m}: read references/modules/${m}.md. A direction cannot override it.`).join('\n') : '- none attached for this kind'}

## Screens
| Screen | Job in one sentence | Deep link or launch argument |
|---|---|---|
| TODO | | |

## Not doing
- TODO (three things this design refuses, one per line)
`;
}

// ---------- output ----------

function printHand(h, n, picked) {
  const tag = h.id === picked ? '  <- take this one unless it clashes with the brief' : '';
  console.log(`\n${n}. ${h.name}  [${h.id}]${tag}`);
  console.log(`   Governing asset    ${h.governing_asset}`);
  console.log(`   Display treatment  ${h.display_treatment}`);
  h.hero_moments.forEach((m, i) => console.log(`   Hero moment ${i + 1}      ${m}`));
  console.log(`   Shell              ${h.axes.shell}`);
  console.log(`   Mode / density     ${h.axes.mode} / ${h.axes.density}`);
  console.log(`   Composition        ${h.axes.composition}`);
  console.log(`   Depth              ${h.axes.depth}`);
  console.log(`   Posture            ${h.axes.posture}`);
  console.log(`   Corpus warning     ${h.corpus_warning}`);
  console.log(`   Seen in            ${h.seen_in.join(', ')} (evidence, not targets: do not copy an app)`);
}

function printDeal(d) {
  console.log(`taste-mobile deal  seed ${d.seed}  kind ${d.kind}  audience ${d.audience}  platform ${d.platform}`);
  d.hands.forEach((h, i) => printHand(h, i + 1, d.picked));
  console.log(`\nFixed for this kind (not dealt, not negotiable)`);
  console.log(`   Modules            ${d.modules.length ? d.modules.map((m) => `references/modules/${m}.md`).join(', ') : 'none'}`);
  console.log(`   Motion scheme      ${d.motion_scheme.id}: ${d.motion_scheme.rule}`);
  console.log(`   Haptic profile     ${d.haptic_profile.id}: ${d.haptic_profile.rule}`);
  console.log(`   Hero moments       at most ${d.hero_moment_budget}`);
  console.log(`   Material           ${d.hands[0].axes.material}`);
  if (d.note) console.log(`   Note               ${d.note}`);
  if (d.never_deal.length) {
    console.log(`\nNever build these for this kind`);
    d.never_deal.forEach((a) => console.log(`   ${a.name}: ${a.why}`));
  }
}

function parseArgs(argv) {
  const out = { _: [] };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a.startsWith('--')) {
      const key = a.slice(2);
      const next = argv[i + 1];
      if (next === undefined || next.startsWith('--')) out[key] = true;
      else out[key] = argv[++i];
    } else out._.push(a);
  }
  return out;
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  const cmd = args._[0] ?? 'help';
  const data = loadData();
  const dir = args.dir && args.dir !== true ? args.dir : '.';

  if (cmd === 'kinds') {
    console.log('Kinds (pick the one that matches what the app is for)\n');
    for (const [id, k] of Object.entries(data.router.kinds)) {
      console.log(`  ${id.padEnd(13)} ${k.label}`);
      console.log(`  ${''.padEnd(13)} directions: ${k.directions.join(', ')}${k.modules.length ? `   modules: ${k.modules.join(', ')}` : ''}`);
    }
    console.log(`\nAudiences: ${Object.keys(data.router.audiences).join(', ')}`);
    return;
  }

  if (cmd === 'show') {
    const d = data.byId[args._[1]];
    if (!d) throw new Error(`No direction "${args._[1]}".`);
    console.log(`${d.name}  [${d.id}]  status: ${d.status}`);
    for (const [k, v] of Object.entries(d.signature)) if (v) console.log(`\n${k}\n  ${v}`);
    console.log(`\nwarning\n  ${d.restraint_rule}`);
    console.log(`\nseen in\n  ${d.exemplars.join(', ') || 'no visual exemplar'}`);
    if (data.slots[d.id]) console.log(`\nslots\n${JSON.stringify(data.slots[d.id], null, 2)}`);
    return;
  }

  if (cmd === 'directions') {
    for (const status of ['ready', 'held', 'anti-reference']) {
      const list = Object.values(data.byId).filter((d) => d.status === status);
      if (!list.length) continue;
      console.log(`\n${status} (${list.length})${status === 'ready' ? '' : status === 'held' ? '  not dealt: the corpus could not show them on screen' : '  never built: named so they can be recognised'}`);
      list.forEach((d) => console.log(`  ${d.id.padEnd(30)} ${d.name}`));
    }
    return;
  }

  if (cmd === 'history') {
    const h = readHistory();
    if (!h.length) return console.log('No deals recorded yet.');
    h.slice(-15).forEach((e) => console.log(`${e.date}  ${e.kind.padEnd(12)} ${e.picked.padEnd(28)} seed ${e.seed}  ${e.project}`));
    return;
  }

  if (cmd === 'deal') {
    if (!args.kind || args.kind === true) throw new Error('Missing --kind. Run: node deal.mjs kinds');
    const history = readHistory();
    const seed = args.seed && args.seed !== true ? args.seed : randomInt(1, 1_000_000);
    const d = deal(
      {
        kind: args.kind,
        audience: args.audience === true ? undefined : args.audience,
        platform: args.platform === true ? undefined : args.platform,
        stack: args.stack === true ? undefined : args.stack,
        brand: args.brand === true ? undefined : args.brand,
        direction: args.direction === true ? undefined : args.direction,
        seed,
        recent: history.map((e) => e.picked).reverse().slice(0, RECENT_PENALTY.length),
      },
      data,
    );
    const state = projectState(dir);
    mkdirSync(state, { recursive: true });
    writeFileSync(join(state, 'deal.json'), JSON.stringify(d, null, 2) + '\n');
    const designPath = join(resolve(dir), 'MOBILE-DESIGN.md');
    // An existing file is kept once the agent has started filling it in. An untouched template is replaced.
    const untouched = existsSync(designPath) && readFileSync(designPath, 'utf8').includes('- App: TODO (one sentence');
    const wroteDesign = !existsSync(designPath) || untouched || args.force === true;
    if (wroteDesign) writeFileSync(designPath, designTemplate(d));
    history.push({ date: new Date().toISOString().slice(0, 10), project: resolve(dir), kind: d.kind, picked: d.picked, seed: d.seed });
    writeHistory(history);
    if (args.json) return console.log(JSON.stringify(d, null, 2));
    printDeal(d);
    console.log(`\nWrote ${join(state, 'deal.json')}`);
    console.log(wroteDesign ? `Wrote ${designPath} (replace every TODO before writing UI code)` : `Kept the existing ${designPath} (pass --force to rewrite it)`);
    console.log(`To take hand 2 or 3 instead: node ${process.argv[1]} take 2 --dir ${dir}`);
    return;
  }

  if (cmd === 'take') {
    const state = projectState(dir);
    const p = join(state, 'deal.json');
    if (!existsSync(p)) throw new Error(`No deal at ${p}. Deal first.`);
    const d = readJson(p);
    const n = Number(args._[1]);
    const hand = d.hands[n - 1] ?? d.hands.find((h) => h.id === args._[1]);
    if (!hand) throw new Error(`Take 1 to ${d.hands.length}, or a dealt id.`);
    d.picked = hand.id;
    writeFileSync(p, JSON.stringify(d, null, 2) + '\n');
    writeFileSync(join(resolve(dir), 'MOBILE-DESIGN.md'), designTemplate(d));
    const history = readHistory();
    const last = history.at(-1);
    if (last && last.project === resolve(dir) && last.seed === d.seed) last.picked = hand.id;
    writeHistory(history);
    console.log(`Picked ${hand.name} [${hand.id}]. Rewrote MOBILE-DESIGN.md for it.`);
    return;
  }

  console.log(`taste-mobile dealer ${VERSION}

  node deal.mjs kinds                      list app kinds and audiences
  node deal.mjs deal --kind <kind>         deal three hands, write .taste-mobile/deal.json and MOBILE-DESIGN.md
        [--audience general|pro|gentle|playful] [--platform ios|android|both]
        [--stack swiftui|compose|expo] [--seed <any>] [--brand "<owned assets>"] [--dir <project>] [--json]
        [--direction <id>]                 the brief named a direction: it leads, two more are still dealt
        [--force]                          rewrite an existing MOBILE-DESIGN.md
  node deal.mjs take <1|2|3>               switch to another dealt hand
  node deal.mjs directions                 list every direction and its status
  node deal.mjs show <direction-id>        print a direction's full signature
  node deal.mjs history                    recent picks (used to avoid repeats across projects)`);
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    main();
  } catch (e) {
    console.error(`deal: ${e.message}`);
    process.exit(2);
  }
}
