// Erzeugt aus der gewählten Wortmarke (G1: V1 + Amber) alle Ableitungen:
// finale Wortmarken-SVGs, Avatar, Favicon (.svg/.ico), App-icon.ico (16–256),
// PWA-PNGs (192/512/maskable) und das OG-Image 1200×630.
// Aufruf: node tools/gen-assets.mjs
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import sharp from 'sharp';
import pngToIco from 'png-to-ico';
import { root, COLORS, wortmarke, iconMaster, shape, glyphGroup, svg, fonts } from './lib-marke.mjs';

const finalDir = join(root, 'branding', 'final');
const appDir = join(root, 'branding', 'app-icons');
const pubDir = join(root, 'public');
mkdirSync(finalDir, { recursive: true });
mkdirSync(appDir, { recursive: true });
mkdirSync(pubDir, { recursive: true });

const svgToPng = (svgStr, size) =>
  sharp(Buffer.from(svgStr), { density: 300 }).resize(size, size).png().toBuffer();

// 1) Finale Wortmarke: dunkel (Site) + hell (Dokumente/Druck)
const wmDark = wortmarke({ text: COLORS.text, signal: COLORS.signal });
const wmLight = wortmarke({ text: COLORS.textOnLight, signal: COLORS.signalOnLight });
writeFileSync(join(finalDir, 'fixedr-wortmarke-dark.svg'), wmDark);
writeFileSync(join(finalDir, 'fixedr-wortmarke-light.svg'), wmLight);

// 2) Icon-Master + Favicon-SVG
const master = iconMaster({ size: 512 });
writeFileSync(join(appDir, 'icon-master.svg'), master);
const favSvg = iconMaster({ size: 512, rounded: 0 }); // Favicon: hartes Quadrat, Browser rundet selbst
writeFileSync(join(pubDir, 'favicon.svg'), favSvg);

// 3) Avatar (quadratisch, für Foren/X)
await sharp(Buffer.from(master), { density: 300 }).resize(512, 512).png().toFile(join(finalDir, 'fixedr-avatar-512.png'));

// 4) favicon.ico (16/32/48) + App-icon.ico (16–256)
const icoSizes = [16, 24, 32, 48, 64, 128, 256];
const pngs = {};
for (const s of icoSizes) pngs[s] = await svgToPng(favSvg, s);
writeFileSync(join(pubDir, 'favicon.ico'), await pngToIco([pngs[16], pngs[32], pngs[48]]));
writeFileSync(join(appDir, 'icon.ico'), await pngToIco(icoSizes.map((s) => pngs[s])));

// 5) PWA-PNGs in ECHTEN Größen (Ersatz für die JPEG-mit-.png-Endung aus dem AC23-Befund)
await sharp(Buffer.from(master), { density: 300 }).resize(192, 192).png().toFile(join(appDir, 'pwa-192.png'));
await sharp(Buffer.from(master), { density: 300 }).resize(512, 512).png().toFile(join(appDir, 'pwa-512.png'));
// maskable: Motiv in der 80-%-Safe-Zone
const maskable = (() => {
  const size = 512;
  const r = shape(fonts.jb800, 'R', size * 0.5);
  const cap = size * 0.5 * 0.72;
  return svg(size, size,
    `<rect width="${size}" height="${size}" fill="${COLORS.bg}"/>` +
    glyphGroup(r, (size - r.width) / 2, size / 2 + cap / 2, COLORS.signal));
})();
await sharp(Buffer.from(maskable), { density: 300 }).resize(512, 512).png().toFile(join(appDir, 'pwa-maskable-512.png'));

// 6) OG-Image 1200×630 (Site-Standard, liegt in public/)
const og = (() => {
  const W = 1200, H = 630;
  const wm = wortmarke({ text: COLORS.text, signal: COLORS.signal, size: 150 });
  const wmW = parseFloat(wm.match(/viewBox="0 0 (\d+)/)[1]);
  const wmH = parseFloat(wm.match(/viewBox="0 0 \d+ (\d+)/)[1]);
  const inner = wm.replace(/<svg[^>]*>/, '').replace('</svg>', '');
  const tagline = 'your trading cockpit.';
  const sub = shape(fonts.jb500, tagline, 44);
  return svg(W, H,
    `<rect width="${W}" height="${H}" fill="${COLORS.bg}"/>` +
    `<line x1="0" y1="${H - 8}" x2="${W}" y2="${H - 8}" stroke="${COLORS.signal}" stroke-width="16"/>` +
    `<g transform="translate(${(W - wmW) / 2} ${(H - wmH) / 2 - 60})">${inner}</g>` +
    glyphGroup(sub, (W - sub.width) / 2, (H - wmH) / 2 + wmH + 30, '#8B93A7'));
})();
writeFileSync(join(appDir, 'og-image.svg'), og);
await sharp(Buffer.from(og), { density: 150 }).resize(1200, 630).png().toFile(join(pubDir, 'og-image.png'));

console.log('OK: final/ (wortmarke dark+light, avatar), app-icons/ (master, icon.ico, pwa 192/512/maskable, og), public/ (favicon.svg/.ico, og-image.png)');
