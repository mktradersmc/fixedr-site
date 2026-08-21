// Erzeugt die FixedR-Wortmarken als eigenständige SVGs (Text → Pfad, kein Font nötig)
// plus eine G1-Vorschauseite. Aufruf: node tools/gen-wortmarke.mjs
import * as fontkit from 'fontkit';
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const outDir = join(root, 'branding', 'wortmarke');
mkdirSync(outDir, { recursive: true });

const jbFile = (w) => join(root, 'node_modules', '@fontsource', 'jetbrains-mono', 'files', `jetbrains-mono-latin-${w}-normal.woff2`);
// statische Inter 600 — fontkit liefert für die Variable-Font-Instanz keinen head (woff2-Bug)
const inter600File = join(root, 'node_modules', '@fontsource', 'inter', 'files', 'inter-latin-600-normal.woff2');

const PALETTES = {
  amber: { signal: '#FFB000' },
  cyan: { signal: '#3FC6DC' },
};
const TEXT = '#E6E9F0';

/** Layoutet `text` und liefert je Glyph {d, x} in px plus Gesamtbreite. */
function shape(font, text, size, track = 0) {
  const s = size / font.unitsPerEm;
  const run = font.layout(text);
  let x = 0;
  const glyphs = [];
  run.glyphs.forEach((g, i) => {
    const p = run.positions[i];
    glyphs.push({ d: g.path.toSVG(), x: (x + p.xOffset) * s, y: p.yOffset * s });
    x += p.xAdvance + track * font.unitsPerEm;
  });
  return { glyphs, width: x * s, scale: s };
}

/** Rendert eine Glyphfolge als SVG-Gruppe (y-Achse gespiegelt, da Fontkoordinaten y-up). */
function glyphGroup(shaped, ox, baseline, fill) {
  const paths = shaped.glyphs
    .filter((g) => g.d && g.d.length > 1)
    .map((g) => `<path transform="translate(${(ox + g.x).toFixed(2)} ${(baseline - g.y).toFixed(2)}) scale(${shaped.scale.toFixed(6)} ${-shaped.scale.toFixed(6)})" d="${g.d}"/>`)
    .join('');
  return `<g fill="${fill}">${paths}</g>`;
}

const svg = (w, h, body) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w.toFixed(0)} ${h.toFixed(0)}" width="${w.toFixed(0)}" height="${h.toFixed(0)}">${body}</svg>\n`;

const jb500 = fontkit.openSync(jbFile('500'));
const jb800 = fontkit.openSync(jbFile('800'));
const jb600 = fontkit.openSync(jbFile('600'));
const inter650 = fontkit.openSync(inter600File);

const SIZE = 64;
const H = SIZE * 1.4;
const BASE = SIZE * 1.08;
const CAP = SIZE * 0.72; // Kapitälchenhöhe ~0.72 em (beide Fonts)

/** V1 — Mono, betontes R: „Fixed" (Medium) + „R" (ExtraBold, Signalfarbe). */
function v1(signal) {
  const a = shape(jb500, 'Fixed', SIZE);
  const b = shape(jb800, 'R', SIZE);
  const gap = SIZE * 0.02;
  const w = a.width + gap + b.width + SIZE * 0.12;
  const pad = SIZE * 0.06;
  return svg(w + pad, H,
    glyphGroup(a, pad, BASE, TEXT) +
    glyphGroup(b, pad + a.width + gap, BASE, signal));
}

/** V2 — R als Instrument: „Fixed" + Rundinstrument (Skalenring) mit R im Zentrum. */
function v2(signal) {
  const a = shape(jb500, 'Fixed', SIZE);
  const rDial = SIZE * 0.52;
  const gap = SIZE * 0.18;
  const cx = a.width + gap + rDial + SIZE * 0.06;
  const cy = BASE - CAP / 2;
  const rs = shape(jb800, 'R', SIZE * 0.58);
  const rCap = CAP * 0.58;
  // 12 Skalenstriche, die 4 Hauptstriche länger
  let ticks = '';
  for (let i = 0; i < 12; i++) {
    const ang = (i * 30 * Math.PI) / 180;
    const major = i % 3 === 0;
    const r1 = rDial - (major ? SIZE * 0.13 : SIZE * 0.08);
    ticks += `<line x1="${(cx + r1 * Math.sin(ang)).toFixed(2)}" y1="${(cy - r1 * Math.cos(ang)).toFixed(2)}" x2="${(cx + (rDial - SIZE * 0.03) * Math.sin(ang)).toFixed(2)}" y2="${(cy - (rDial - SIZE * 0.03) * Math.cos(ang)).toFixed(2)}" stroke="${signal}" stroke-width="${(SIZE * (major ? 0.045 : 0.028)).toFixed(2)}" stroke-linecap="round"/>`;
  }
  const w = cx + rDial + SIZE * 0.1;
  return svg(w, H,
    glyphGroup(a, SIZE * 0.06, BASE, TEXT) +
    `<circle cx="${cx.toFixed(2)}" cy="${cy.toFixed(2)}" r="${rDial.toFixed(2)}" fill="none" stroke="${signal}" stroke-width="${(SIZE * 0.05).toFixed(2)}"/>` +
    ticks +
    glyphGroup(rs, cx - rs.width / 2, cy + rCap / 2, signal));
}

