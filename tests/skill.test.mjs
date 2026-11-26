// Run: node --test tests/
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync, existsSync, mkdtempSync, writeFileSync, mkdirSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const SKILL = join(ROOT, 'skills', 'taste-mobile');
const FIX = join(ROOT, 'tests', 'fixtures');

process.env.TASTE_MOBILE_HOME = mkdtempSync(join(tmpdir(), 'taste-mobile-home-'));

const { deal, loadData, VERSION } = await import(join(SKILL, 'scripts', 'deal.mjs'));
const { lint, RULES } = await import(join(SKILL, 'scripts', 'lint.mjs'));
const { gate } = await import(join(SKILL, 'scripts', 'gate.mjs'));
const { pixelChecks, treeChecks, CRITIQUE_PASSES } = await import(join(SKILL, 'scripts', 'capture.mjs'));

const ids = (r) => new Set(r.findings.filter((f) => !f.waived).map((f) => f.rule));
const base = { audience: 'general', platform: 'ios', stack: 'swiftui', recent: [] };

test('SKILL.md has valid frontmatter and every reference it names exists', () => {
  const md = readFileSync(join(SKILL, 'SKILL.md'), 'utf8');
  const fm = md.match(/^---\n([\s\S]*?)\n---\n/);
  assert.ok(fm, 'frontmatter block');
  const name = fm[1].match(/^name:\s*(.+)$/m)?.[1].trim();
  const description = fm[1].match(/^description:\s*(.+)$/m)?.[1].trim();
  assert.equal(name, 'taste-mobile');
  assert.ok(description.length > 40 && description.length <= 1024, 'description length');
  for (const [, ref] of md.matchAll(/`(references\/[a-z0-9/-]+\.md)`/g)) {
    assert.ok(existsSync(join(SKILL, ref)), `${ref} exists`);
  }
  for (const [, script] of md.matchAll(/scripts\/([a-z]+\.mjs)/g)) {
    assert.ok(existsSync(join(SKILL, 'scripts', script)), `scripts/${script} exists`);
  }
});

test('plugin manifests agree with the skill version', () => {
  const market = JSON.parse(readFileSync(join(ROOT, '.claude-plugin', 'marketplace.json'), 'utf8'));
  const codex = JSON.parse(readFileSync(join(ROOT, '.codex-plugin', 'plugin.json'), 'utf8'));
  assert.equal(market.plugins[0].version, VERSION);
  assert.equal(codex.version, VERSION);
  assert.ok(existsSync(join(ROOT, market.plugins[0].skills[0], 'SKILL.md')));
});

test('data is consistent: every kind deals ready directions and names real modules', () => {
  const data = loadData();
  const ready = new Set(data.directions.filter((d) => d.status === 'ready').map((d) => d.id));
  assert.equal(ready.size, 16);
  const kinds = (data.router ?? data.kinds).kinds;
  assert.equal(Object.keys(kinds).length, 14);
  for (const [kind, k] of Object.entries(kinds)) {
    for (const id of k.directions) assert.ok(ready.has(id), `${kind}: ${id} is ready`);
    for (const m of k.modules ?? []) assert.ok(existsSync(join(SKILL, 'references', 'modules', `${m}.md`)), `${kind}: module ${m}`);
  }
});

test('the dealer is deterministic for a seed and deals three distinct ready hands', () => {
  const a = deal({ ...base, kind: 'money', seed: 7 });
  const b = deal({ ...base, kind: 'money', seed: 7 });
  assert.deepEqual(a, b);
  assert.equal(a.hands.length, 3);
  assert.equal(new Set(a.hands.map((h) => h.id)).size, 3);
  assert.equal(a.picked, a.hands[0].id);
  assert.deepEqual(a.modules, ['money']);
});

test('different seeds reach more than one direction', () => {
  const seen = new Set();
  for (let s = 1; s <= 24; s++) seen.add(deal({ ...base, kind: 'utility', seed: s }).picked);
  assert.ok(seen.size >= 3, `only ${[...seen]}`);
});

test('--direction puts a ready direction in hand 1 and refuses others', () => {
  const d = deal({ ...base, kind: 'money', seed: 3, direction: 'ambient-sky' });
  assert.equal(d.picked, 'ambient-sky');
  assert.equal(d.hands.length, 3);
  assert.throws(() => deal({ ...base, kind: 'money', seed: 3, direction: 'cinematic-dark-data' }));
  assert.throws(() => deal({ ...base, kind: 'nope', seed: 3 }));
});

