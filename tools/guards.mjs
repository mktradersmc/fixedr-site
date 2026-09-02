// Leitplanken-Wächter (WP-AC26 / FXR-26, Leitplanken 3+4) — Regeln in guards-rules.mjs.
//
// ZWEI Durchgänge, weil eine Quelldatei nicht belegt, was ausgeliefert wird:
//   node tools/guards.mjs          → misst src/   (läuft VOR dem Bau, bricht früh ab)
//   node tools/guards.mjs --dist   → misst dist/  (läuft NACH dem Bau, misst das Ergebnis)
//
// Der dist-Durchgang bricht ab, wenn der Bau älter ist als die neueste Quelldatei.
// Grund: ein Prüfstand, der einen veralteten Stand misst, meldet Grün über etwas, das
// gar nicht mehr existiert. Lieber gar keine Messung als eine Messung am falschen
// Artefakt.
import { readdirSync, readFileSync, statSync, existsSync } from 'node:fs';
import { join, relative, extname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { ALL_RULES } from './guards-rules.mjs';

const root = join(fileURLToPath(new URL('.', import.meta.url)), '..');
const distMode = process.argv.includes('--dist');

const SRC_EXTS = new Set(['.astro', '.md', '.mdx', '.ts', '.mjs', '.css', '.html', '.json']);
const DIST_EXTS = new Set(['.html']);

function* walk(dir, exts) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) {
      if (name === 'node_modules' || name === 'dist' || name === '_astro') continue;
      yield* walk(p, exts);
    } else if (exts.has(extname(name))) {
      yield p;
    }
  }
}

const neuesteAenderung = (dir, exts) => {
  let max = 0;
  for (const f of walk(dir, exts)) max = Math.max(max, statSync(f).mtimeMs);
  return max;
};

let scanDir;
let exts;
if (distMode) {
  scanDir = join(root, 'dist');
  exts = DIST_EXTS;
  if (!existsSync(scanDir)) {
    console.error('WÄCHTER ABGEBROCHEN: dist/ fehlt — erst bauen, dann messen.');
    process.exit(1);
  }
  // Frische-Prüfung: bricht ab, statt einen alten Bau zu messen.
  const srcStand = neuesteAenderung(join(root, 'src'), SRC_EXTS);
  const distStand = neuesteAenderung(scanDir, DIST_EXTS);
  if (distStand < srcStand) {
    console.error(
      'WÄCHTER ABGEBROCHEN: dist/ ist älter als src/ — der Bau ist veraltet.\n' +
        `  src/  zuletzt geändert: ${new Date(srcStand).toISOString()}\n` +
        `  dist/ zuletzt gebaut:   ${new Date(distStand).toISOString()}\n` +
        '  Erst bauen, dann erneut messen. Ein Grün auf einem alten Bau wäre gelogen.'
    );
    process.exit(1);
  }
} else {
  scanDir = join(root, 'src');
  exts = SRC_EXTS;
}

const findings = [];
let dateien = 0;
for (const file of walk(scanDir, exts)) {
  dateien++;
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

// ── E-C216 (2026-09-02): kein Produktivdeploy — JEDE ausgelieferte Seite muss
// noindex,nofollow tragen. Nur im dist-Durchgang prüfbar: die Quelle setzt es einmal
// in Base.astro, hier wird gemessen, was wirklich im HTML ankommt (jede Seite einzeln,
// falls eine Seite Base.astro je umgeht). Kein trips/passes-Paar wie bei ALL_RULES —
// das ist eine Anwesenheits-, keine Verbotsregel; der rote Fall ist eine dist-Datei
// ohne die Zeile, der grüne ist der aktuelle Bau selbst (Positivprobe unten).
let noindexGeprueft = 0;
if (distMode) {
  const NOINDEX_RE = /<meta\s+name="robots"\s+content="[^"]*noindex[^"]*nofollow[^"]*"/i;
  for (const file of walk(scanDir, exts)) {
    noindexGeprueft++;
    const rel = relative(root, file);
    const html = readFileSync(file, 'utf8');
    if (!NOINDEX_RE.test(html)) {
      findings.push(
        `${rel} — [noindex-fehlt] Seite ohne <meta name="robots" content="noindex,nofollow"> ` +
          `im gebauten HTML (E-C216: kein Produktivdeploy, jede Seite muss uncrawlbar sein).`
      );
    }
  }
  if (noindexGeprueft === 0) {
    findings.push('[noindex-fehlt] dist/ enthält keine .html-Datei — Prüfung konnte nichts messen.');
  }
}

const wo = distMode ? 'dist/ (ausgeliefertes HTML)' : 'src/ (Quellen)';
if (findings.length) {
  console.error(`WÄCHTER ROT in ${wo} — ${findings.length} Fund(e):\n`);
  for (const f of findings) console.error('  ' + f + '\n');
  process.exit(1);
}
const noindexSatz = distMode ? ` + noindex-Anwesenheit über ${noindexGeprueft} Seite(n)` : '';
console.log(`Wächter grün: ${ALL_RULES.length} Regeln über ${dateien} Datei(en) in ${wo}${noindexSatz}.`);
