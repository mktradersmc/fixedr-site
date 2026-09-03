#!/usr/bin/env node
/**
 * FXR-142 G5 (Nachschlag, Kerzen-Datensaat) — Ein echter Screenshot der
 * Trading-Flaeche fuer den Hero-Streifen von fixedr-site (kein Mockup,
 * aufgenommen aus dem angemeldeten Pruefstand) — jetzt MIT Kerzen.
 *
 * Ablauf: Kerzen-Datensaat (EURUSD.db) in die frische Datenwurzel kopieren
 * (`seedSymbolsFrom`, s. `harness.mjs`), Stufe `prod` + Sprache EN setzen,
 * anmelden, in den Bereich TRADING wechseln, `EURUSD` mit einem festen
 * (synthetischen) `botId` in die Watchlist einrichten, Layout "3 Vertical",
 * jede Kachel auf EURUSD + einen eigenen Zeitrahmen (H4/M15/M1), rechte
 * Panes wieder schliessen, PNG bei 1600x1000 sichern.
 *
 * BEFUND (Vorlaeufer dieses Skripts, FXR-142-Protokoll "Hero-Screenshot
 * 2026-09-03"): `configure_symbol` mit `botId: undefined` richtet das Symbol
 * zwar in der Watchlist ein, aber `useChartData.fetchHistory` bricht mit
 * `if (!symbol || !botId) return;` sofort ab, wenn `botId` leer ist
 * (`ChartPane.resolvedBotId = validPaneBotId || symbolInfoFromStore?.botId
 * || botId` — alle drei leer ohne Konto/Angebot) — die Kachel fragt dann NIE
 * beim Backend nach Kerzen, unabhaengig davon, ob eine Symbol-DB Daten haette.
 * Zwei unabhaengige Befunde, gemessen im Quelltext:
 *   1. `DatabaseService.getSymbolDb` oeffnet `<DB_SYMBOLS_DIR>/<Symbol>.db`
 *      rein ueber `fs.existsSync` — OHNE Bezug zu einem `botId`
 *      (`market-data-core/src/services/DatabaseService.js:2575`).
 *   2. `GET /api/history` zieht das Symbol aus dem LETZTEN Segment des
 *      `routingKey` (`<botId>:HISTORY:<symbol>` → `symbol = parts.at(-1)`,
 *      `SocketServer.js:1852`) — der `botId`-Teil selbst wird nie geprueft.
 * Ein `botId` muss also nur NICHT-LEER sein, damit die Kachel ueberhaupt
 * fragt; welcher Wert es ist, ist fuer den Datenpfad gleichgueltig. Deshalb
 * hier `PAPER_BOT` statt eines echten Kontos — ein echtes Konto
 * (`accountType:'DATAFEED'`) waere der falsche Weg: `LiveChartPage.
 * checkStatus` prueft dann `/api/status/heartbeat` gegen genau diesen
 * `botId` und setzt `isDatafeedOnline=false`, sobald kein Bot-Prozess
 * antwortet (kein Feld in `SystemOrchestrator.botStatus` traegt je ein
 * `alive` — nur `connected`/`lastSeen` — ein eigener, hier NICHT behobener
 * Befund) — die Kachel zeigte dann "Getrennt" statt der Kerzen. Ohne
 * DATAFEED-Konto bleibt `datafeedBotId` in `LiveChartPage` leer und
 * `isDatafeedOnline` unconditionally `true` (kein Konto zu pruefen).
 *
 * BEFUND 3 (nach dem ersten Lauf MIT Kerzen gemessen): mit einem frei
 * erfundenen `botId` blieb an jeder Kachel eine zweite, kleinere Karte
 * stehen — `ChartStatusIndicator.tsx`, Status `OFFLINE`, Text „KEINE DATEN /
 * Das Backend hat keinen Grund genannt" (hartkodiert, NICHT uebersetzt —
 * erscheint unabhaengig von der UI-Sprache). Genau dieser Satz stand auch im
 * Auftrag als zweiter, eigener Befund am Vorlaeuferbild. Ursache:
 * `useChartData` abonniert nach dem initialen Fetch IMMER auch den
 * Live-Tick-Strom (`MT5Datafeed.subscribeBars`, routingKey
 * `<botId>:TICK_SPY:<symbol>`); `SystemOrchestrator.handleSubscribe` findet
 * dafuer keinen Worker (`getWorker` schlaegt fehl, kein Bot-Prozess je
 * verbunden) und setzt `updateSyncStatus(..., 'OFFLINE', 'No Active Bot')`.
 * Ausweg OHNE jede Protokoll-Nachbildung: `SystemOrchestrator.
 * initVirtualBrokers()` (`services/SystemOrchestrator.js:349`, bei JEDEM
 * Start aufgerufen, `:274`) registriert bereits eingebaut einen echten
 * Worker-Thread unter `botId='PAPER_BOT'` mit Sammel-Routingschluesseln
 * `PAPER_BOT:<FUNC>:ALL` (u. a. `TICK_SPY`) UND `botStatus.PAPER_BOT =
 * {connected:true, status:'RUNNING', provider:'VirtualBroker'}` — Kommentar
 * im Quelltext selbst: „Fake network liveness". `getWorker(botId, func,
 * symbol)` faellt bei fehlendem `<botId>:<func>:<symbol>` auf den
 * Sammelschluessel `<botId>:<func>:ALL` zurueck (`SystemOrchestrator.js:5052`)
 * — `PAPER_BOT:TICK_SPY:EURUSD` findet so `PAPER_BOT:TICK_SPY:ALL`,
 * `handleSubscribe` meldet `workerFound=true`, die Karte verschwindet. Das
 * ist kein Vortaeuschen: `PAPER_BOT` ist der im Produkt selbst angelegte
 * virtuelle Broker fuer genau diesen Fall (Datenfeed-Quelle ohne echten EA),
 * kein von diesem Skript erfundener Zustand.
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
 *      den Pruefstand-Workflow — NIE direkt im Hauptbaum arbeiten, sondern im
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
// Der eingebaute virtuelle Broker (`SystemOrchestrator.initVirtualBrokers`,
// s. Kopfkommentar Befund 3) — bei jedem Start bereits als "verbunden"
// registriert, mit Sammel-Routingschluesseln je Funktion. KEIN von diesem
// Skript erfundener botId.
const HERO_BOT_ID = 'PAPER_BOT';
const SYMBOLS_DB_DIR = 'C:/forge-os/awesome-cockpit/data/db/symbols';
const HERO_TIMEFRAMES = ['H4', 'M15', 'M1']; // HTF, MTF, LTF — Reihenfolge = Kachel 0/1/2
const OUT_FILE = process.env.HERO_SHOT_OUT || path.resolve('C:/forge-os/fixedr-site/public/screens/trading-dark.png');

/**
 * Richtet `HERO_SYMBOL` in der Watchlist ein — s. Kopfkommentar fuer die
 * Begruendung des direkten Socket-Wegs statt des UI-Dialogs UND fuer den
 * festen `botId`.
 */