test('lint: the clean fixture passes', () => {
  const r = lint({ dir: join(FIX, 'clean-swift'), platform: 'ios' });
  assert.equal(r.summary.fail, 0);
  assert.equal(r.summary.warn, 0);
});

test('lint: the bad fixtures raise the expected rules', () => {
  const swift = ids(lint({ dir: join(FIX, 'bad-swift'), platform: 'ios' }));
  for (const id of ['P01', 'M10']) assert.ok(swift.has(id), `bad-swift ${id}: ${[...swift]}`);
  const rn = ids(lint({ dir: join(FIX, 'bad-rn'), kind: 'money', platform: 'both' }));
  for (const id of ['M01', 'A01', 'F01', 'T05']) assert.ok(rn.has(id), `bad-rn ${id}: ${[...rn]}`);
  const kt = ids(lint({ dir: join(FIX, 'bad-kotlin'), platform: 'android' }));
  for (const id of ['H04', 'M06']) assert.ok(kt.has(id), `bad-kotlin ${id}: ${[...kt]}`);
});

test('lint: a waiver needs a reason', () => {
  const r = lint({ dir: join(FIX, 'waived') });
  assert.equal(r.summary.waived, 2);
  assert.equal(r.invalidWaivers.length, 1);
});

test('lint: every rule has an id, a severity, a message and an instead', () => {
  assert.ok(RULES.length >= 30);
  for (const r of RULES) {
    assert.match(r.id, /^[A-Z]\d\d$/);
    assert.ok(['FAIL', 'WARN'].includes(r.severity));
    assert.ok(r.message && r.instead, r.id);
  }
});

test('gate: an empty project fails, and says why', () => {
  const dir = mkdtempSync(join(tmpdir(), 'taste-mobile-gate-'));
  const r = gate({ dir, count: false });
  assert.equal(r.verdict, 'FAIL');
  assert.ok(r.items.some((i) => i.id === 'G01'));
});

test('gate: a dealt project with an untouched design file fails on the TODOs', () => {
  const dir = mkdtempSync(join(tmpdir(), 'taste-mobile-gate-'));
  execFileSync('node', [join(SKILL, 'scripts', 'deal.mjs'), 'deal', '--kind', 'utility', '--platform', 'ios', '--stack', 'swiftui', '--seed', '5', '--dir', dir], { stdio: 'pipe' });
  assert.ok(existsSync(join(dir, 'MOBILE-DESIGN.md')));
  const r = gate({ dir, count: false });
  assert.equal(r.verdict, 'FAIL');
  assert.ok(r.items.some((i) => i.id === 'G03'));
});

test('capture: pixel checks flag a flat screenshot and a dark pass that equals light', () => {
  const flat = new Array(24 * 52).fill(0.5);
  const textured = Array.from({ length: 24 * 52 }, (_, i) => (i % 7) / 7);
  const c = pixelChecks([
    { screen: 'home', pass: 'light', grid: textured },
    { screen: 'home', pass: 'dark', grid: textured },
    { screen: 'blank', pass: 'light', grid: flat },
  ]).map((x) => x.id);
  assert.ok(c.includes('C03'));
  assert.ok(c.includes('C01'));
});

test('capture: tree checks flag small targets, unlabelled buttons and the open dialog', () => {
  const tree = [
    { type: 'Button', AXLabel: 'Add', enabled: true, frame: { x: 0, y: 0, width: 30, height: 30 } },
    { type: 'Button', AXLabel: '', enabled: true, frame: { x: 0, y: 60, width: 60, height: 60 } },
  ];
  const c = treeChecks('home', tree).map((x) => x.id);
  assert.ok(c.includes('C10'));
  assert.ok(c.includes('C11'));
  assert.equal(CRITIQUE_PASSES.length, 8);
});

test('references: no file is empty and directions.md matches the generator', async () => {
  const dir = join(SKILL, 'references');
  for (const f of [...readdirSync(dir), ...readdirSync(join(dir, 'modules')).map((m) => `modules/${m}`)]) {
    if (!f.endsWith('.md')) continue;
    assert.ok(readFileSync(join(dir, f), 'utf8').length > 1500, `${f} has content`);
  }
  const { render } = await import(join(ROOT, 'tools', 'gen-directions.mjs'));
  assert.equal(readFileSync(join(dir, 'directions.md'), 'utf8'), render());
});
