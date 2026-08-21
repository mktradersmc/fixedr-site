// Publikations-Gate (Leitplanke 2 / Gate G4): verweigert den Deploy, solange
// Impressum/Datenschutz Platzhalter sind. JEDER Deploy-Weg muss `npm run deploy-check`
// vorschalten. Der Marker verschwindet nur, indem die echten Seiten den Platzhalter ersetzen.
import { readdirSync, readFileSync, statSync, existsSync } from 'node:fs';
import { join, relative, extname } from 'node:path';
import { fileURLToPath } from 'node:url';

const MARKER = 'WPAC26-PLACEHOLDER-DO-NOT-PUBLISH';
const root = join(fileURLToPath(new URL('.', import.meta.url)), '..');
const dist = join(root, 'dist');
if (!existsSync(dist)) {
  console.error('deploy-gate: dist/ fehlt — erst bauen.');
  process.exit(1);
}

function* walk(dir) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) yield* walk(p);
    else if (extname(name) === '.html') yield p;
  }
}

const hits = [];
for (const file of walk(dist)) {
  if (readFileSync(file, 'utf8').includes(MARKER)) hits.push(relative(dist, file));
}

if (hits.length) {
  console.error('DEPLOY VERWEIGERT — Platzhalter-Seiten im Build:');
  for (const h of hits) console.error('  ' + h);
  console.error('\nPublikations-Gate G4: Impressum (Michael-Adress-Entscheid) und finale');
  console.error('Datenschutzerklärung müssen die Platzhalter ersetzen. Kein DNS-Cutover vorher.');
  process.exit(1);
}
console.log('deploy-gate grün: keine Platzhalter — Publikation freigegeben (G4-Go von Michael bleibt Voraussetzung).');