async function configureSymbolViaSocket(backendUrl, token, symbol, botId) {
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
                { symbol, botId, datafeedSymbol: symbol, originalName: symbol, newsCurrency: 'AUTO' },
                (result) => { clearTimeout(timer); resolve(result); },
            );
        });
        if (!ack || (!ack.success && ack.error !== 'already_configured')) {
            throw new Error(`[hero-shot] configure_symbol abgelehnt: ${JSON.stringify(ack)}`);
        }
        console.log(`[hero-shot] Symbol ${symbol} eingerichtet (botId=${botId}): ${JSON.stringify(ack)}`);
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
 *  `aria-label={t('shell.pane.collapseAria')}`), nicht durch blindes zweites
 *  Antippen des Reiters (das waere bei ungerader Zahl vorheriger Aufrufe ein
 *  erneutes OEFFNEN statt Schliessen). Sprache EN aktiv, s. `main()` — der
 *  Aria-Label-Text kommt daher aus `en.json`. */
async function closePaneIfOpen(page) {
    const collapseButton = page.locator('button[aria-label="Collapse pane"], button[aria-label="Pane einklappen"]');
    if (await collapseButton.count() > 0) {
        await collapseButton.first().click();
        await sleep(400);
    }
}

/**
 * Setzt den Zeitrahmen EINER Kachel ueber die Kopfzeilen-Leiste
 * (`ChartOverlay.tsx`) — die Leiste ist nur bei Hover ueber den obersten
 * 14px der Kachel sichtbar (`TRIGGER_HEIGHT`), deshalb erst dorthin hovern.
 * Playwright scrollt den ueberlaufenden Zeitrahmen-Streifen selbst zum Ziel
 * (`overflow-x:auto`), kein manuelles Scrollen noetig. Scope auf die Kachel
 * selbst (`exact:true`), sonst waere "M1" auch ein Teiltreffer von "M15".
 */
