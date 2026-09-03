#!/usr/bin/env node
/**
 * FXR-142 G5 — Ein echter Screenshot der Trading-Flaeche fuer den Hero-
 * Streifen von fixedr-site (kein Mockup, aufgenommen aus dem angemeldeten
 * Pruefstand).
 *
 * Ablauf: dunkles Thema setzen, anmelden, in den Bereich TRADING wechseln,
 * ein Symbol in die Watchlist einrichten (`configure_symbol` — DIREKT ueber
 * einen eigenen Socket.IO-Client, s. Begruendung unten) und in die aktive
 * Kachel laden, rechte Panes wieder schliessen, PNG bei 1600x1000 sichern.
 *
 * BEFUND (vor dem Bau dieses Skripts gemessen, s. `start.e2e.mjs`/
 * `panes.e2e.mjs`-Kopfkommentare): eine frische Datenwurzel ohne echten EA
 * hat weder einen Broker-Symbolkatalog noch einen Datenfeed. Der UI-Weg
 * "+ Symbol" im Watchlist-Dialog zeigt dort NICHTS an (die Liste speist sich
 * aus `all_symbols_list`, das seinerseits nur ein wirklich angeschlossener
 * Bot befuellt). `configure_symbol` selbst (`SystemOrchestrator.
 * addConfiguredSymbol`) braucht dagegen NUR `symbol` — `botId` bleibt leer,
 * wenn kein Angebot dafuer existiert, und die Funktion legt den Eintrag
 * trotzdem an (kein Wurf, s. Quelltext). Das macht das Symbol in der
 * Watchlist sichtbar und in eine Kachel ladbar; die Kachel bleibt dann OHNE
 * Kerzen (kein Datenfeed dahinter) — das ist die ehrliche Grenze, die der
 * Auftrag ausdruecklich als Ausweg vorsieht ("leer ist erlaubt, kaputt
 * nicht"). Fuer echte Kerzen im Bild braeuchte es eine eigene Datensaat
 * (Kerzen-Fixture im Pruefstand) — das ist ein eigenes, kleines Paket,
 * hier NICHT gebaut, im Ticketprotokoll offengelegt.
 *
 * `socket.io-client` ist KEINE neue Bibliothek — dieselbe Installation, die
 * die Anwendung selbst benutzt (`src/services/socket.ts`), liegt bereits in
 * `node_modules` dieses Pakets.
 *
 * E-C142: Bezeichner englisch, Prosa deutsch.
 * E-C121: kein Geldbetrag, kein Waehrungszeichen im Bild — vor dem Speichern
 * geprueft (sichtbarer Text auf Euro-/Dollarzeichen und Kontonummer-Muster).
 *
 * ── Ablage hier vs. Ausfuehrungsort ─────────────────────────────────────
 * Diese Kopie liegt in `fixedr-site` nur als BELEG/Nachschlagestelle — sie
 * IMPORTIERT `./harness.mjs` relativ und braucht daher den E2E-Rahmen aus
 * `awesome-cockpit`. Zum Ausfuehren:
 *   1. Datei nach `awesome-cockpit/src/trading-cockpit/test/e2e/hero-shot.e2e.mjs`
 *      kopieren (dort liegt `harness.mjs`, s. `awesome-cockpit/CLAUDE.md` fuer
 *      den Prüfstand-Workflow — NIE direkt im Hauptbaum arbeiten, sondern im
 *      dafuer vorgesehenen Worktree).
 *   2. `cd` in `.../trading-cockpit`, dann `node test/e2e/hero-shot.e2e.mjs`
 *      (startet EIGENES Backend :3100 + Dev-Server :3101 auf einer frischen
 *      Scratch-Datenwurzel, meldet sich selbst an, raeumt am Ende auf —
 *      Michaels laufende Ports 3000/3005/3001/8791 bleiben unberuehrt).
 *   3. Ergebnis landet standardmaessig unter
 *      `C:/forge-os/fixedr-site/public/screens/trading-dark.png`
 *      (ueberschreibbar per Umgebungsvariable `HERO_SHOT_OUT`).
 * Nach einem neuen Lauf: `npm run build` (oder die Guards/`linkcheck.mjs`
 * aus diesem Ordner) hier in `fixedr-site` erneut pruefen, dann `dist/`
 * nachziehen (s. Ticketprotokoll FXR-142 zur Sperrenfrage bei laufender
 * `astro preview`).
 */
import path from 'node:path';
import fs from 'node:fs';
import { io } from 'socket.io-client';
import { runE2E, loginViaUi, filterUnknownConsoleErrors } from './harness.mjs';

function sleep(ms) {
    return new Promise((r) => setTimeout(r, ms));
}

