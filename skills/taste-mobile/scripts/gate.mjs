#!/usr/bin/env node
// taste-mobile gate. Zero dependencies, Node 18+.
//
// The last step of a run. It checks that the written commitments exist, that the code
// lints, that every screen was captured and looked at, and that the critique was written
// after the latest screenshots. It prints one verdict:
//
//   GATE: PASS   everything that can be checked was checked, and nothing failed
//   GATE: FAIL   something failed; fix it and run the gate again (three rounds at most)
//   GATE: OPEN   nothing failed, but something could not be checked; report what
//
//   node gate.mjs [--dir .] [--json] [--no-count]

import { readFileSync, writeFileSync, existsSync, statSync, mkdirSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { lint } from './lint.mjs';

export const MAX_ROUNDS = 3;

const section = (md, title) => {
  const re = new RegExp(`^## ${title}\\s*\\n([\\s\\S]*?)(?=^## )`, 'm');
  const m = re.exec(md + '\n## ');
  return m ? m[1].trim() : null;
};

function checkDesign(dir, deal) {
  const out = [];
  const p = join(dir, 'MOBILE-DESIGN.md');
  if (!existsSync(p)) {
    out.push({ level: 'FAIL', id: 'G02', message: 'MOBILE-DESIGN.md is missing. Deal again, or restore it.' });
    return { out, modes: ['light', 'dark'] };
  }
  const md = readFileSync(p, 'utf8');
  const todos = md.split('\n').map((l, i) => (/\bTODO\b/.test(l) && !/Replace every TODO|while a TODO remains/.test(l) ? i + 1 : 0)).filter(Boolean);
  if (todos.length) {
    out.push({ level: 'FAIL', id: 'G03', message: `MOBILE-DESIGN.md still has ${todos.length} TODO${todos.length > 1 ? 's' : ''} (lines ${todos.slice(0, 8).join(', ')}${todos.length > 8 ? ', ...' : ''}).` });
  }
  const id = /^- id:\s*(\S+)/m.exec(md)?.[1];
  if (deal && id !== deal.picked) {
    out.push({ level: 'FAIL', id: 'G04', message: `MOBILE-DESIGN.md names direction "${id ?? 'none'}" but the deal picked "${deal.picked}". Use deal.mjs take to switch hands.` });
  }
  const metaphor = section(md, 'Governing metaphor') ?? '';
  if (!/In this app,\s+\S.*\s+becomes\s+\S/i.test(metaphor)) {
    out.push({ level: 'FAIL', id: 'G05', message: 'The governing metaphor must read: "In this app, [domain object] becomes [real-world analogy]."' });
  }
  const rule = /^- My rule for this app:\s*(.+)$/m.exec(md)?.[1]?.trim() ?? '';
  if (!/^(Never|Only)\b/.test(rule)) {
    out.push({ level: 'FAIL', id: 'G06', message: 'The restraint rule must be one sentence that starts with Never or Only.' });
  }
  const heroes = section(md, 'Hero moments') ?? '';
  const count = (heroes.match(/^\d+\.\s/gm) || []).length;
  if (deal && count > deal.hero_moment_budget) {
    out.push({ level: 'FAIL', id: 'G07', message: `${count} hero moments declared; the budget for this kind is ${deal.hero_moment_budget}.` });
  }
  if (count === 0) out.push({ level: 'FAIL', id: 'G07', message: 'No hero moment declared. Name at least one.' });
  const screens = (section(md, 'Screens') ?? '').split('\n').filter((l) => /^\|/.test(l) && !/^\|\s*(Screen|-+)/.test(l) && !/^\|\s*-/.test(l));
  if (!screens.length) out.push({ level: 'FAIL', id: 'G08', message: 'The Screens table is empty.' });
  const notDoing = (section(md, 'Not doing') ?? '').split('\n').filter((l) => /^-\s+\S/.test(l));
  if (notDoing.length < 3) out.push({ level: 'FAIL', id: 'G09', message: 'Not doing must list three things this design refuses.' });

  const supported = /^- Supported:\s*(.+)$/m.exec(md)?.[1]?.toLowerCase() ?? '';
  let modes = ['light', 'dark'];
  if (/dark only/.test(supported)) modes = ['dark'];
  else if (/light only/.test(supported)) modes = ['light'];
  return { out, modes, screens: screens.length };
}

function checkCapture(dir, modes) {
  const out = [];
  const state = join(dir, '.taste-mobile');
  const idxPath = join(state, 'shots', 'index.json');
  if (!existsSync(idxPath)) {
    out.push({ level: 'OPEN', id: 'G20', message: 'No screenshots. Run capture.mjs on a simulator, or report that the screens were not seen running.' });
    return { out, index: null };
  }
  let index;
  try {
    index = JSON.parse(readFileSync(idxPath, 'utf8'));
  } catch {
    out.push({ level: 'FAIL', id: 'G20', message: 'shots/index.json is not valid JSON. Capture again.' });
    return { out, index: null };
  }
  const screens = [...new Set(index.shots.map((s) => s.screen))];
  const want = [...modes, 'large'];
  const have = (screen, pass) => index.shots.some((s) => s.screen === screen && s.pass === pass && !s.missing && !s.error);
  const single = modes.length === 1;
  for (const sc of screens) {
    for (const p of want) {
      // A single-mode app is captured in whichever appearance the simulator had; light or dark both count.
      const ok = single && p !== 'large' ? have(sc, 'light') || have(sc, 'dark') : have(sc, p);
      if (!ok) out.push({ level: 'FAIL', id: 'G21', message: `Screen "${sc}" has no ${p === 'large' ? 'largest-text' : p} screenshot.` });
    }
  }
  const screensCfg = join(state, 'screens.json');
  if (existsSync(screensCfg)) {
    try {
      const cfg = JSON.parse(readFileSync(screensCfg, 'utf8'));
      for (const s of cfg.screens ?? []) if (!screens.includes(s.name)) out.push({ level: 'FAIL', id: 'G21', message: `Screen "${s.name}" is in screens.json but was never captured.` });
    } catch {
      /* capture.mjs reports a bad screens.json */
    }
  }
  for (const c of index.checks ?? []) {
    if (single && c.id === 'C01') continue;
    out.push({ level: c.severity === 'FAIL' ? 'FAIL' : 'WARN', id: c.id, message: `${c.screen} (${c.pass}): ${c.message}` });
  }
  if (index.platform === 'android' || index.verified_driver === false) {
    out.push({ level: 'OPEN', id: 'G23', message: 'Captured through the Android driver, which is best effort. Confirm each screenshot by eye and say so in the report.' });
  }
  return { out, index, idxPath };
}

function checkCritique(dir, index, idxPath) {
  const out = [];
  const p = join(dir, '.taste-mobile', 'critique.md');
  if (!index) return out;
  if (!existsSync(p)) {
    out.push({ level: 'FAIL', id: 'G30', message: 'critique.md is missing. Capture writes it; fill it in after looking at every screenshot.' });
    return out;
  }
  const md = readFileSync(p, 'utf8');
  const todos = (md.match(/^\s*(-|\d+\.)\s+TODO\b/gm) || []).length;
  if (todos) out.push({ level: 'FAIL', id: 'G31', message: `critique.md has ${todos} unanswered item${todos > 1 ? 's' : ''}.` });
  else if (statSync(p).mtimeMs < statSync(idxPath).mtimeMs) {
    out.push({ level: 'FAIL', id: 'G32', message: 'critique.md is older than the latest screenshots. Critique the new capture.' });
  }
  return out;
}

/** @param {{dir?:string, count?:boolean}} opts */
export function gate(opts = {}) {
  const dir = resolve(opts.dir ?? '.');
  const state = join(dir, '.taste-mobile');
  const items = [];

  let deal = null;
  const dealPath = join(state, 'deal.json');
  if (!existsSync(dealPath)) items.push({ level: 'FAIL', id: 'G01', message: 'No deal. Run deal.mjs before designing anything.' });
  else {
    try {
      deal = JSON.parse(readFileSync(dealPath, 'utf8'));
      if (!deal.picked) items.push({ level: 'FAIL', id: 'G01', message: 'The deal has no picked direction.' });
    } catch {
      items.push({ level: 'FAIL', id: 'G01', message: 'deal.json is not valid JSON. Deal again.' });
    }
  }

  const design = checkDesign(dir, deal);
  items.push(...design.out);

  const linted = lint({ dir });
  if (!linted.files) items.push({ level: 'OPEN', id: 'G10', message: 'Lint found no source files. Nothing was built here, or --dir points at the wrong folder.' });
  for (const f of linted.findings) {
    if (f.waived) continue;
    const where = f.line > 0 ? `${f.file}:${f.line}` : f.file;
    items.push({ level: f.severity, id: f.rule, message: `${where}  ${f.message}` });
  }
  for (const w of linted.invalidWaivers) items.push({ level: 'FAIL', id: 'G11', message: `Waiver for ${w.rule ?? '?'} has no usable reason.` });

  const cap = checkCapture(dir, design.modes);
  items.push(...cap.out);
  items.push(...checkCritique(dir, cap.index, cap.idxPath));

  if (deal && deal.platform !== 'ios' && cap.index?.platform === 'ios') {
    items.push({ level: 'OPEN', id: 'G24', message: `The platform is "${deal.platform}" but only iOS was captured. Android was not seen running.` });
  }
  if (deal && deal.platform !== 'android' && cap.index?.platform === 'android') {
    items.push({ level: 'OPEN', id: 'G24', message: `The platform is "${deal.platform}" but only Android was captured. iOS was not seen running.` });
  }
  if (cap.index) items.push({ level: 'OPEN', id: 'G25', message: 'Motion, haptics and sound cannot be judged from stills. Report how they were checked, or that they were not.' });
  if (cap.index && !(cap.index.trees ?? []).length) {
    items.push({ level: 'OPEN', id: 'G26', message: 'No accessibility trees were captured (idb is not installed), so target sizes and labels were not checked by script.' });
  }

  const fails = items.filter((i) => i.level === 'FAIL');
  const opens = items.filter((i) => i.level === 'OPEN');
  // These two never hold the gate open on their own: the first is always true, the second depends on
  // an optional tool. Both are always printed, and both belong in the report.
  const blockingOpens = opens.filter((i) => i.id !== 'G25' && i.id !== 'G26');
  const verdict = fails.length ? 'FAIL' : blockingOpens.length ? 'OPEN' : 'PASS';

  let round = 0;
  const roundPath = join(state, 'gate.json');
  if (existsSync(roundPath)) {
    try {
      round = JSON.parse(readFileSync(roundPath, 'utf8')).round ?? 0;
    } catch {
      round = 0;
    }
  }
  if (opts.count !== false) {
    round += 1;
    mkdirSync(state, { recursive: true });
    writeFileSync(roundPath, JSON.stringify({ round, verdict, at: new Date().toISOString() }, null, 2) + '\n');
  }

  return {
    dir, verdict, round, max_rounds: MAX_ROUNDS, stop: verdict === 'FAIL' && round >= MAX_ROUNDS,
    direction: deal?.picked ?? null, kind: deal?.kind ?? null,
    summary: { fail: fails.length, open: opens.length, warn: items.filter((i) => i.level === 'WARN').length, lint_waived: linted.summary.waived },
    items,
  };
}

function print(r) {
  console.log(`taste-mobile gate  round ${r.round} of ${r.max_rounds}  direction ${r.direction ?? 'none'}  kind ${r.kind ?? 'unknown'}`);
  for (const level of ['FAIL', 'OPEN', 'WARN']) {
    const list = r.items.filter((i) => i.level === level);
    if (!list.length) continue;
    console.log(`\n${level}`);
    for (const i of list) console.log(`  ${i.id.padEnd(4)} ${i.message}`);
  }
  console.log(`\nGATE: ${r.verdict}  ${r.summary.fail} fail, ${r.summary.open} open, ${r.summary.warn} warn, ${r.summary.lint_waived} waived`);
  if (r.verdict === 'PASS') console.log('Report the open and warn items above with the result. A pass covers what a script and stills can check.');
  if (r.verdict === 'OPEN') console.log('Nothing failed, but something was not checked. Say exactly what in the report. Do not call it verified.');
  if (r.verdict === 'FAIL' && !r.stop) console.log(`Fix the FAIL items and run the gate again. ${r.max_rounds - r.round} round${r.max_rounds - r.round === 1 ? '' : 's'} left.`);
  if (r.stop) console.log('Three rounds used. Stop fixing. Report the remaining FAIL items as they are.');
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const argv = process.argv.slice(2);
  const i = argv.indexOf('--dir');
  try {
    const r = gate({ dir: i > -1 ? argv[i + 1] : '.', count: !argv.includes('--no-count') });
    if (argv.includes('--json')) console.log(JSON.stringify(r, null, 2));
    else print(r);
    process.exit(r.verdict === 'FAIL' ? 1 : 0);
  } catch (e) {
    console.error(`gate: ${e.message}`);
    process.exit(2);
  }
}
