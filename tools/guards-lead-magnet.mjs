// Claims-Wächter für die Pre-Sell-Texte (FXR-45) — nutzt dieselben Regeln wie
// `guards.mjs`/`guards-rules.mjs` (einzige Quelle, hier nicht verändert), aber auf einer
// eigenen, engeren Dateimenge: die Kapitel-Rohtexte für den Lead-Magnet und das
// Sequenz-Gerüst laufen NICHT über den normalen `src/`-Wächter allein — SEQUENZ.md liegt
// unter `marketing/`, außerhalb von `src/`, und würde sonst nie gemessen.
//
//   node tools/guards-lead-magnet.mjs
//
// Bricht mit Fund-Liste + Exitcode 1 ab, genau wie `guards.mjs`.
import { readdirSync, readFileSync, statSync, existsSync } from 'node:fs';
import { join, relative, extname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { ALL_RULES } from './guards-rules.mjs';

const root = join(fileURLToPath(new URL('.', import.meta.url)), '..');

const TARGETS = [
  { dir: join(root, 'src', 'content', 'lead-magnet'), exts: new Set(['.md']) },
  { dir: join(root, 'marketing'), file: 'SEQUENZ.md' },
];

function* walk(dir, exts) {
  if (!existsSync(dir)) return;
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) {
      yield* walk(p, exts);
    } else if (exts.has(extname(name))) {
      yield p;
    }
  }
}

const files = [];
for (const t of TARGETS) {
  if (t.file) {
    const p = join(t.dir, t.file);
    if (existsSync(p)) files.push(p);
  } else {
    for (const f of walk(t.dir, t.exts)) files.push(f);
  }
}

if (files.length === 0) {
  console.error(
    'WÄCHTER ABGEBROCHEN: keine Datei gefunden unter src/content/lead-magnet/ oder ' +
      'marketing/SEQUENZ.md — nichts zu prüfen wäre ein stilles Grün.'
  );
  process.exit(1);
}

const findings = [];
for (const file of files) {
  const rel = relative(root, file);
  const lines = readFileSync(file, 'utf8').split(/\r?\n/);
  lines.forEach((line, i) => {
    for (const rule of ALL_RULES) {
      if (rule.re.test(line)) {
        findings.push(`${rel}:${i + 1} — [${rule.id}] ${rule.why}\n    ${line.trim().slice(0, 160)}`);
      }
    }
  });
}

if (findings.length) {
  console.error(`WÄCHTER ROT in den Pre-Sell-Texten — ${findings.length} Fund(e):\n`);
  for (const f of findings) console.error('  ' + f + '\n');
  process.exit(1);
}
console.log(`Wächter grün: ${ALL_RULES.length} Regeln über ${files.length} Datei(en) (Lead-Magnet + Sequenz).`);