/** V3 — reine Typo (Inter, halbfett); Ankerlinie UNTER dem R „fixiert" es (kein Strich durchs Glyph). */
function v3(signal) {
  const a = shape(inter650, 'Fixed', SIZE, -0.012);
  const b = shape(inter650, 'R', SIZE);
  const pad = SIZE * 0.06;
  const rx = pad + a.width + SIZE * 0.01;
  const w = rx + b.width + pad + SIZE * 0.06;
  const yLine = BASE + SIZE * 0.12; // knapp unter der Grundlinie
  return svg(w, H + SIZE * 0.1,
    glyphGroup(a, pad, BASE, TEXT) +
    glyphGroup(b, rx, BASE, TEXT) +
    `<line x1="${(rx - SIZE * 0.03).toFixed(2)}" y1="${yLine.toFixed(2)}" x2="${(rx + b.width + SIZE * 0.03).toFixed(2)}" y2="${yLine.toFixed(2)}" stroke="${signal}" stroke-width="${(SIZE * 0.075).toFixed(2)}" stroke-linecap="round"/>`);
}

const variants = { v1, v2, v3 };
const files = [];
for (const [vName, fn] of Object.entries(variants)) {
  for (const [pName, pal] of Object.entries(PALETTES)) {
    const name = `${vName}-${pName}.svg`;
    writeFileSync(join(outDir, name), fn(pal.signal));
    files.push(name);
  }
}

// G1-Vorschau: alle Varianten × Paletten auf dunklem Grund, je einmal groß + klein (Avatar-Test)
const cell = (f, label) => `
  <figure>
    <div class="stage"><img src="wortmarke/${f}" alt="${label}"></div>
    <div class="stage small"><img src="wortmarke/${f}" height="22" alt=""></div>
    <figcaption>${label}</figcaption>
  </figure>`;
const labels = {
  v1: 'V1 — Mono, betontes R (JetBrains Mono)',
  v2: 'V2 — R als Rundinstrument',
  v3: 'V3 — reine Typo mit Ankerlinie unterm R (Inter)',
};
const sections = Object.keys(PALETTES).map((p) => `
  <h2>Palette „${p === 'amber' ? 'Amber — Avionik-Warnlicht (warm)' : 'Cyan — Glass-Cockpit (kühl)'}"
    <span class="chip" style="background:${PALETTES[p].signal}"></span></h2>
  <div class="row">${Object.keys(variants).map((v) => cell(`${v}-${p}.svg`, labels[v])).join('')}</div>`).join('');

writeFileSync(join(root, 'branding', 'preview.html'), `<!doctype html>
<html lang="de"><head><meta charset="utf-8"><title>FixedR — G1-Vorschau Wortmarke & Palette</title>
<style>
  body{background:#0B0E14;color:#E6E9F0;font-family:Segoe UI,system-ui,sans-serif;margin:2rem auto;max-width:1080px;padding:0 1rem}
  h1{font-weight:600} h2{margin-top:2.2rem;font-weight:500;color:#8B93A7}
  .chip{display:inline-block;width:.8em;height:.8em;border-radius:50%;margin-left:.4em}
  .row{display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:1.2rem}
  figure{margin:0;background:#121722;border:1px solid #2A3242;border-radius:8px;padding:1.2rem}
  .stage{display:flex;align-items:center;min-height:110px} .stage img{max-width:100%}
  .stage.small{min-height:36px;border-top:1px dashed #2A3242;padding-top:.6rem}
  figcaption{color:#8B93A7;font-size:.85rem;margin-top:.5rem}
  p.hint{color:#8B93A7}
</style></head><body>
<h1>FixedR — Gate G1: Wortmarke &amp; Palette wählen</h1>
<p class="hint">Jede Karte: groß + klein (22 px — Avatar-/Favicon-Tauglichkeit). Hintergrund = Site-Hintergrund <code>#0B0E14</code>.</p>
${sections}
</body></html>\n`);

console.log('OK:', files.join(', '), '+ preview.html');