const HERO_SYMBOL = 'EURUSD';
const OUT_FILE = process.env.HERO_SHOT_OUT || path.resolve('C:/forge-os/fixedr-site/public/screens/trading-dark.png');

/**
 * Richtet `HERO_SYMBOL` in der Watchlist ein — s. Kopfkommentar fuer die
 * Begruendung des direkten Socket-Wegs statt des UI-Dialogs.
 */
async function configureSymbolViaSocket(backendUrl, token, symbol) {
    const socket = io(backendUrl, {
        autoConnect: false,
        transports: ['websocket'],
        auth: (cb) => cb({ token }),
    });
    try {
        await new Promise((resolve, reject) => {
            socket.on('connect_error', (e) => reject(new Error(`[hero-shot] Socket-Verbindung fehlgeschlagen: ${e.message}`)));
            socket.on('connect', () => resolve());
            socket.connect();
        });
        const ack = await new Promise((resolve, reject) => {
            const timer = setTimeout(() => reject(new Error('[hero-shot] configure_symbol: kein Ack innerhalb 10s')), 10000);
            socket.emit(
                'configure_symbol',
                { symbol, botId: undefined, datafeedSymbol: symbol, originalName: symbol, newsCurrency: 'AUTO' },
                (result) => { clearTimeout(timer); resolve(result); },
            );
        });
        if (!ack || (!ack.success && ack.error !== 'already_configured')) {
            throw new Error(`[hero-shot] configure_symbol abgelehnt: ${JSON.stringify(ack)}`);
        }
        console.log(`[hero-shot] Symbol ${symbol} eingerichtet: ${JSON.stringify(ack)}`);
    } finally {
        socket.disconnect();
    }
}

/** Prueft den sichtbaren Text auf Geldwerte/Kontonummern (E-C121). */
function findMoneyLikeText(text) {
    const hits = [];
    if (/[€$]\s?\d/.test(text) || /\d\s?[€$]/.test(text)) hits.push('waehrungszeichen-mit-zahl');
    if (/\bEUR\s?\d{2,}/.test(text)) hits.push('EUR-betrag');
    if (/\b\d{7,}\b/.test(text)) hits.push('lange-zahlenfolge (evtl. kontonummer)');
    return hits;
}

async function openPane(page, key) {
    const button = page.locator(`button:has([data-anchor="shell.pane.${key}"])`);
    await button.first().click();
    await sleep(400);
}

/** Schliesst die rechte Panes-Leiste NUR, wenn gerade ein Pane offen ist —
 *  ueber den eigenen Einklapp-Knopf (`RightSidebar.tsx`,
 *  `aria-label={t('shell.pane.collapseAria')}` = "Pane einklappen"), nicht
 *  durch blindes zweites Antippen des Reiters (das waere bei ungerader Zahl
 *  vorheriger Aufrufe ein erneutes OEFFNEN statt Schliessen). */
async function closePaneIfOpen(page) {
    const collapseButton = page.locator('button[aria-label="Pane einklappen"]');
    if (await collapseButton.count() > 0) {
        await collapseButton.first().click();
        await sleep(400);
    }
}

/**
 * Baut ein Drei-Kachel-Mosaik (Layout "3 Vertical") mit `HERO_SYMBOL` in
 * jeder Kachel — der Auftrag nennt "Kacheln HTF/MTF/LTF" als Ausweg fuer ein
 * Bild ohne echte Kerzen; drei Kacheln statt einer machen das Bild als
 * Trading-Flaeche lesbar. Wirft bei Fehlschlag (der Aufrufer faengt das ab
 * und behaelt die eine Kachel von vorher).
 *
 * BEFUND (gemessen, dann bewusst NICHT gebaut): ein Sync-Tag je Kachel
 * (Klartext "HTF"/"MTF"/"LTF" statt nur Zeitrahmen) liesse sich technisch
 * setzen (`ChartOverlay.tsx`, Knopf `title="Sync-Tag"`), kollidiert aber bei
 * dieser Kachelbreite (~480px) sichtbar mit der "KEINE DATEN"-Kapsel
 * (ueberlappender Text, am eigenen Screenshot geprueft) — das saehe im
 * Hero-Bild wie ein defekter Aufbau aus, genau das der Auftrag verbietet
 * ("kaputt nicht"). Die drei Kacheln selbst (Symbol + Zeitrahmen im Kopf)
 * genuegen dem Auftrag ohne dieses Risiko.
 */
