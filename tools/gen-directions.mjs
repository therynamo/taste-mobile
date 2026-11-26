#!/usr/bin/env node
// Regenerates skills/taste-mobile/references/directions.md from data/directions.json and
// data/kinds.json. Run it after editing either file: node tools/gen-directions.mjs
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', 'skills', 'taste-mobile');
const directions = JSON.parse(readFileSync(join(ROOT, 'data', 'directions.json'), 'utf8'));
const router = JSON.parse(readFileSync(join(ROOT, 'data', 'kinds.json'), 'utf8'));

const kindsFor = (id) => Object.entries(router.kinds).filter(([, k]) => k.directions.includes(id)).map(([k]) => k);
const clean = (s) => String(s ?? '').replace(/\s+/g, ' ').trim();
const LABEL = { typography: 'Type', color: 'Colour', shape: 'Shape', density: 'Density', navigation: 'Navigation', imagery: 'Imagery', motion_haptics_if_known: 'Motion and haptics' };

export function render() {
  const by = (s) => directions.filter((d) => d.status === s);
  const out = [];
  out.push('# Directions', '');
  out.push('Every direction the corpus produced, with its status. Open it to read a full signature, or to');
  out.push('recognise an anti-reference. The dealer picks for you: do not choose from this file.', '');
  out.push('Generated from `data/directions.json` by `tools/gen-directions.mjs`. Do not edit by hand.', '');
  out.push('- **Ready** directions are dealt. Each was seen on screen in apps from at least two makers.');
  out.push('- **Held** directions are not dealt: store screenshots could not show what defines them.');
  out.push('- **Anti-references** are never built. They are named so you can recognise them.');
  out.push('- **Overlays** are platform materials, applied to chrome whatever is dealt.');
  out.push('- Signatures describe what was visible in store screenshots. Motion and haptics notes are');
  out.push('  text-sourced. The apps listed are evidence, not targets: do not copy one.', '');
  out.push(`## Ready (${by('ready').length})`, '');
  for (const d of by('ready')) {
    out.push(`### ${d.name}`, '');
    out.push(`\`${d.id}\` · dealt for: ${kindsFor(d.id).join(', ') || 'only with --direction'}`, '');
    for (const [k, label] of Object.entries(LABEL)) if (clean(d.signature?.[k])) out.push(`- **${label}.** ${clean(d.signature[k])}`);
    out.push(`- **How it goes wrong.** ${clean(d.restraint_rule)}`);
    out.push(`- **Seen in.** ${d.exemplars.join(', ')}`, '');
  }
  out.push(`## Held (${by('held').length})`, '', '| Direction | What blocks it |', '|---|---|');
  for (const d of by('held')) out.push(`| **${d.name}** \`${d.id}\` | ${clean((d.blocking_captures ?? []).join('; ')) || 'Not enough on-screen evidence'} |`);
  out.push('', `## Anti-references (${by('anti-reference').length})`, '', '| Pattern | Why it is never built |', '|---|---|');
  for (const d of by('anti-reference')) out.push(`| **${d.name}** \`${d.id}\` | ${clean(d.restraint_rule)} |`);
  out.push('', `## Overlays (${by('overlay').length})`, '', '| Overlay | Rule |', '|---|---|');
  for (const d of by('overlay')) out.push(`| **${d.name}** \`${d.id}\` | ${clean(d.restraint_rule)} |`);
  out.push('');
  return out.join('\n');
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const p = join(ROOT, 'references', 'directions.md');
  writeFileSync(p, render());
  console.log(`Wrote ${p}`);
}