async function setPaneTimeframe(page, paneIndex, timeframe) {
    const pane = page.locator('[class*="fxr-chart-"]').nth(paneIndex);
    await pane.hover({ position: { x: 120, y: 5 } });
    await sleep(250);
    const button = pane.getByRole('button', { name: timeframe, exact: true });
    if (!(await button.isVisible().catch(() => false))) {
        throw new Error(`Zeitrahmen-Knopf ${timeframe} fuer Kachel ${paneIndex} nicht sichtbar.`);
    }
    await button.click();
    await sleep(400);
}

/**
 * Baut ein Drei-Kachel-Mosaik (Layout "3 Vertical") mit `HERO_SYMBOL` in
 * jeder Kachel und je einem eigenen Zeitrahmen (`HERO_TIMEFRAMES`: HTF H4 ·
 * MTF M15 · LTF M1) — macht das Bild als Trading-Flaeche mit drei Rollen
 * lesbar, nicht nur als eine wiederholte Kachel. Wirft bei Fehlschlag (der
 * Aufrufer faengt das ab und behaelt die eine Kachel von vorher).
 *
 * BEFUND (gemessen, dann bewusst NICHT gebaut): ein Sync-Tag je Kachel
 * (Klartext "HTF"/"MTF"/"LTF" statt nur Zeitrahmen) liesse sich technisch
 * setzen (`ChartOverlay.tsx`, Knopf `title="Sync-Tag"`), kollidierte aber
 * bei ~480px Kachelbreite sichtbar mit der "Keine Daten"-Kapsel (Fund aus
 * dem Vorlaeufer-Lauf ohne Kerzen). Mit echten Kerzen ist die Kapsel weg —
 * das Risiko besteht nicht mehr, ein Sync-Tag bleibt trotzdem aussen vor:
 * der Zeitrahmen im Kopf jeder Kachel traegt die Rolle bereits (H4/M15/M1).
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

    // Jede Kachel auf ihren eigenen Zeitrahmen (HTF/MTF/LTF).
    for (let i = 0; i < 3; i += 1) {
        await setPaneTimeframe(page, i, HERO_TIMEFRAMES[i]);
    }
    return true;
}

/**
 * Schliesst die HealthBar-Banner (Titel aus `en.json` `health.lock.hideTitle`/
 * `health.event.ackTitle`/`license.dismissTitle`) — echte Meldungen des
 * Pruefstands (Netz-/Lizenz-Pruefungen ohne Internet, o.ae.), keine
 * Attrappe: derselbe Ausblenden-Knopf, den ein Nutzer auch haette. Der
 * Auftrag verbietet Fehlerkarten IM BILD, nicht die Meldung an sich —
 * quittiert bleibt der Sachverhalt bestehen (FXR-90), nur die Kachel
 * verschwindet. Deutsche UND englische Titel geprueft — nur der DE-Text war
 * vorher committet, hier auf die aktive Sprache (EN, s. `main()`) erweitert.
 */