async function buildHtfMtfLtfMosaic(page) {
    await page.locator('button[title="Change Layout"]').first().click();
    await sleep(300);
    const threeVertical = page.locator('text=3 Vertical').first();
    if (!(await threeVertical.isVisible().catch(() => false))) {
        throw new Error('Layout-Option "3 Vertical" nicht sichtbar.');
    }
    await threeVertical.click();
    await sleep(700);

    const panes = page.locator('[class*="fxr-chart-"]');
    const paneCount = await panes.count();
    if (paneCount < 3) throw new Error(`Nur ${paneCount} Kacheln nach Layoutwechsel (erwartet 3).`);

    for (let i = 1; i < 3; i += 1) {
        // Kachel 0 traegt HERO_SYMBOL bereits (vom Hauptablauf oben).
        const pane = page.locator('[class*="fxr-chart-"]').nth(i);
        await pane.click({ position: { x: 10, y: 10 } });
        await sleep(250);

        await openPane(page, 'watchlist');
        await sleep(300);
        const row = page.locator(`text=${HERO_SYMBOL}`).first();
        if (!(await row.isVisible().catch(() => false))) throw new Error(`Watchlist-Zeile ${HERO_SYMBOL} fuer Kachel ${i} nicht sichtbar.`);
        await row.click();
        await sleep(400);
        await closePaneIfOpen(page);
        await sleep(200);
    }
    return true;
}

/**
 * Schliesst die HealthBar-Banner (Titel aus `de.json` `health.lock.hideTitle`/
 * `health.event.ackTitle`) — echte Meldungen des Pruefstands (Netz-/Lizenz-
 * Pruefungen ohne Internet, o.ae.), keine Attrappe: derselbe Ausblenden-
 * Knopf, den ein Nutzer auch haette. Der Auftrag verbietet Fehlerkarten IM
 * BILD, nicht die Meldung an sich — quittiert bleibt der Sachverhalt
 * bestehen (FXR-90), nur die Kachel verschwindet.
 */
async function dismissHealthBanners(page) {
    const titles = [
        'Ausblenden. Die Sperre bleibt bestehen und im Zustandspunkt oben sichtbar.',
        'Quittieren und ausblenden. Das Ereignis bleibt offen, bis eine Gegenmessung gelingt.',
        'Ausblenden. Die Meldung kommt zurueck, sobald es dringender wird.', // LicenseBar (license.dismissTitle)
    ];
    let dismissedTotal = 0;
    for (let round = 0; round < 10; round += 1) {
        let dismissedThisRound = 0;
        for (const title of titles) {
            const buttons = page.locator(`button[title="${title}"]`);
            let count = await buttons.count();
            while (count > 0) {
                await buttons.first().click().catch(() => {});
                await sleep(150);
                dismissedThisRound += 1;
                count = await buttons.count();
            }
        }
        dismissedTotal += dismissedThisRound;
        if (dismissedThisRound === 0) break;
        await sleep(200);
    }
    return dismissedTotal;
}

