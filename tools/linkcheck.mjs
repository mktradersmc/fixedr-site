// Interner Linkcheck + Fremd-Ressourcen-Wächter (Leitplanke 5) über das GEBAUTE dist/.
// - jeder interne href/src muss auf eine existierende Datei zeigen (0 tote Links, Gate G3)
// - Ressourcen-Loads (script/link/img/source/iframe) dürfen NIE auf fremde Origins zeigen
//   (die Site ist das Aushängeschild von local-first: keine CDNs, keine externen Fonts)
import { readdirSync, readFileSync, statSync, existsSync } from 'node:fs';
import { join, relative, extname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(fileURLToPath(new URL('.', import.meta.url)), '..');
const dist = join(root, 'dist');
if (!existsSync(dist)) {
  console.error('linkcheck: dist/ fehlt — erst bauen.');
  process.exit(1);
}

function* walk(dir) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) yield* walk(p);
    else if (extname(name) === '.html') yield p;
  }
}

const errors = [];
const resTags = /<(script|link|img|source|iframe|video|audio)\b[^>]*?(?:src|href)\s*=\s*"([^"]+)"/gi;
const anchors = /<a\b[^>]*?href\s*=\s*"([^"]+)"/gi;

function checkInternal(url, file) {
  const path = url.split('#')[0].split('?')[0];
  if (!path || path === '/') return;
  // build.format 'file': /manifesto -> manifesto.html; Assets liegen 1:1 in dist
  const clean = path.replace(/^\//, '').replace(/\/$/, '');
  const candidates = [
    join(dist, clean),
    join(dist, `${clean}.html`),
    join(dist, clean, 'index.html'),
  ];
  if (!candidates.some((c) => existsSync(c))) {
    errors.push(`${relative(dist, file)} → toter interner Link: ${url}`);
  }
}

for (const file of walk(dist)) {
  const html = readFileSync(file, 'utf8');
  for (const m of html.matchAll(resTags)) {
    const url = m[2];
    if (url.startsWith('https://fixedr.com/') || url === 'https://fixedr.com') {
      // eigene Origin (canonical/og) — kein Fremd-Load
    } else if (/^(https?:)?\/\//i.test(url)) {
      errors.push(`${relative(dist, file)} → FREMD-RESSOURCE geladen (<${m[1]}>): ${url}`);
    } else if (!url.startsWith('data:')) {
      checkInternal(url, file);
    }
  }
  for (const m of html.matchAll(anchors)) {
    const url = m[1];
    if (/^(https?:)?\/\//i.test(url)) {
      // externe VERWEISE sind erlaubt — aber nur auf fixedr.com ohne Not
      continue;
    }
    if (url.startsWith('mailto:') || url.startsWith('#')) continue;
    checkInternal(url, file);
  }
}

if (errors.length) {
  console.error(`LINKCHECK ROT — ${errors.length} Fund(e):`);
  for (const e of errors) console.error('  ' + e);
  process.exit(1);
}
console.log('Linkcheck grün: 0 tote interne Links, 0 Fremd-Ressourcen in dist/.');
