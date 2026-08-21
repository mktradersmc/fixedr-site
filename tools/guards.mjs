// Leitplanken-Wächter (WP-AC26, Leitplanken 3+4) — läuft VOR jedem Build (npm run build).
// BREIT geschnitten (design-guard-Lehre: ein zu enger Wächter ist gefährlicher als keiner):
// lieber ein falscher Alarm, den ein Mensch freigibt, als ein stilles Loch.
// Es gibt ABSICHTLICH keinen Inline-Disable-Mechanismus.
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative, extname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(fileURLToPath(new URL('.', import.meta.url)), '..');
const SCAN_DIRS = ['src'];
const EXTS = new Set(['.astro', '.md', '.mdx', '.ts', '.mjs', '.css', '.html', '.json']);

/** Claims-Verbotsliste: Rendite-/Erfolgsversprechen, Geldbeträge, Preise, erfundene Zahlen. */
const CLAIM_RULES = [
  { re: /\$\s?\d/, why: 'Dollarbetrag (keine Geldbeträge, nirgends)' },
  { re: /€/, why: 'Eurozeichen (keine Geldbeträge, EN-Site)' },
  { re: /\d\s?(eur|usd|gbp|chf)\b/i, why: 'Währungsbetrag' },
  { re: /guarantee/i, why: '„guarantee" (kein Erfolgs-/Renditeversprechen)' },
  { re: /\bpass (your|the) (challenge|evaluation|eval)\b/i, why: '„pass your challenge"-Versprechen' },
  { re: /\b(39|49)\s?(\$|€|usd|eur|\/\s?mo|per month|a month|monthly)/i, why: 'Preisnennung (E-C009 offen — Website nennt KEINE Preise)' },
  { re: /\b\d{3,}[\d,.]*\+?\s?(traders|users|customers|members)\b/i, why: 'Nutzerzahlen-Behauptung' },
  { re: /\btestimonial/i, why: 'Testimonial (keine — es gibt noch keine Nutzer)' },
  { re: /\b(risk[- ]free|get funded faster|double your|triple your|profit guarantee)\b/i, why: 'Erfolgsversprechen' },
  { re: /\b\d+\s?%\s?(return|profit|gain|win rate|winrate)\b/i, why: 'Rendite-/Winrate-Zahl' },
];

/** Markenkonsistenz: Schreibweise exakt „FixedR"; Kleinschreibung nur in Domains/Pfaden/Idents. */
const BRAND_RULES = [
  { re: /\b(Fixedr|fixedR|FIXEDR|Fixed-R)\b/, why: 'Falschschreibung der Marke (exakt: FixedR)' },
  { re: /(?<![.\/@\w-])fixedr(?![.\w-])/, why: 'Marke kleingeschrieben im Fließtext (exakt: FixedR)' },
];

function* walk(dir) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) {
      if (name === 'node_modules' || name === 'dist') continue;
      yield* walk(p);
    } else if (EXTS.has(extname(name))) {
      yield p;
    }
  }
}

const findings = [];
for (const dir of SCAN_DIRS) {
  for (const file of walk(join(root, dir))) {
    const rel = relative(root, file);
    const lines = readFileSync(file, 'utf8').split(/\r?\n/);
    lines.forEach((line, i) => {
      for (const rule of [...CLAIM_RULES, ...BRAND_RULES]) {
        if (rule.re.test(line)) {
          findings.push(`${rel}:${i + 1} — ${rule.why}\n    ${line.trim().slice(0, 140)}`);
        }
      }
    });
  }
}

if (findings.length) {
  console.error(`WÄCHTER ROT — ${findings.length} Fund(e):\n`);
  for (const f of findings) console.error('  ' + f + '\n');
  process.exit(1);
}
console.log('Wächter grün: keine Claims-/Marken-Verstöße in src/.');