async function main() {
    await runE2E('hero-shot', async (ctx) => {
        console.log(`[hero-shot] Datenwurzel: ${ctx.dataRoot}`);

        await ctx.seedBroker();
        await configureSymbolViaSocket(ctx.backendUrl, ctx.token, HERO_SYMBOL);

        // Eigener Kontext statt ctx.newPage() — der Auftrag verlangt 1600x1000,
        // deviceScaleFactor 1, ctx.newPage() ist fest auf 1440x900 verdrahtet.
        const context = await ctx.browser.newContext({
            viewport: { width: 1600, height: 1000 },
            deviceScaleFactor: 1,
        });
        // Dunkles Thema explizit setzen (ThemeProvider-Standard ist zwar bereits
        // 'dark', hier trotzdem ausdruecklich statt implizit, wie im Auftrag
        // verlangt) — vor JEDER Navigation in diesem Kontext.
        await context.addInitScript(() => {
            try { window.localStorage.setItem('vite-ui-theme', 'dark'); } catch { /* privater Modus o.ae. */ }
        });
        const page = await context.newPage();
        const collector = { consoleMessages: [] };
        page.on('console', (msg) => { if (msg.type() === 'error') collector.consoleMessages.push({ type: 'error', text: msg.text() }); });

        await loginViaUi(page, ctx.baseUrl, ctx.username, ctx.password);
        const dismissedAtLogin = await dismissHealthBanners(page);
        await ctx.goToTrading(page);
        await sleep(800); // Turbopack-Nachkompilierung beim ersten Besuch (s. tour.e2e.mjs-Befund)
        const dismissedAtTrading = await dismissHealthBanners(page);

        // Symbol aus der Watchlist in die aktive Kachel laden.
        await openPane(page, 'watchlist');
        await sleep(400);
        const row = page.locator(`text=${HERO_SYMBOL}`).first();
        const rowVisible = await row.isVisible().catch(() => false);
        if (!rowVisible) {
            throw new Error(`[hero-shot] Symbol ${HERO_SYMBOL} nach dem Einrichten NICHT in der Watchlist sichtbar.`);
        }
        await row.click();
        await sleep(600);

        // Versuch: D1 hat auf einer frischen Datenwurzel typischerweise keine
        // Kerzen ("Die Datenquelle liefert fuer D1 vor dem heutigen Tag keine
        // Kerzen") — der Chart bietet dafuer selbst einen Wechsel-Knopf an,
        // der eventuell einen Zeitrahmen MIT Daten trifft (PAPER_BOT/Referenz-
        // Datenquelle). Nur EIN Versuch, kein Rateschleife — bleibt es leer,
        // ist das die ehrliche Grenze aus dem Kopfkommentar.
        const switchToM15 = page.locator('text=Auf M15 wechseln').first();
        if (await switchToM15.isVisible().catch(() => false)) {
            await switchToM15.click();
            await sleep(800);
        }

        // Watchlist-Pane wieder schliessen, BEVOR das Mosaik anfaengt — dessen
        // Schleife oeffnet sie je Kachel selbst erneut ueber `openPane` (das
        // TOGGELT: waere sie hier noch offen, schlaege der naechste Aufruf sie
        // fälschlich zu statt sie zu oeffnen).
        await closePaneIfOpen(page);
        await sleep(300);

        // Auftrag: "Kacheln HTF/MTF/LTF wenn ohne Daten moeglich" — drei
        // Kacheln statt einer machen das Bild als Trading-Mosaik lesbar, auch
        // ohne Kerzen. Bestes-Bemuehen-Block: schlaegt ein Schritt fehl (Text-
        // /Locator-Aenderung), bleibt die EINE EURUSD-Kachel von oben stehen —
        // das Foto entsteht so oder so, nur mit weniger Kacheln.
        const mosaicWorked = await buildHtfMtfLtfMosaic(page).catch((e) => {
            console.warn('[hero-shot] Mosaik-Aufbau (HTF/MTF/LTF) nicht vollstaendig geglueckt, fahre mit dem Bestand fort:', e.message);
            return false;
        });
        console.log(`[hero-shot] Mosaik aufgebaut: ${mosaicWorked}`);

        // Panes wieder schliessen, damit die Chartflaeche dominiert (Auftrag).
        await closePaneIfOpen(page);
        await sleep(500);
        const dismissedFinal = await dismissHealthBanners(page);
        console.log(`[hero-shot] HealthBar-Banner ausgeblendet: login=${dismissedAtLogin} trading=${dismissedAtTrading} final=${dismissedFinal}`);

        // Vor dem Foto: Ehrlichkeitspruefung (keine Fehlerkarte/„nicht
        // eingerichtet"-Banner, kein Geldwert).
        const bodyText = await page.evaluate(() => document.body.innerText);
        const errorBannerHits = ['nicht eingerichtet', 'Fehler beim Laden', 'not configured', 'konnte nicht geladen werden']
            .filter((needle) => bodyText.toLowerCase().includes(needle.toLowerCase()));
        const moneyHits = findMoneyLikeText(bodyText);

        fs.mkdirSync(path.dirname(OUT_FILE), { recursive: true });
        await page.screenshot({ path: OUT_FILE });
        const stat = fs.statSync(OUT_FILE);

        const result = {
            outFile: OUT_FILE,
            fileSizeBytes: stat.size,
            symbol: HERO_SYMBOL,
            errorBannerHits,
            moneyHits,
            consoleErrorsUnknown: filterUnknownConsoleErrors(collector.consoleMessages),
        };
        console.log('[hero-shot] Ergebnis:', JSON.stringify(result, null, 2));
        ctx.writeJson('hero-shot-messwerte', result);

        if (errorBannerHits.length > 0) {
            throw new Error(`[hero-shot] Fehlerkarten-/Banner-Text im Bild gefunden: ${JSON.stringify(errorBannerHits)}`);
        }
        if (moneyHits.length > 0) {
            // Nicht hart abbrechen — die Heuristik (lange Zahlenfolge etc.) kann auf
            // harmlose Werte (Zeitstempel, Symbol-IDs) anschlagen. Befund steht in den
            // Messwerten und wird vor dem Uebernehmen des Bildes von Hand gegengeprueft.
            console.warn(`[hero-shot] BEFUND E-C121 zu pruefen (kein Abbruch): ${JSON.stringify(moneyHits)}`);
        }

        await context.close();
    });
}

main().catch((err) => {
    console.error('[hero-shot] FEHLER:', err);
    process.exitCode = 1;
});
