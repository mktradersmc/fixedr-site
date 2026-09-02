// Erzeugt alle Ableitungen aus den GEZEICHNETEN Markendateien (branding/marke/).
// Aufruf: node tools/gen-assets.mjs
//
// Umstellung 2026-08-27 (Design-Handoff „Runde 7"): die Marke wird nicht mehr aus
// Schriftpfaden synthetisiert (tools/lib-marke.mjs, Palette Amber, E-C133), sondern
// stammt als Zeichnung aus dem Handoff. Deshalb ist hier die einzige Quelle
// `branding/marke/*.svg`; lib-marke.mjs/gen-wortmarke.mjs bleiben nur als Beleg des
// alten Standes liegen und werden nicht mehr aufgerufen.
//
// Namensregel des Handoffs: `on-light`/`on-dark` meint den GRUND, auf dem das Logo
// liegt — nicht seine eigene Farbe. `on-light` gehoert auf Weiss.
import { mkdirSync, writeFileSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import pngToIco from 'png-to-ico';

const root = join(fileURLToPath(new URL('.', import.meta.url)), '..');
const markeDir = join(root, 'branding', 'marke');
const finalDir = join(root, 'branding', 'final');
const appDir = join(root, 'branding', 'app-icons');
const pubDir = join(root, 'public');
for (const d of [finalDir, appDir, pubDir]) mkdirSync(d, { recursive: true });

const read = (name) => readFileSync(join(markeDir, name), 'utf8');
const svgToPng = (svgStr, w, h = w) =>
  sharp(Buffer.from(svgStr), { density: 400 })
    .resize(w, h, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toBuffer();

/** Markenwerte, identisch zu branding/palette.md und src/styles/global.css. */
const BRAND = '#0a62cf';
const INK = '#06070a';
const ON_INK_MUTED = '#98a1ab';
const WHITE = '#ffffff';
/** Die Tintenfarbe, in der die gezeichneten Marken das „F" tragen. */
const MARK_INK = '#0b1626';

/** Nimmt den Inhalt eines SVG ohne die aeussere <svg>-Huelle. */
const inner = (s) => s.replace(/^[\s\S]*?<svg[^>]*>/, '').replace(/<\/svg>\s*$/, '');
const viewBox = (s) => s.match(/viewBox="0 0 ([\d.]+) ([\d.]+)"/).slice(1, 3).map(Number);

// ── 1) Kopfleisten-Lockup und Wortmarken ────────────────────────────────────
// Die Site traegt die Dateien direkt; kein Nachzeichnen, kein Umfaerben.
writeFileSync(join(pubDir, 'wortmarke.svg'), read('logo-full-on-light.svg'));
writeFileSync(join(finalDir, 'fixedr-lockup-on-light.svg'), read('logo-full-on-light.svg'));
writeFileSync(join(finalDir, 'fixedr-lockup-on-dark.svg'), read('logo-full-on-dark.svg'));
writeFileSync(join(finalDir, 'fixedr-wortmarke-on-light.svg'), read('wordmark-on-light.svg'));
writeFileSync(join(finalDir, 'fixedr-wortmarke-on-dark.svg'), read('wordmark-on-dark.svg'));

// ── 2) Favicon-SVG und Bildmarke ────────────────────────────────────────────
const [mw, mh] = viewBox(read('mark-on-light.svg'));
const markInner = inner(read('mark-on-light.svg'));

/** Legt die Bildmarke mittig auf ein Quadrat. `pad` = Anteil freier Rand je Seite. */
function quadrat(size, pad, grund, tinte = MARK_INK) {
  const nutz = size * (1 - 2 * pad);
  const skal = Math.min(nutz / mw, nutz / mh);
  const x = (size - mw * skal) / 2;
  const y = (size - mh * skal) / 2;
  const motiv = tinte === MARK_INK ? markInner : markInner.split(MARK_INK).join(tinte);
  return (
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" width="${size}" height="${size}">` +
    (grund ? `<rect width="${size}" height="${size}" fill="${grund}"/>` : '') +
    `<g transform="translate(${x} ${y}) scale(${skal})">${motiv}</g></svg>`
  );
}

writeFileSync(join(pubDir, 'favicon.svg'), quadrat(512, 0.08, null));
writeFileSync(join(appDir, 'icon-master.svg'), quadrat(512, 0.08, null));

// ── 3) .ico-Dateien ─────────────────────────────────────────────────────────
// Auf 16 px ist eine transparente Zeichnung auf dunklem Browser-Chrom unlesbar,
// deshalb tragen die .ico-Groessen eine weisse Flaeche.
const icoSvg = quadrat(512, 0.1, WHITE);
const icoSizes = [16, 24, 32, 48, 64, 128, 256];
const pngs = {};
for (const s of icoSizes) pngs[s] = await svgToPng(icoSvg, s);
writeFileSync(join(pubDir, 'favicon.ico'), await pngToIco([pngs[16], pngs[32], pngs[48]]));
writeFileSync(join(appDir, 'icon.ico'), await pngToIco(icoSizes.map((s) => pngs[s])));

// ── 4) PWA-PNGs in ECHTEN Groessen (AC23-Befund: vorher JPEG mit .png-Endung) ─
await sharp(await svgToPng(quadrat(512, 0.1, WHITE), 192)).toFile(join(appDir, 'pwa-192.png'));
await sharp(await svgToPng(quadrat(512, 0.1, WHITE), 512)).toFile(join(appDir, 'pwa-512.png'));
// maskable: Motiv in der 80-%-Safe-Zone, also 20 % Rand je Seite.
await sharp(await svgToPng(quadrat(512, 0.2, WHITE), 512)).toFile(join(appDir, 'pwa-maskable-512.png'));

// Avatar fuer Foren/X: dunkle Flaeche, damit er neben hellen Avataren steht.
await sharp(await svgToPng(quadrat(512, 0.16, INK, WHITE), 512)).toFile(
  join(finalDir, 'fixedr-avatar-512.png')
);

// ── 5) OG-Image 1200x630 ────────────────────────────────────────────────────
// Dunkle Flaeche, damit die Vorschau in Feeds nicht mit dem weissen Umfeld
// verschwimmt. Gesetzt in der System-Serifenlosen, weil das OG-Bild als PNG
// gerastert wird und keine Schrift nachladen kann.
//
// Die Unterzeile sagt bewusst, WAS das Produkt ist, nicht noch einmal, dass es
// ruhig macht: das Lockup darueber traegt „TRADE CALM. BY DESIGN." bereits als
// Pfad. Zwei Ruhe-Saetze uebereinander waeren dieselbe Verdopplung, die auf der
// Startseite gerade aufgeloest wurde. Dieses Bild ist die Link-Vorschau im Forum
// und damit fuer das Seeding die erste Beruehrung ueberhaupt.
const og = (() => {
  const W = 1200;
  const H = 630;
  const [lw, lh] = viewBox(read('logo-full-on-dark.svg'));
  const skal = 620 / lw;
  const x = (W - lw * skal) / 2;
  // Der Block ist Lockup PLUS Satz. Waere nur das Lockup mittig gesetzt, saesse
  // der ganze Block sichtbar zu hoch — deshalb gegen die Blockmitte gerechnet.
  const y = H / 2 - lh * skal + 30;
  return (
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}">` +
    `<rect width="${W}" height="${H}" fill="${INK}"/>` +
    `<rect x="0" y="${H - 10}" width="${W}" height="10" fill="${BRAND}"/>` +
    `<g transform="translate(${x} ${y}) scale(${skal})">${inner(read('logo-full-on-dark.svg'))}</g>` +
    `<text x="${W / 2}" y="${H / 2 + 126}" text-anchor="middle"` +
    ` font-family="system-ui, -apple-system, Segoe UI, sans-serif"` +
    ` font-size="34" font-weight="400" fill="${ON_INK_MUTED}">` +
    `A trading cockpit for funded accounts. No balance on the screen.</text>` +
    `</svg>`
  );
})();
writeFileSync(join(appDir, 'og-image.svg'), og);
await sharp(Buffer.from(og), { density: 150 }).resize(1200, 630).png().toFile(join(pubDir, 'og-image.png'));

console.log(
  'OK aus branding/marke/: public/ (wortmarke.svg, favicon.svg/.ico, og-image.png), branding/final/, branding/app-icons/'
);
