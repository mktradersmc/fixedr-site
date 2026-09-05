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
//
// --outdir=<name> (optional, nur --dist): misst einen anderen Ordner als `dist/` —
// FXR-142, Runde 13: Michaels `astro preview` hält `dist/downloads/fixedr-guide.pdf`
// unter Windows gesperrt (EPERM beim Überschreiben), solange sein Server auf :4321
// läuft, den diese Regel nicht beenden darf. Eigene Prüfläufe bauen deshalb nach
// `--outDir <ordner>` und messen hier denselben Ordner, ohne `dist/` anzufassen.
import { readdirSync, readFileSync, statSync, existsSync } from 'node:fs';
import { join, relative, extname, basename } from 'node:path';
import { fileURLToPath } from 'node:url';
import { ALL_RULES } from './guards-rules.mjs';

const root = join(fileURLToPath(new URL('.', import.meta.url)), '..');
const distMode = process.argv.includes('--dist');
const outdirArg = process.argv.find((a) => a.startsWith('--outdir='));
const outdirName = outdirArg ? outdirArg.slice('--outdir='.length) : 'dist';

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
  scanDir = join(root, outdirName);
  exts = DIST_EXTS;
  if (!existsSync(scanDir)) {
    console.error(`WÄCHTER ABGEBROCHEN: ${outdirName}/ fehlt — erst bauen, dann messen.`);
    process.exit(1);
  }
  // Frische-Prüfung: bricht ab, statt einen alten Bau zu messen.
  const srcStand = neuesteAenderung(join(root, 'src'), SRC_EXTS);
  const distStand = neuesteAenderung(scanDir, DIST_EXTS);
  if (distStand < srcStand) {
    console.error(
      `WÄCHTER ABGEBROCHEN: ${outdirName}/ ist älter als src/ — der Bau ist veraltet.\n` +
        `  src/  zuletzt geändert: ${new Date(srcStand).toISOString()}\n` +
        `  ${outdirName}/ zuletzt gebaut:   ${new Date(distStand).toISOString()}\n` +
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

// ── G2 (FXR-142, Runde 13, 2026-09-03): jede gebaute Seite außer der Druckseite trägt
// das Kopfband (`header.page-head`) oder einen der beiden Referenz-Heros (`.home-hero`
// auf der Startseite, `.waitlist-hero` auf Warteliste/Danke) — sonst ist die Seite noch
// im alten System. Auch hier eine Anwesenheits-, keine Verbotsregel wie beim noindex-
// Durchgang oben. `features.html` ist ein reiner Redirect-Stub (Meta-Refresh auf
// /product, kein eigener Inhalt) und bleibt deshalb wie die Druckseite ausgenommen.
// Zusätzlich: keine der abgelösten Runde-12-Farbwerte außerhalb von global.css — Liste
// per `git diff` aus dem heutigen global.css gemessen (Rotprobe: guards-rotprobe.mjs).
const RETIRED_COLOR_VALUES = ['#6fa6e6'];
let kopfbandGeprueft = 0;
if (distMode) {
  const HEAD_RE = /class="[^"]*\b(?:page-head|home-hero|waitlist-hero)\b[^"]*"/;
  for (const file of walk(scanDir, exts)) {
    const rel = relative(root, file);
    const fileBasename = basename(file);
    if (fileBasename === 'print.html' || fileBasename === 'features.html') continue;
    kopfbandGeprueft++;
    const html = readFileSync(file, 'utf8');
    if (!HEAD_RE.test(html)) {
      findings.push(
        `${rel} — [kopfband-fehlt] Seite ohne header.page-head/.home-hero/.waitlist-hero ` +
          `im gebauten HTML (G2, FXR-142: jede Seite außer der Druckseite trägt das ` +
          `dunkle Kopfband oder den Hero).`
      );
    }
    for (const farbe of RETIRED_COLOR_VALUES) {
      if (html.includes(farbe)) {
        findings.push(
          `${rel} — [alte-farbe] abgelöster Farbwert ${farbe} aus Runde 12 im gebauten HTML ` +
            `(G2, FXR-142: Farbwerte gehören nur in global.css, hier steht ein Rest des alten Systems).`
        );
      }
    }
  }
  if (kopfbandGeprueft === 0) {
    findings.push('[kopfband-fehlt] dist/ enthält keine prüfbare .html-Datei — Prüfung konnte nichts messen.');
  }
}

// ── FXR-164 (Michael 2026-09-05): Sprachschalter EN|DE fest an Position — die alte
// Fassung tauschte per textContent, welches Glied die aktive Sprache trägt, wodurch
// die gewählte Sprache immer an die erste (linke) Stelle wanderte. Anwesenheits- UND
// Verbotsregel zugleich: jede Seite muss die zwei ortsfesten Marker tragen und darf
// die alten textContent-Tausch-Marker nicht mehr enthalten (Rotprobe: alter Stand,
// `git show HEAD~3:src/layouts/Base.astro`, trug data-lang-active/data-lang-other).
let sprachschalterGeprueft = 0;
if (distMode) {
  for (const file of walk(scanDir, exts)) {
    // print.html geht bewusst OHNE Base.astro (Druckseite ohne Kopfleiste, s. Kommentar
    // dort) — dieselbe Ausnahme wie beim Kopfband-Wächter oben.
    if (basename(file) === 'print.html') continue;
    sprachschalterGeprueft++;
    const rel = relative(root, file);
    const html = readFileSync(file, 'utf8');
    if (!html.includes('data-lang-en') || !html.includes('data-lang-de')) {
      findings.push(
        `${rel} — [sprachschalter-position-fehlt] Seite ohne ortsfeste Sprachglieder ` +
          `data-lang-en/data-lang-de (FXR-164: EN links, DE rechts, fest).`
      );
    }
    if (html.includes('data-lang-active') || html.includes('data-lang-other')) {
      findings.push(
        `${rel} — [sprachschalter-alter-tausch] Seite trägt noch die alten Marker ` +
          `data-lang-active/data-lang-other (FXR-164: das war der textContent-Tausch, ` +
          `der die Reihenfolge EN/DE beim Klick vertauschte).`
      );
    }
  }
  if (sprachschalterGeprueft === 0) {
    findings.push('[sprachschalter-position-fehlt] dist/ enthält keine prüfbare .html-Datei — Prüfung konnte nichts messen.');
  }
}

// ── FXR-164 (Michael 2026-09-05, "das bild in dem frame beim hover vergrößert"): der
// Inhalt der Hero-Bühne muss beim Hover zusätzlich zum Rahmen selbst größer werden —
// gemessen am Prototyp (`temp/export-web-v3/FixedR Web Home.html`, headless gerendert):
// Inhalt skaliert 0,70 in Ruhe auf 0,75 beim Hover, Faktor 15/14 ≈ 1,0714. Geprüft wird
// das gebündelte CSS, nicht eine Quelldatei, weil erst der Bau zeigt, ob die Regel im
// ausgelieferten Bundle ankommt (Rotprobe: alter Stand kannte gar keine
// `.stage-content`-Transform-Regel, nur den Rahmen wuchs).
let buehneCssGeprueft = 0;
if (distMode) {
  const astroDir = join(scanDir, '_astro');
  const cssFiles = existsSync(astroDir) ? readdirSync(astroDir).filter((n) => n.endsWith('.css')) : [];
  /*
   * ⚠️ 2026-09-06 NEU GEFASST, nicht aufgeweicht.
   *
   * Die Regel maß die AUFRUFFORM: exakt `.stage:hover .stage-content{...scale(1.0714)}`.
   * Michael hat gemeldet, dass die Bühne beim Scrollen kalt bleibt — Chrome rechnet
   * `:hover` während des Bildlaufs nicht neu. Der Auslöser ist deshalb um eine Klasse
   * ergänzt (`.stage.is-hover`), die ein Skript setzt, und damit wurde aus dem einzelnen
   * Selektor eine Gruppe. Die alte Zeichenkette traf sie nicht mehr, obwohl die Zusage
   * unverändert galt.
   *
   * Gemessen wird jetzt die Zusage in zwei Teilen: der Inhalt skaliert auf 1.0714, UND es
   * gibt beide Auslöser — `:hover` (auch ohne JavaScript) und die Klasse (auch beim
   * Scrollen). Ein fehlender Auslöser ist ein Fund, nicht bloß eine andere Schreibweise.
   */
  const SCALE_RE = /\.stage-content\s*\{[^}]*transform:\s*scale\(1\.0714\)/;
  const HOVER_TRIGGER_RE = /\.stage:hover\s*\.stage-content/;
  const CLASS_TRIGGER_RE = /\.stage\.is-hover\s*\.stage-content/;
  buehneCssGeprueft = cssFiles.length;
  const lies = (name) => readFileSync(join(astroDir, name), 'utf8');
  const skaliert = cssFiles.some((n) => SCALE_RE.test(lies(n)));
  const hoverAusloeser = cssFiles.some((n) => HOVER_TRIGGER_RE.test(lies(n)));
  const klassenAusloeser = cssFiles.some((n) => CLASS_TRIGGER_RE.test(lies(n)));
  if (cssFiles.length === 0) {
    findings.push('[buehne-inhalt-skaliert-fehlt] dist/_astro/ enthält keine .css-Datei — Prüfung konnte nichts messen.');
  } else if (!skaliert) {
    findings.push(
      `dist/_astro/*.css — [buehne-inhalt-skaliert-fehlt] der Inhalt der Bühne skaliert nicht ` +
        `auf scale(1.0714) (FXR-164: der Bild-Inhalt muss mitwachsen, nicht nur der Rahmen).`
    );
  } else if (!hoverAusloeser) {
    findings.push(
      `dist/_astro/*.css — [buehne-ausloeser-hover-fehlt] die Skalierung hängt nicht mehr an ` +
        `":hover" — ohne JavaScript bliebe die Bühne dann tot.`
    );
  } else if (!klassenAusloeser) {
    findings.push(
      `dist/_astro/*.css — [buehne-ausloeser-klasse-fehlt] die Skalierung hängt nicht an ` +
        `".stage.is-hover" (2026-09-06, Michael: „beim reinscrollen passiert das nicht" — ` +
        `Chrome rechnet :hover während des Bildlaufs nicht neu, deshalb der Klassenzustand).`
    );
  }
}

const wo = distMode ? 'dist/ (ausgeliefertes HTML)' : 'src/ (Quellen)';
if (findings.length) {
  console.error(`WÄCHTER ROT in ${wo} — ${findings.length} Fund(e):\n`);
  for (const f of findings) console.error('  ' + f + '\n');
  process.exit(1);
}
const noindexSatz = distMode ? ` + noindex-Anwesenheit über ${noindexGeprueft} Seite(n)` : '';
const kopfbandSatz = distMode ? ` + Kopfband/Hero-Anwesenheit über ${kopfbandGeprueft} Seite(n)` : '';
const sprachschalterSatz = distMode ? ` + Sprachschalter-Position über ${sprachschalterGeprueft} Seite(n)` : '';
const buehneSatz = distMode ? ` + Bühne-Inhaltsskalierung über ${buehneCssGeprueft} CSS-Datei(en)` : '';
console.log(
  `Wächter grün: ${ALL_RULES.length} Regeln über ${dateien} Datei(en) in ${wo}${noindexSatz}${kopfbandSatz}${sprachschalterSatz}${buehneSatz}.`
);
