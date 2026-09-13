#!/usr/bin/env node
/**
 * FXR-239 — Banner-Prüfstand am AUSGELIEFERTEN Stand (`dist/`).
 *
 * Lauf: `npm run e2e:banner` (setzt `npm run build` voraus).
 *
 * NICHT Teil von `npm run build`: Playwright ist keine Abhängigkeit dieser Site (sie
 * lädt nichts von Dritten und soll klein bleiben). Das Skript sucht eine vorhandene
 * Installation und bricht LAUT ab, wenn keine da ist — ein Prüfstand, der sich still
 * überspringt, meldet Grün über eine Messung, die nie lief.
 *
 * Warum es diesen Prüfstand überhaupt gibt: alle vier Fehler, die er beim Bau gefunden
 * hat, waren offline unsichtbar und in jsdom nicht reproduzierbar.
 *   1. Über `file://` lädt Astros absoluter Asset-Pfad `/_astro/...` gegen die
 *      Laufwerks-Wurzel: WEDER CSS NOCH SKRIPT sind da. Jede Messung meldete Rot über
 *      etwas, das nie geladen wurde. Deshalb serviert das Skript `dist/` über HTTP.
 *   2. `mouseenter` ist auf Touch nicht leer — Chromium feuert es beim Tippen
 *      synthetisch. Öffner auf mouseenter + Umschalter auf click hoben sich auf: auf dem
 *      Tablet passierte sichtbar nichts.
 *   3. Ein Tippen FOKUSSIERT den Knopf, bevor es ihn klickt. Derselbe Selbstauslöscher
 *      eine Ebene tiefer — behoben über `:focus-visible`.
 *   4. Ohne Sperre nach ausdrücklichem Schließen klappte das Menü gegen den Willen des
 *      Benutzers zurück auf, weil der Zeiger noch auf dem Nav-Glied stand.
 */
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { join, extname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const repoRoot = join(fileURLToPath(new URL('.', import.meta.url)), '..');
const DIST = join(repoRoot, 'dist');
if (!existsSync(DIST)) {
  console.error('e2e:banner ABGEBROCHEN: dist/ fehlt — erst `npm run build`.');
  process.exit(1);
}

// Playwright liegt nicht hier. Bekannte Orte auf dieser Maschine, in Reihenfolge.
const KANDIDATEN = [
  join(repoRoot, 'node_modules/playwright/index.mjs'),
  join(repoRoot, '../content.ai/node_modules/playwright/index.mjs'),
  join(repoRoot, '../awesome-cockpit/node_modules/playwright/index.mjs'),
];
const pfad = KANDIDATEN.find((p) => existsSync(p));
if (!pfad) {
  console.error(
    ['e2e:banner ABGEBROCHEN: keine Playwright-Installation gefunden.',
     'Gesucht in:', ...KANDIDATEN.map((k) => '  ' + k),
     'Entweder dort installieren oder `npm i -D playwright` in fixedr-site.'].join(String.fromCharCode(10)),
  );
  process.exit(1);
}
const { chromium } = await import(pathToFileURL(pfad).href);

const MIME = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.svg': 'image/svg+xml', '.png': 'image/png', '.ico': 'image/x-icon', '.woff2': 'font/woff2', '.pdf': 'application/pdf' };
const server = createServer(async (req, res) => {
  let p = decodeURIComponent(req.url.split('?')[0]);
  if (p === '/') p = '/index.html';
  for (const cand of [join(DIST, p), join(DIST, p + '.html'), join(DIST, p, 'index.html')]) {
    try {
      const buf = await readFile(cand);
      res.writeHead(200, { 'content-type': MIME[extname(cand)] ?? 'application/octet-stream' });
      return res.end(buf);
    } catch {}
  }
  res.writeHead(404).end('nope');
});
await new Promise((r) => server.listen(0, r));
const url = `http://127.0.0.1:${server.address().port}/`;
const out = [];
const ok = (n, v) => out.push(`${v ? 'OK  ' : 'FAIL'}  ${n}`);

const browser = await chromium.launch();

// ── A) Maus: die Strecke der Vorlage ───────────────────────────────────────
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto(url);
const panel = page.locator('#product-mega');
const link = page.locator('[data-mega-link]');

ok('Ruhe: Banner zu', !(await panel.isVisible()));

// Positivkontrolle: sind CSS und Skript ueberhaupt da? Ohne sie misst alles Weitere
// nichts (ueber file:// war genau das der Fall, s. Kopfkommentar).
const bg = await page.locator('header.site').evaluate((e) => getComputedStyle(e).position);
ok(`Positivkontrolle: CSS geladen (header position=${bg})`, bg === 'sticky');

// Michael 2026-09-11 + Vorlage `export-web-v4`: inaktive Nav-Glieder sind WEISS
// (var(--on-ink) = #f3f5f7), nicht grau. Im Bau standen sie auf --on-ink-muted.
const navFarbe = await page.locator('header.site nav a[href="/trust"]').evaluate((e) => getComputedStyle(e).color);
ok(`Kopfleisten-Schrift ist weiss (${navFarbe})`, navFarbe === 'rgb(243, 245, 247)');

await link.hover();
ok('Hover auf „Product" oeffnet', await panel.isVisible());
ok('aria-expanded=true', (await link.getAttribute('aria-expanded')) === 'true');
ok('fuenfzehn Punkte sichtbar', (await page.locator('.mega-item').count()) === 15 && (await page.locator('.mega-item').first().isVisible()));
ok('vier Kategorien', (await page.locator('.mega-lane').count()) === 4);
// Kanvas v5 ersetzt die Mono-Nummern aus v4 durch ein eigenes Strichsymbol je Punkt,
// und der Lane-Kopf traegt sein Symbol im Kaestchen. Beides wird hier gemessen: ein
// fehlendes Symbol faellt sonst niemandem auf, weil der Text weiter da ist.
ok('jeder Punkt hat ein eigenes Symbol', (await page.locator('.mega-item .ic svg').count()) === 15);
ok('jede Lane hat ihr Symbolkaestchen', (await page.locator('.lane-head .box svg').count()) === 4);
// Der Kopf ist mindestens 52px hoch — daran haengt, dass alle vier Spalten auf gleicher
// Hoehe beginnen, auch wenn ein Lane-Name zweizeilig umbricht.
const kopfHoehen = await page.locator('.lane-head').evaluateAll((els) => els.map((e) => Math.round(e.getBoundingClientRect().height)));
ok(`Lane-Koepfe gleich hoch (${kopfHoehen.join(', ')})`, new Set(kopfHoehen).size === 1 && kopfHoehen[0] >= 48);
// Michael 2026-09-11: „dort brauchen wir kein Videobild."
ok('keine Filmkarte im Banner', (await page.locator('#product-mega .mega-film').count()) === 0);
// Jeder Punkt muss irgendwo hinfuehren, und alle acht Seiten muessen erreichbar sein.
const ziele = new Set((await page.locator('.mega-item').evaluateAll((els) => els.map((e) => e.getAttribute('href')))));
ok(`alle acht Seiten aus dem Banner erreichbar (${ziele.size})`, ziele.size === 8);

// DIE Eigenschaft, um die es Michael ging: Overlay, kein Verschieben des Inhalts.
const yOffen = (await page.locator('.home-hero h1').boundingBox()).y;
await page.mouse.move(700, 880);
await page.waitForTimeout(250);
ok('Verlassen der Kopfleiste schliesst', !(await panel.isVisible()));
const yZu = (await page.locator('.home-hero h1').boundingBox()).y;
ok(`Banner ist OVERLAY — Inhalt bleibt stehen (H1 ${yOffen} / ${yZu})`, yOffen === yZu);

// v6: der Banner ist KEINE Vollbreite mehr, sondern eine schwebende Karte innerhalb
// von 1200px mit Abstand zum Fensterrand und nur UNTEN gerundeten Ecken.
await link.hover();
const karte = await page.locator('#product-mega > .inner').evaluate((e) => {
  const b = e.getBoundingClientRect();
  const c = getComputedStyle(e);
  return { x: Math.round(b.x), w: Math.round(b.width), unten: c.borderBottomLeftRadius, oben: c.borderTopLeftRadius };
});
ok(`Banner ist eine schwebende Karte (x=${karte.x}, w=${karte.w})`, karte.w <= 1200 && karte.x >= 24);
ok(`Banner nur unten gerundet (oben ${karte.oben}, unten ${karte.unten})`, karte.unten === '16px' && karte.oben === '0px');

// Hit-Test: liegt der Klickpunkt wirklich auf dem Link?
const target = page.locator('.mega-item', { hasText: 'Replay controls' }).first();
const box = await target.boundingBox();
const hit = await page.evaluate(
  ([x, y]) => {
    const el = document.elementFromPoint(x, y);
    return el ? (el.closest('a')?.getAttribute('href') ?? el.tagName) : 'nichts';
  },
  [box.x + box.width / 2, box.y + box.height / 2],
);
ok(`Hit-Test Banner-Link → /product/backtesting (traf: ${hit})`, hit === '/product/backtesting');

// Michael 2026-09-11: „beim hover entsteht weiterhin ein grosses Fenster zentral."
// Gemessen war es das: die Karte sprang von 561x351 bei x=718 auf 1200x675 bei x=80.
// Die Ruecknahme der wachsenden Buehne war nur an EINER von zwei Stellen erfolgt.
// Deshalb wird jetzt die Wirkung gemessen, nicht das Vorhandensein einer CSS-Regel.
await page.mouse.move(700, 880);
await page.waitForTimeout(700);
const karteRuhe = await page.locator('.home-hero .stage').boundingBox();
await page.locator('.home-hero .stage').hover();
await page.waitForTimeout(900);
const karteHover = await page.locator('.home-hero .stage').boundingBox();
const gleich = ['x', 'y', 'width', 'height'].every((k) => Math.round(karteRuhe[k]) === Math.round(karteHover[k]));
ok(
  `Hero-Karte waechst beim Ueberfahren NICHT ` +
    `(${Math.round(karteRuhe.width)}x${Math.round(karteRuhe.height)}@${Math.round(karteRuhe.x)} → ` +
    `${Math.round(karteHover.width)}x${Math.round(karteHover.height)}@${Math.round(karteHover.x)})`,
  gleich,
);
// Michael 2026-09-11: „kann man es vollstaendig anzeigen? aktuell wird nur ein
// ausschnitt gezeigt." Gemessen wird der GEMALTE Kasten des Bildes (bei object-fit:
// contain ist er kleiner als das Element) gegen den Kasten der Karte. Passt er hinein,
// ist nichts abgeschnitten — unabhaengig davon, welches Seitenverhaeltnis der naechste
// Screenshot hat.
const bild = await page.evaluate(() => {
  const img = document.querySelector('.home-hero .stage-content img');
  const karte = document.querySelector('.home-hero .stage');
  if (!img || !karte) return null;
  const ib = img.getBoundingClientRect();
  // clientWidth/Height statt getBoundingClientRect: der Kasten der Karte enthaelt ihren
  // 1px-Rahmen, das Bild liegt INNERHALB. Ein Vergleich gegen den Rahmenkasten meldet
  // sonst 2px Differenz, die es gar nicht gibt.
  return {
    quelle: img.naturalWidth + 'x' + img.naturalHeight,
    quellVerhaeltnis: +(img.naturalWidth / img.naturalHeight).toFixed(3),
    bild: { w: ib.width, h: ib.height },
    karte: { w: karte.clientWidth, h: karte.clientHeight },
    karteVerhaeltnis: +(karte.clientWidth / karte.clientHeight).toFixed(3),
  };
});
// Vollstaendig: das Bild ist so breit UND so hoch wie die Karte — dann ist weder etwas
// abgeschnitten noch bleibt ein Rand. Toleranz 1px fuer Teilpixel.
ok(
  `Screenshot fuellt die Karte randlos (${bild?.quelle} = ${bild?.quellVerhaeltnis}, ` +
    `Bild ${Math.round(bild?.bild.w)}x${Math.round(bild?.bild.h)} / ` +
    `Karte ${Math.round(bild?.karte.w)}x${Math.round(bild?.karte.h)} = ${bild?.karteVerhaeltnis})`,
  !!bild &&
    Math.abs(bild.bild.w - bild.karte.w) <= 1 &&
    Math.abs(bild.bild.h - bild.karte.h) <= 1,
);
// Und die Karte folgt dem Bild, nicht einem festen Verhaeltnis: beide Verhaeltnisse gleich.
ok(
  `Karte folgt dem Seitenverhaeltnis des Bildes (${bild?.karteVerhaeltnis} = ${bild?.quellVerhaeltnis})`,
  !!bild && Math.abs(bild.karteVerhaeltnis - bild.quellVerhaeltnis) <= 0.01,
);

// Der Schleier darf die Karte nie verlassen — sonst waere er das „grosse Fenster".
const schleier = await page.locator('.home-hero .stage-veil').boundingBox();
ok(
  `Schleier bleibt in der Karte (${Math.round(schleier.width)}x${Math.round(schleier.height)})`,
  schleier.width <= karteHover.width && schleier.height <= karteHover.height,
);
// Und er blendet ueberhaupt ein, sonst waere die Regel oben trivial erfuellt.
ok('Schleier blendet beim Ueberfahren ein',
   (await page.locator('.home-hero .stage-veil').evaluate((e) => getComputedStyle(e).opacity)) === '1');
await page.mouse.move(700, 880);
await page.waitForTimeout(700);
ok('Schleier ist in Ruhe unsichtbar',
   (await page.locator('.home-hero .stage-veil').evaluate((e) => getComputedStyle(e).opacity)) === '0');

// Michael 2026-09-11: „das video muss nur auf dem kleinen bild rechts angezeigt werden.
// und auch nur dort ist das hover." Also: es darf KEINE zweite Abspiel-Flaeche geben.
const abspielFlaechen = await page.evaluate(() => {
  const heroKarte = document.querySelector('.home-hero .stage');
  return Array.from(document.querySelectorAll('.stage-veil, .mega-film, .stage-chip')).map((el) =>
    heroKarte && heroKarte.contains(el) ? 'im Hero' : 'AUSSERHALB: ' + el.className,
  );
});
ok(`Film-Hover nur auf der Hero-Karte (${abspielFlaechen.join(' | ') || 'keine'})`,
   abspielFlaechen.length === 1 && abspielFlaechen[0] === 'im Hero');

// Vorlage: das Ueberfahren eines ANDEREN Nav-Glieds schliesst.
await page.locator('header.site nav a[href="/trust"]').hover();
await page.waitForTimeout(150);
ok('anderes Nav-Glied schliesst das Banner', !(await panel.isVisible()));

// Tastatur: sonst waeren die acht Ziele per Tab unerreichbar.
await page.mouse.move(700, 880);
await link.focus();
await page.waitForTimeout(100);
ok('Tastaturfokus oeffnet', await panel.isVisible());
await page.keyboard.press('Escape');
ok('Esc schliesst', !(await panel.isVisible()));

// ── B) Touch: „Product" ist ein Link auf die Nabe ──────────────────────────
// ---- v6: Reveal, Scroll-Buehne, roter Faden -------------------------------
// Diese drei existieren erst im laufenden Browser. Ein Waechter sieht sie nie.
await page.goto(url);
await page.waitForTimeout(400);

// Reveal: was beim Laden UNTER dem Fenster liegt, startet unsichtbar; was im ersten
// Bildschirm steht, bleibt sofort sichtbar (sonst waere der Hero beim Laden leer).
const revealStart = await page.evaluate(() => {
  const els = [...document.querySelectorAll('[data-reveal]')];
  const unten = els.filter((e) => e.getBoundingClientRect().top > innerHeight);
  return { gesamt: els.length, untenGesamt: unten.length,
           // Die INLINE gesetzte Eigenschaft messen, nicht den berechneten Wert: das
           // Skript setzt `style.opacity = '0'`, und weil der Uebergang (.8s) im CSS
           // schon steht, blendet der Browser von 1 nach 0 — kurz nach dem Laden liegt
           // der berechnete Wert also irgendwo dazwischen. Die ZUSAGE ist „armiert",
           // und die steht im inline-Stil.
           untenUnsichtbar: unten.filter((e) => e.style.opacity === '0').length };
});
ok(`Reveal: ${revealStart.untenUnsichtbar}/${revealStart.untenGesamt} unter dem Fenster starten unsichtbar (von ${revealStart.gesamt})`,
   revealStart.gesamt > 0 && revealStart.untenGesamt > 0 && revealStart.untenUnsichtbar === revealStart.untenGesamt);

await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
await page.waitForTimeout(1600);
const revealOffen = await page.evaluate(() =>
  [...document.querySelectorAll('[data-reveal]')].filter((e) => getComputedStyle(e).opacity !== '1').length);
ok(`Reveal: nach dem Scrollen ist alles eingeblendet (${revealOffen} offen)`, revealOffen === 0);

// Scroll-Buehne: jeder der vier Schritte schaltet seine Lage, den Titel und den Punkt.
const buehne = [];
for (const i of [0, 1, 2, 3]) {
  await page.evaluate((n) => {
    const el = document.querySelector(`[data-schritt="${n}"]`);
    window.scrollTo({ top: el.getBoundingClientRect().top + scrollY - innerHeight * 0.45 });
  }, i);
  await page.waitForTimeout(750);
  buehne.push(await page.evaluate(() => ({
    lage: document.querySelector('[data-lage][data-an]')?.dataset.lage,
    titel: document.querySelector('[data-buehne-titel]')?.textContent,
    aktiv: document.querySelector('[data-schritt][data-aktiv]')?.dataset.schritt,
  })));
}
ok(`Buehne folgt den vier Schritten (Lagen ${buehne.map((b) => b.lage).join(',')})`,
   buehne.every((b, i) => b.lage === String(i) && b.aktiv === String(i)));
ok(`Buehnentitel wechselt mit (${buehne.map((b) => b.titel).join(' | ')})`,
   new Set(buehne.map((b) => b.titel)).size === 4);
// Gezeigte Lagen weichen nach OBEN, kommende stehen unten — ohne das haette der
// Wechsel keine Richtung, und die Bewegung waere in beide Seiten gleich.
const richtung = await page.evaluate(() => ({
  vor: document.querySelectorAll('[data-lage][data-vor]').length,
  an: document.querySelectorAll('[data-lage][data-an]').length,
}));
ok(`Lagen haben eine Richtung (${richtung.vor} zurueck, ${richtung.an} aktiv)`, richtung.vor === 3 && richtung.an === 1);

// Roter Faden: Klick auf Kachel 02 springt zu Akt 2, 80px unter die Kopfleiste.
await page.evaluate(() => window.scrollTo(0, 0));
await page.waitForTimeout(300);
await page.locator('[data-faden="2"]').click();
await page.waitForTimeout(1400);
const sprung = await page.evaluate(() => Math.round(document.querySelector('[data-akt="2"]').getBoundingClientRect().top));
ok(`Roter Faden springt zu Akt 2 (Oberkante ${sprung}px, Ziel 80)`, Math.abs(sprung - 80) <= 14);

// Typografie v6: Hero-H1 64px im Gewicht 500 (vorher 60/600).
const h1v6 = await page.locator('.home-hero h1').evaluate((e) => {
  const c = getComputedStyle(e);
  return { size: c.fontSize, weight: c.fontWeight };
});
ok(`Hero-H1 ist 64px/500 (${h1v6.size}/${h1v6.weight})`, h1v6.size === '64px' && h1v6.weight === '500');

// ---- Safety guard: die vier Schritte bleiben lesbar ----------------------
// Michael 2026-09-13: „im abschnitt safety guard werden die textabschnitte je nach
// scrollposition grau. das funktioniert nicht sauber (auch nicht in der vorlage).
// deaktiviere das ausgrauen." Gemessen wird an DREI Scrollstellen, weil der Fehler
// genau zwischen zwei Schritten auftrat: dort war kurz keiner hell.
await page.goto(url.replace(/\/$/, '') + '/');
await page.waitForTimeout(500);
{
  const schritte = await page.locator('.akt2 .schritt').count();
  let blass = [];
  for (const anteil of [0.25, 0.5, 0.75]) {
    await page.evaluate((a) => {
      const abschnitt = document.querySelector('.akt2');
      const k = abschnitt.getBoundingClientRect();
      window.scrollTo(0, k.top + window.scrollY + k.height * a - window.innerHeight / 2);
    }, anteil);
    await page.waitForTimeout(700);
    const werte = await page.evaluate(() => [...document.querySelectorAll('.akt2 .schritt')]
      .map((e) => getComputedStyle(e).opacity));
    werte.forEach((v, i) => { if (v !== '1') blass.push(`bei ${Math.round(anteil * 100)}%: Schritt ${i} = ${v}`); });
  }
  ok(`Safety guard: alle ${schritte} Schritte durchgaengig voll deckend (3 Scrollstellen)`,
     schritte === 4 && blass.length === 0, blass.join(' · '));
  // Die Steuerung darf davon unberuehrt sein: genau eine Lage ist sichtbar.
  const lagen = await page.evaluate(() => document.querySelectorAll('.akt2 .lage[data-an]').length);
  ok(`Safety guard: die Buehne schaltet weiter (genau 1 Lage an, gemessen ${lagen})`, lagen === 1);
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(400);
}

// ---- Farben und Effekte gegen die Vorlage --------------------------------
// BEFUND 2026-09-12 (Michael: „bitte pruefe, ob du auch wirklich alle farben und
// effekte sauber uebernommen hast. das wirkt sich subtil auf die optik der seite aus"):
// zwei systemweite Abweichungen, beide einzeln unauffaellig.
//
//  1. `a:hover { text-decoration: underline }` stand global. Der Kanvas-Export
//     unterstreicht NICHTS — gemessen 0 von 33 / 0 von 33 / 0 von 23 Links auf drei
//     Seiten, bei uns 18 / 22 / 20. Die Regel war so breit, dass sie an rund zwanzig
//     Stellen einzeln zurueckgenommen wurde; ueberall, wo das jemand vergass
//     (Kopfmenue, Fusszeile, Wartelisten-Knopf, Fliesstext), lief sie sichtbar mit.
//  2. Die Rahmenfarbe beim Ueberfahren. Michael sah sie auf der Vorlage dunkel, bei
//     uns hellblau. Beides stimmte: die Vorlage bettet auf Home eine dunkle
//     Cockpit-Attrappe ein, die einen zweiten :root-Block mitbringt und drei Token
//     global ueberschreibt. Entschieden wurde der dunkle Rahmen als EIGENES Token
//     `--brand-line-hover`, damit die Ruhezustaende hellblau bleiben.
//
// Beide Befunde brauchen ein Tor, sonst kehren sie mit der naechsten Regel zurueck.
await page.goto(url.replace(/\/$/, '') + '/');
await page.waitForTimeout(400);
{
  const n = await page.locator('a').count();
  let geprueft = 0;
  const unterstrichen = [];
  for (let i = 0; i < Math.min(n, 60); i++) {
    const el = page.locator('a').nth(i);
    try {
      if (!(await el.isVisible())) continue;
      const k = await el.boundingBox();
      if (!k) continue;
      await el.scrollIntoViewIfNeeded();
      const k2 = await el.boundingBox();
      await page.mouse.move(k2.x + k2.width / 2, k2.y + k2.height / 2);
      await page.waitForTimeout(60);
      geprueft++;
      if ((await el.evaluate((e) => getComputedStyle(e).textDecorationLine)).includes('underline')) {
        unterstrichen.push(await el.evaluate((e) => e.textContent.replace(/\s+/g, ' ').trim().slice(0, 30)));
      }
    } catch { /* ausserhalb des Fensters: zaehlt nicht */ }
  }
  ok(`kein Link unterstreicht beim Ueberfahren (0 von ${geprueft})`,
     unterstrichen.length === 0, unterstrichen.join(' · '));
  // Der Rundgang faehrt zwangslaeufig ueber „Product" und laesst das Banner offen
  // stehen. Ohne dieses Aufraeumen war der Lauf flackernd: rot, dann gruen.
  await page.mouse.move(5, 5);
  await page.keyboard.press('Escape');
  await page.waitForTimeout(250);
}

// Die fuenf Kachelflaechen tragen im Hover `--brand-line-hover`, in Ruhe `--line`.
for (const [pfad, sel, name] of [
  ['/', '.faden a', 'Faden-Kachel'],
  ['/blog', '.blog-raster a', 'Blogkarte'],
  ['/blog/trade-in-r', '.weiterlesen .karten a', 'Weiterlesen-Karte'],
  ['/product', '.hub-tile', 'Hub-Kachel'],
  ['/product/metrics', '.feat-next .karten a', 'Feature-Weiterlesen'],
]) {
  await page.goto(url.replace(/\/$/, '') + pfad);
  await page.waitForTimeout(350);
  await page.mouse.move(5, 5);
  const el = page.locator(sel).first();
  const da = await page.locator(sel).count();
  if (!da) { ok(`${name}: Flaeche vorhanden`, false, sel); continue; }
  await el.scrollIntoViewIfNeeded();
  await page.waitForTimeout(250);
  const ruhe = await el.evaluate((e) => getComputedStyle(e).borderTopColor);
  const k = await el.boundingBox();
  await page.mouse.move(k.x + k.width / 2, k.y + k.height / 2);
  await page.waitForTimeout(400);
  const hover = await el.evaluate((e) => getComputedStyle(e).borderTopColor);
  ok(`${name}: Rahmen ${ruhe} -> ${hover}`,
     ruhe === 'rgb(227, 232, 239)' && hover === 'rgb(27, 63, 102)');
}

// ---- v7: Textseiten und die Baender -------------------------------------
// BEFUND 2026-09-12: die globale Regel `section { padding: 80px 0 }` stammt aus dem
// alten Rhythmus. v6/v7 geben jedem Band seinen Innenabstand selbst — die 80px
// addierten sich obendrauf, beim Trust-Band auf 160px Leerraum. Gemessen wird
// deshalb die WIRKUNG: das Band darf nicht hoeher sein als sein Inhalt.
for (const [pfad, sel, name] of [
  ['/trust', '.trust-band', 'Trust-Band'],
  ['/product/metrics', '.feat-claim', 'Claim-Band'],
  ['/product/metrics', '.feat-next', 'Weiterlesen-Band'],
]) {
  await page.goto(url.replace(/\/$/, '') + pfad);
  await page.waitForTimeout(300);
  const r = await page.evaluate((s) => {
    const el = document.querySelector(s);
    const inner = el?.querySelector('.inner');
    if (!el || !inner) return null;
    return { band: Math.round(el.getBoundingClientRect().height), inhalt: Math.round(inner.getBoundingClientRect().height) };
  }, sel);
  ok(`${name} ohne Zuschlag (Band ${r?.band}px = Inhalt ${r?.inhalt}px)`, !!r && r.band - r.inhalt <= 2);
}

// Die fuenf Textseiten tragen alle dasselbe Kopfband und dieselbe Randspalte.
for (const seite of ['methodology', 'trust', 'faq', 'blog', 'manifesto']) {
  await page.goto(url.replace(/\/$/, '') + '/' + seite);
  await page.waitForTimeout(250);
  const r = await page.evaluate(() => {
    const h1 = document.querySelector('.text-head h1');
    const c = h1 ? getComputedStyle(h1) : null;
    return {
      kopf: !!document.querySelector('.text-head'),
      groesse: c?.fontSize, gewicht: c?.fontWeight,
      // Blog setzt den Koerper selbst (Kartenraster) und hat deshalb keine Randspalte.
      spalte: !!document.querySelector('.text-body aside') || !!document.querySelector('.blog-raster'),
    };
  });
  ok(`${seite}: Kopfband, H1 ${r.groesse}/${r.gewicht}, Randspalte/Raster`,
     r.kopf && r.groesse === '56px' && r.gewicht === '500' && r.spalte);
}

const touch = await browser.newContext({ viewport: { width: 1440, height: 900 }, hasTouch: true });
const tp = await touch.newPage();
await tp.goto(url);
// Die Navigation braucht ein explizites Warten: ohne waitForURL misst die Behauptung
// die Seite VOR dem Wechsel und meldet falsches Rot.
await Promise.all([
  tp.waitForURL(/product/, { timeout: 5000 }).catch(() => {}),
  tp.locator('[data-mega-link]').tap(),
]);
ok(`Touch: „Product" fuehrt auf die Nabe (${new URL(tp.url()).pathname})`, tp.url().includes('/product'));
ok('Touch: die acht stehen dort als Kacheln', (await tp.locator('.hub-tile').count()) === 8);

// ── C) Fusszeile: Raster ueber die volle Inhaltsbreite ─────────────────────
const cols = await page.locator('footer.site .footer-cols').evaluate((e) => ({
  display: getComputedStyle(e).display,
  spalten: getComputedStyle(e).gridTemplateColumns.split(' ').length,
  breite: Math.round(e.getBoundingClientRect().width),
}));
ok(`Fusszeile ist ein Raster (${cols.display}, ${cols.spalten} Spalten)`, cols.display === 'grid' && cols.spalten === 5);
ok(`Fusszeile nutzt die volle Inhaltsbreite (${cols.breite}px von 1120)`, cols.breite >= 1100);
ok('Haftungsabsatz vorhanden', await page.locator('.footer-disclaimer').isVisible());

// ── D) Handy: Kopfleiste aus, Fusszeile traegt die acht ────────────────────
const mob = await browser.newPage({ viewport: { width: 390, height: 844 } });
await mob.goto(url);
ok('mobil: Banner ausgeblendet', !(await mob.locator('#product-mega').isVisible()));
ok(`mobil: Fusszeile fuehrt auf die acht`, (await mob.locator('footer a[href^="/product/"]').count()) === 8);

await browser.close();
server.close();
console.log(out.join(String.fromCharCode(10)));
const rot = out.some((l) => l.startsWith('FAIL'));
console.log(rot ? String.fromCharCode(10) + 'ERGEBNIS: ROT' : String.fromCharCode(10) + 'ERGEBNIS: GRUEN');
process.exit(rot ? 1 : 0);