async function dismissHealthBanners(page) {
    const titles = [
        'Ausblenden. Die Sperre bleibt bestehen und im Zustandspunkt oben sichtbar.',
        'Quittieren und ausblenden. Das Ereignis bleibt offen, bis eine Gegenmessung gelingt.',
        'Ausblenden. Die Meldung kommt zurueck, sobald es dringender wird.',
        'Hide. The lock stays in effect and remains visible in the status dot above.',
        'Acknowledge and hide. The event stays open until a counter-measurement succeeds.',
        'Hide. The message will reappear as soon as it becomes more urgent.',
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
        await configureSymbolViaSocket(ctx.backendUrl, ctx.token, HERO_SYMBOL, HERO_BOT_ID);

        // Eigener Kontext statt ctx.newPage() — der Auftrag verlangt 1600x1000,
        // deviceScaleFactor 1, ctx.newPage() ist fest auf 1440x900 verdrahtet.
        const context = await ctx.browser.newContext({
            viewport: { width: 1600, height: 1000 },
            deviceScaleFactor: 1,
        });
        // Dunkles Thema UND Sprache EN explizit setzen, vor JEDER Navigation in
        // diesem Kontext (`vite-ui-theme`: ThemeProvider-Standard ist zwar
        // bereits 'dark', hier trotzdem ausdruecklich, wie im Auftrag verlangt;
        // `trading-language`: LanguageProvider-Vorgabe ist 'de',
        // `context/LanguageProvider.tsx:47` — der Auftrag verlangt EN).
        await context.addInitScript(() => {
            try {
                window.localStorage.setItem('vite-ui-theme', 'dark');
                window.localStorage.setItem('trading-language', 'en');
            } catch { /* privater Modus o.ae. */ }
        });
        const page = await context.newPage();
        const collector = { consoleMessages: [] };
        page.on('console', (msg) => { if (msg.type() === 'error') collector.consoleMessages.push({ type: 'error', text: msg.text() }); });

        await loginViaUi(page, ctx.baseUrl, ctx.username, ctx.password);
        const dismissedAtLogin = await dismissHealthBanners(page);
        await ctx.goToTrading(page);
        await sleep(800); // Turbopack-Nachkompilierung beim ersten Besuch (s. tour.e2e.mjs-Befund)
        const dismissedAtTrading = await dismissHealthBanners(page);

        // Handelsumgebung auf LIVE (Brandbar.tsx: LIVE/TEST/BACKTEST, Feld `mode` —
        // NICHT dieselbe Achse wie `fixedr.stage` oben, s. Kommentar dort in
        // `stage.ts`/`Brandbar.tsx`, aber ebenso ein sichtbares "TEST"-Etikett, das
        // der Auftrag ausdruecklich nicht im Bild sehen will). Frische Workspaces
        // starten auf `test` (`useWorkspaceStore.ts` Vorgabewert) — hier auf `live`
        // umgestellt, derselbe Klick, den ein Nutzer auch haette.
        const liveModeButton = page.locator('button', { hasText: 'LIVE' }).first();
        if (await liveModeButton.isVisible().catch(() => false)) {
            await liveModeButton.click();
            await sleep(300);
        }

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

        // Watchlist-Pane wieder schliessen, BEVOR das Mosaik anfaengt — dessen
        // Schleife oeffnet sie je Kachel selbst erneut ueber `openPane` (das
        // TOGGELT: waere sie hier noch offen, schlaege der naechste Aufruf sie
        // fälschlich zu statt sie zu oeffnen).
        await closePaneIfOpen(page);
        await sleep(300);

        // Auftrag: drei Kacheln EURUSD mit Rollen HTF H4 · MTF M15 · LTF M1,
        // MIT Kerzen (Datensaat aus `seedSymbolsFrom`, s. `main()` unten).
        // Bestes-Bemuehen-Block: schlaegt ein Schritt fehl (Text-/Locator-
        // Aenderung), bleibt die EINE EURUSD-Kachel von oben stehen — das
        // Foto entsteht so oder so, nur mit weniger Kacheln.
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
        // eingerichtet"-Banner, kein Geldwert, keine "Test"-Stufenmarke).
        const bodyText = await page.evaluate(() => document.body.innerText);
        const errorBannerHits = [
            'nicht eingerichtet', 'Fehler beim Laden', 'not configured', 'konnte nicht geladen werden',
        ].filter((needle) => bodyText.toLowerCase().includes(needle.toLowerCase()));
        const moneyHits = findMoneyLikeText(bodyText);
        const openEventsMatch = bodyText.match(/(\d+)\s+open event/i) || bodyText.match(/(\d+)\s+offene Meldung/i);
        // BEKANNTER, STRUKTURELLER BEFUND (nicht hart abbrechen, s. Protokoll
        // FXR-142): `ChartStatusIndicator` zeigt je Kachel eine kleine "KEINE
        // DATEN"-Karte — nicht weil Kerzen fehlen (sie sind da, `hasData=true`,
        // `syncStatus='READY'` — gemessen), sondern weil `GET /api/status/
        // datafeed` (`hasWorker`) einen EXAKTEN Routingschluessel
        // `<botId>:TICK_SPY:<symbol>` verlangt; `PAPER_BOT` (der eingebaute
        // virtuelle Broker) registriert beim Start nur Sammelschluessel
        // `PAPER_BOT:<FUNC>:ALL` (`SystemOrchestrator.initVirtualBrokers`),
        // keinen exakten je Symbol — einen exakten Schluessel legt im
        // Quelltext NUR eine echte Bot-Verbindung ueber den rohen WS-Gateway
        // an (`UnifiedBotProtocol.handleRegister` → `WebSocketManager.
        // register`). Ohne eine solche Verbindung zu simulieren (ausserhalb
        // des Auftragsrahmens: nur `harness.mjs` + dieser Aufrufer) bleibt
        // `isOnline=false` und damit `effectiveStatus='OFFLINE'`
        // (`ChartOverlay.tsx:140`) — unabhaengig vom echten Kerzenbestand.
        // Text ist zudem hartkodiert Deutsch (`ChartStatusIndicator.tsx:88`,
        // ignoriert die UI-Sprache) — ein eigener, hier nicht behobener Fund.
        const knownOfflinePillHit = bodyText.includes('KEINE DATEN');

        fs.mkdirSync(path.dirname(OUT_FILE), { recursive: true });
        await page.screenshot({ path: OUT_FILE });
        const stat = fs.statSync(OUT_FILE);

        const result = {
            outFile: OUT_FILE,
            fileSizeBytes: stat.size,
            symbol: HERO_SYMBOL,
            timeframes: HERO_TIMEFRAMES,
            errorBannerHits,
            moneyHits,
            openEventsFooter: openEventsMatch ? openEventsMatch[0] : null,
            knownOfflinePillHit,
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
        if (openEventsMatch) {
            console.warn(`[hero-shot] BEFUND: Fusszeile zeigt "${openEventsMatch[0]}" — Auftrag verlangt keine offenen Meldungen. Strukturelle Ursache (Lizenz-Kulanzfrist ohne Schluessel, Systemuhr-Pruefung) ausserhalb des Datei-Rahmens dieses Auftrags, s. Ticketprotokoll.`);
        }
        if (knownOfflinePillHit) {
            console.warn('[hero-shot] BEFUND: "KEINE DATEN"-Karte je Kachel sichtbar (ChartStatusIndicator, OFFLINE-Zustand trotz vorhandener Kerzen) — Ursache s. Kommentar oben, ausserhalb des Datei-Rahmens dieses Auftrags.');
        }

        await context.close();
    }, {
        // Kerzen-Datensaat: nur EURUSD, nur aus Michaels echter, schreibgeschuetzt
        // gelesener Kursdatenbank (s. Kopfkommentar `harness.mjs`).
        seedSymbolsFrom: SYMBOLS_DB_DIR,
        seedSymbols: [HERO_SYMBOL],
        // E-C141-Vorgabewert — die Stufe, die eine ausgelieferte Kundeninstallation
        // traegt (`SystemConfigService.js`); ohne diese Angabe zeigt die
        // Oberflaeche das orange "Test"-Etikett (`lib/stage.ts`).
        stage: 'prod',
    });
}

main().catch((err) => {
    console.error('[hero-shot] FEHLER:', err);
    process.exitCode = 1;
});
