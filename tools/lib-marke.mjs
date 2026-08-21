// Gemeinsame Bausteine der Marken-Generatoren: Text→Pfad-Shaping + SVG-Helfer.
import * as fontkit from 'fontkit';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

export const root = join(dirname(fileURLToPath(import.meta.url)), '..');

const jbFile = (w) => join(root, 'node_modules', '@fontsource', 'jetbrains-mono', 'files', `jetbrains-mono-latin-${w}-normal.woff2`);
export const fonts = {
  jb500: fontkit.openSync(jbFile('500')),
  jb800: fontkit.openSync(jbFile('800')),
};

export const COLORS = {
  bg: '#0B0E14',
  surface: '#121722',
  text: '#E6E9F0',
  textOnLight: '#14181F',
  signal: '#FFB000',
  signalOnLight: '#B37B00',
};

/** Layoutet `text` und liefert je Glyph {d, x, y} in px plus Gesamtbreite. */
export function shape(font, text, size, track = 0) {
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

/** Rendert eine Glyphfolge als SVG-Gruppe (y-Achse gespiegelt, Fontkoordinaten sind y-up). */
export function glyphGroup(shaped, ox, baseline, fill) {
  const paths = shaped.glyphs
    .filter((g) => g.d && g.d.length > 1)
    .map((g) => `<path transform="translate(${(ox + g.x).toFixed(2)} ${(baseline - g.y).toFixed(2)}) scale(${shaped.scale.toFixed(6)} ${-shaped.scale.toFixed(6)})" d="${g.d}"/>`)
    .join('');
  return `<g fill="${fill}">${paths}</g>`;
}

export const svg = (w, h, body) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w.toFixed(0)} ${h.toFixed(0)}" width="${w.toFixed(0)}" height="${h.toFixed(0)}">${body}</svg>\n`;

/** Die gewählte Wortmarke V1: „Fixed" (Medium) + „R" (ExtraBold in Signalfarbe). */
export function wortmarke({ text, signal, size = 64 }) {
  const H = size * 1.4;
  const BASE = size * 1.08;
  const a = shape(fonts.jb500, 'Fixed', size);
  const b = shape(fonts.jb800, 'R', size);
  const gap = size * 0.02;
  const pad = size * 0.06;
  const w = pad + a.width + gap + b.width + size * 0.12;
  return svg(w, H,
    glyphGroup(a, pad, BASE, text) +
    glyphGroup(b, pad + a.width + gap, BASE, signal));
}

/** Icon-Master: fettes R auf dunklem Quadrat (rx = Eckenradius-Anteil, 0 für Favicon-Transparent). */
export function iconMaster({ size = 512, bg = COLORS.bg, signal = COLORS.signal, rounded = 0.14, transparent = false }) {
  const r = shape(fonts.jb800, 'R', size * 0.72);
  const cap = size * 0.72 * 0.72;
  const bgRect = transparent ? '' :
    `<rect width="${size}" height="${size}" rx="${(size * rounded).toFixed(0)}" fill="${bg}"/>`;
  return svg(size, size,
    bgRect +
    glyphGroup(r, (size - r.width) / 2, size / 2 + cap / 2, signal));
}
