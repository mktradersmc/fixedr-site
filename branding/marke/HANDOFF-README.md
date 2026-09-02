# Handoff: FixedR — Rahmen der Anwendung (Runde 7)

**Ersetzt die erste Fassung dieses Ordners.** Neu sind: Marke in der Seitenleiste,
durchgehendes Band aus Leiste, Kopfband und Fusszeile, Umgebungsumschalter in der Mitte,
Sprachumschalter, Statusleiste unten, und das Logo als Vektor.

## Was in diesem Durchgang umzusetzen ist

Nur der **Rahmen**. Charts, Trades-Tabelle, Konten und Zeichenwerkzeuge sind gestaltet
und im Prototyp zu sehen, aber der Auftrag dieser Runde ist die Huelle: Seitenleiste,
Kopfband, Fusszeile, Marke, Merkmale. Wer den Rest mitnimmt, gern — die Beschreibung
dazu steht in der ersten Fassung dieses Dokuments (Abschnitte 5 bis 9), die inhaltlich
weiter gilt.

## Ueber die Design-Dateien

Die \`.dc.html\`-Dateien sind **Design-Referenzen in HTML** — Prototypen, die Aussehen
und Verhalten zeigen. Sie sind **kein Produktionscode zum Kopieren**. Nachzubauen ist in
der bestehenden Umgebung: **Next.js (App Router), React, Tailwind v4**.

- Merkmale aus \`merkmale.css\` in den \`@theme\`-Block von \`src/app/globals.css\`.
  Namen beibehalten, nur ergaenzen.
- Klassennamen und Bezeichner **englisch**, sichtbare Texte **deutsch** (E-C142).
- Icons: **lucide-react**, derselbe Satz wie im Bestand. Keine eigenen SVGs zeichnen.
- Charts bleiben **lightweight-charts** wie bisher. Die Kerzen im Prototyp sind
  gezeichnete Platzhalter und werden **nicht** nachgebaut.

**Fidelity: hi-fi.** Farben, Groessen, Abstaende und Kanten sind final gemeint.

## Die Kanten-Regel

| Kante | Frage | Inhalt |
|---|---|---|
| links, ganze Hoehe | Wer sind wir, und wo bin ich? | Marke, dann Trading · Metrik · Journal, unten Einrichtung |
| oben | In welcher Umgebung arbeite ich? | Umgebung (Mitte), Sprache, Darstellung, Konto (rechts) |
| unten, ganze Breite | Laeuft alles? | Verbindung, Lizenz, Haftungssatz, Zeitzone, Version |
| links, zweite Leiste | Was male ich auf den Chart? | Zeichenwerkzeuge |
| ueber dem Chart | Woran arbeite ich? | Arbeitsbereichs-Reiter, Chart-Steuerung |
| in jeder Kachel | Was zeigt *dieser* Chart? | Symbol, Zeitrahmen, Vorlage, Tag |
| rechts | Womit arbeite ich? | Konten · Watchlist · Trade-Doku |
| Mitte unten | Was ist passiert? | Trades · Historie · Alarme · Rueckblick |

## Das durchgehende Band — der Kern dieser Runde

Seitenleiste, Kopfband und Fusszeile sind **eine Flaeche** (\`--color-surface\`). Die
Trennlinien laufen so, dass sie sich in **Ecken treffen statt sich zu kreuzen**:

- Die **senkrechte** Kante der Seitenleiste beginnt an der Unterkante des Kopfbands und
  endet an der Oberkante der Fusszeile.
- Die **waagerechte** Kante des Kopfbands beginnt an der rechten Kante der Seitenleiste.
- Die **waagerechte** Kante der Fusszeile ebenso.

Umzusetzen ist das **nicht** mit \`border-right\` auf der Leiste — sonst laeuft die Linie
durch Markenkopf und Fusszeile. Stattdessen ein eigenes 1-px-Element in der Leiste:

\`\`\`
position: absolute; right: 0; width: 1px;
top: var(--brandbar-height); bottom: var(--footer-height);
background: var(--color-border);
\`\`\`

Der Markenkopf darf dadurch beliebig hoch werden, ohne dass die Ecke verrutscht.

## 1. Seitenleiste (\`--rail-width: 96px\`)

Ganze Hoehe, \`--color-surface\`, **keine** eigene Randlinie (siehe oben).

### Markenkopf
\`min-height: var(--brandbar-height)\`, Inhalt mittig, \`padding: 7px 0\`, Abstand 4 px.
Drei Fassungen, im Prototyp ueber das Merkmal \`logoKopf\` umschaltbar:

| Fassung | Inhalt | Bemerkung |
|---|---|---|
| \`untertitel\` (Standard) | Bildmarke 26 px, Wortmarke 58 px, Untertitel zweizeilig | Kopf reicht ~26 px unter die Kante des Kopfbands |
| \`voll\` | Bildmarke 21 px, Wortmarke 54 px | passt genau in die Hoehe des Kopfbands |
| \`bild\` | Bildmarke 32 px | knappste Fassung |

Untertitel: \`--font-mono\`, 7 px, \`font-weight: 500\`, \`letter-spacing: .13em\`,
\`line-height: 1.6\`, zentriert, \`--color-text-faint\`, Umbruch nach „TRADE CALM.".

**Keine Trennlinie** zwischen Markenkopf und Navigation.

### Navigation
\`padding: var(--space-3) var(--space-2) 0\`, Abstand 2 px. Je Eintrag ganze Breite,
\`padding: 9px 0\`, \`--radius-md\`, Symbol 19 px ueber Wort in 10 px \`font-weight: 500\`:

- Trading — lucide \`candlestick-chart\`
- Metrik — lucide \`gauge\`
- Journal — lucide \`notebook-pen\`

**Ausgewaehlter Eintrag:** Flaeche \`--brand-soft\`, Schrift und Symbol \`--brand\`, dazu
links ein Balken ueber die **ganze Hoehe** des Eintrags, der oben und unten spitz
zulaeuft:

\`\`\`
position: absolute; left: 0; top: 0; bottom: 0; width: 3px;
background: var(--brand);
clip-path: polygon(100% 0, 100% 100%, 0 82%, 0 18%);
\`\`\`
(Der Eintrag braucht \`position: relative; overflow: hidden\`.)

Inaktiv: \`--color-text-faint\`, kein Grund.

### Einrichtung
Unten abgesetzt (\`margin: auto var(--space-2) 8px\`), gleiche Form wie ein
Navigationseintrag, lucide \`settings\` 16 px. Die 8 px sind **kein Zufallswert**: sie
setzen die Unterkante der Beschriftung auf dieselbe Hoehe wie den Text in der Fusszeile.

## 2. Kopfband (\`--brandbar-height: 56px\`)

\`--color-surface\`, 1 px Unterkante, \`padding: 0 var(--space-3)\`. Drei Zonen:
links ein Platzhalter mit \`flex: 1\`, in der Mitte der Umgebungsumschalter, rechts eine
Gruppe mit \`flex: 1\` und \`justify-content: flex-end\`. So bleibt die Umgebung mittig,
unabhaengig davon, was rechts steht.

### Umgebungsumschalter (Mitte)
Behaelter \`--color-surface-raised\`, \`--radius-md\`, 3 px innen, 2 px Abstand.
Aktiv: gefuellt \`--color-accent\`, Schrift \`--color-accent-contrast\`,
\`font-weight: 700\`, \`--text-2xs\`, \`letter-spacing: .09em\`, Hoehe 24 px,
\`--radius-sm\`. Inaktiv: reiner Text \`--color-text-faint\`.

Beschriftungen: **LIVE · TEST · BACKTEST**.

⚠️ **E-C146:** Die Umgebung wird **nie allein ueber Farbe** unterschieden. Die
Beschriftung ist permanent sichtbar, und bei TEST und BACKTEST liegt zusaetzlich ein
umlaufender 2-px-Innenrahmen in der Modusfarbe um **jede Chartflaeche**
(\`box-shadow: inset 0 0 0 2px <modusfarbe>\`; Live = Akzent, Test = Warnfarbe,
Backtest = Negativfarbe).

### Rechts
1. **Sprachumschalter** — Behaelter \`--color-surface-raised\`, \`--radius-sm\`, 2 px
   innen, 1 px Abstand. Je Sprache Hoehe 20 px, \`padding: 0 7px\`, \`--font-mono\`,
   \`--text-2xs\`, \`letter-spacing: .04em\`. Aktiv: Grund \`--color-surface\`, Schrift
   \`--color-text\`, \`font-weight: 600\`. Inaktiv: \`--color-text-faint\`.
   Jetzt **DE | EN**; vorgesehen FR, IT, ES.
   **Ab vier Sprachen** gehoert der Umschalter in ein Aufklappfeld, das nur die aktive
   Sprache plus lucide \`chevron-down\` zeigt — sonst frisst er die Breite des Kopfbands.
2. **Hell / Dunkel** — 26 px, lucide \`sun\` bzw. \`moon\`, \`--color-text-faint\`.
3. **Konto** — 26 px Kreis, \`--color-accent-soft\`, 1 px \`--color-accent-line\`,
   Initiale in \`--color-accent\`. Klick oeffnet das Einrichtungsmenue (Aufklappfeld,
   274 px, \`--shadow-flyout\`, \`z-index: 140\`): Konto & Anmeldung, Datenquellen,
   Symbolzuordnung, Verteilung auf Konten, Challenge-Typen, Datencenter, Mobilgeraet
   verbinden (QR), Darstellung & System, Abmelden.

**Nicht mehr im Kopfband:** Zustandsanzeige, Lizenzzaehler, Wortmarke, Menue-Knopf,
Vollbild. Zustand und Lizenz stehen in der Fusszeile, die Marke in der Seitenleiste,
Maximieren in der Chart-Steuerung.

## 3. Fusszeile (\`--footer-height: 28px\`)

**Ueber die ganze Breite** — von der rechten Kante der Seitenleiste bis zum rechten Rand,
also **auch unter der Kontenleiste hindurch**. Technisch heisst das: die Fusszeile ist
**kein Kind des Mittelbereichs**, sondern ein Geschwister der Rumpfzeile.

\`--color-surface\`, 1 px Oberkante, \`padding: 0 var(--space-3)\`, \`--text-2xs\`,
\`--color-text-faint\`, Abstand \`--space-4\`, Trennstriche 1×12 px in
\`--color-border\`. Von links:

1. **Verbindung** — 6 px Punkt plus Klartext, Schrift \`--color-text-muted\`.
   In Ordnung: \`--color-positive\`, Text „In Ordnung · vor 3 s".
   Handelssperre: \`--color-warning\`. Nicht verbunden: \`--color-negative\`.
   Der Punkt traegt einen 3-px-Ring in 18 % derselben Farbe.
2. **Lizenz 41 Tage**
3. **„Netz, kein Garant — die Anwendung warnt und sperrt neue Einstiege. Verluste
   verhindert sie nicht."** — wortwoertlich so.
4. Rechts: **New York · UTC−4** und **v2.1** (\`--font-mono\`).

Bei Stoerung erscheint zusaetzlich das Band (siehe naechster Abschnitt) — die Fusszeile
ist die Dauerauskunft, das Band der Anlass.

## 4. Meldungen — zwei Orte

**Global** (betrifft die ganze Anwendung, z. B. neue Version): eigene Zeile **direkt unter
dem Kopfband**, \`--color-accent-soft\`, 1 px Unterkante \`--color-accent-line\`, lucide
\`download\`, Titel plus Erlaeuterung plus „Jetzt neu starten" / „Spaeter".

**Konto- oder handelsbezogen** (Handelssperre, Verbindungsverlust): eigene Zeile **unter
der Chart-Steuerung, ueber der Chartflaeche**, volle Breite des Mittelbereichs. Grund
\`--color-warning-soft\` bzw. \`--color-negative-soft\`. Aufbau: Icon, **Kontoname**
(fett), **verbindlicher Satz**, Ausloeser, rechts „Details" und „Quittieren".

⚠️ **Leitplanke 2 — verbindlich:** Der Text sagt immer mit, was weiterhin geht. Der Satz
*„Keine neuen Einstiege — Schliessen und Verlustgrenze aendern bleiben moeglich."* steht
als eigenes, **unverkuerzbares** Element (\`white-space: nowrap; flex-shrink: 0\`). Nur
der Ausloeser dahinter darf mit Auslassungspunkten kuerzen. Keine Formulierung, die ein
Versprechen macht.

## 5. Marke

### Logodateien (\`branding/\`)
Alle als **SVG**, aus der Vorlage nachgezeichnet — Schrift als Pfade, also unabhaengig
von geladenen Schriften.

| Datei | Wohin |
|---|---|
| \`logo-full-on-light.svg\` | ganze Aufstellung mit Trennlinie und Untertitel — **Kopfleiste der Website** |
| \`logo-full-on-dark.svg\` | dieselbe auf dunkler Flaeche |
| \`mark-on-dark.svg\` + \`wordmark-plain-on-dark.svg\` | **Seitenleiste der Anwendung**, dunkler Modus |
| \`mark-on-light.svg\` + \`wordmark-plain-on-light.svg\` | dieselbe, heller Modus |
| \`mark-on-light.svg\` / \`mark-on-dark.svg\` | Favicon, Fusszeilen, kleine Stellen |
| \`wordmark-on-{light,dark}.svg\` | Wortmarke mit Untertitel, ohne Bildmarke |
| \`logo-full-themed.svg\`, \`mark-themed.svg\` | nehmen \`currentColor\` und \`var(--brand)\` des Umfelds an — **fuer den Einbau als Inline-SVG**; dann braucht es keine Fassungen |
| alles mit \`-green-\` | Reserve, falls die Markenfarbe je wechselt. Beim Einbau ignorieren |

**Zur Benennung:** \`on-light\` / \`on-dark\` meint **den Grund, auf dem das Logo liegt** —
nicht seine eigene Farbe. \`on-light\` gehoert auf Weiss und traegt das F in Tinte
(\`#0b1626\`), \`on-dark\` auf die dunkle Flaeche und traegt es in Weiss. Der Untertitel ist
in beiden Faellen grau, nicht in Textfarbe.

**Einschraenkung:** die Pfade stammen aus einem 1774 px breiten Bitmap und sind auf etwa
ein Pixel genau. Fuer Bildschirm und Druck reicht das. Fuer Grossformat gehoeren sie
einmal in einem Vektorprogramm nachgezogen — dann mit diesen Dateien als Grundlage.

### Markenfarbe
Ein Satz von vier Werten, an **einer** Stelle umschaltbar:

| Merkmal | Hell | Dunkel |
|---|---|---|
| \`--brand\` | \`#0a62cf\` | \`#2e86f6\` |
| \`--brand-soft\` | \`#e4effb\` | \`#0a1d33\` |
| \`--brand-line\` | \`#b3d3f4\` | \`#1b3f66\` |
| \`--brand-ink\` | \`#ffffff\` | \`#ffffff\` |

Die Bedienfarbe \`--color-accent\` traegt **denselben** Blauton — es gibt in der
Anwendung genau ein Blau. Gruen und Rot bleiben der Bewertung vorbehalten.

Als Alternative liegt Gruen bereit (\`#00a37c\` / \`#00d4a2\`). Wenn sie je gezogen wird:
Gruen heisst im Chart Gewinn, also muss dann die Bewertungsfarbe neu gedacht werden.
Deshalb ist Blau die Wahl.

## Verbindliche Leitplanken

1. **Keine Geldbetraege in Auswertungsanzeigen.** Kein Waehrungszeichen, kein Umschalter.
   Nur % und R. Ausnahme: Eingabefelder bei der Einrichtung.
2. **Wortlaut bei Schutzfunktionen: „Netz, kein Garant."** Der Satz, was weiterhin geht,
   ist unverkuerzbar.
3. **Nur Prop-Firmen-Konten.** Der Hinweis beim Anlegen eines Kontos bleibt.
4. **Umgebung nie allein ueber Farbe** — Beschriftung plus umlaufender Rahmen.
5. **Die Notfallflaeche bleibt getrennt.** Eigene minimale Seite, nicht integrieren.

## Schrift

- **Geist** (400/500/600/700) fuer die Flaeche
- **Geist Mono** (400/500/600) fuer **jede Zahl**, mit
  \`font-variant-numeric: tabular-nums\` auf der Wurzel
- Der Bestand laedt Geist bereits ueber \`next/font\`.

## Noch nicht gestaltet

Metrik, Journal, die Einrichtungsansichten hinter dem Kontomenue, die Dialoge (Konto
anlegen, Alarm anlegen, Indikator-Einstellungen, Auftragsbestaetigung), die Zustaende
**Auftrag wird ausgefuehrt / bestaetigt / unbestaetigt / abgelehnt** (der Bestand fuehrt
dafuer \`ConfirmationBadge\` in \`TradesPanel.tsx\`), sowie leer / laedt / Fehler fuer
jede Liste.

## Dateien in diesem Buendel

| Datei | Inhalt |
|---|---|
| \`README.md\` | dieses Dokument |
| \`merkmale.css\` | die Merkmale, fertig fuer \`@theme\` |
| \`FixedRFlaeche.dc.html\` | die Flaeche, alle Zustaende ueber Merkmale schaltbar |
| \`FixedR Gestaltung.dc.html\` | Vergleichsansicht aller Runden |
| \`FixedR Webauftritt.dc.html\` | die Startseite in der neuen Marke |
| \`branding/\` | die Logodateien |
| \`support.js\` | Laufzeit der Prototypen (nicht ins Produkt uebernehmen) |
| \`uebergabe-an-design.md\` | die urspruengliche Beschreibung |

**Merkmale von \`FixedRFlaeche\`** — so erreicht man die Zustaende:
\`theme\` dark|light · \`markeFarbe\` blau|gruen · \`logoKopf\` untertitel|voll|bild ·
\`sprachen\` z. B. \`DE,EN\` · \`modus\` live|test|backtest ·
\`zustand\` ok|sperre|getrennt|laedt|version · \`werkzeugAuf\` ''|linien|prognose|magnet

Zum Ansehen: \`FixedR Gestaltung.dc.html\` im Browser oeffnen.

## Quellen im Bestand, gegen die gebaut wurde

| Bereich | Datei |
|---|---|
| Flaeche und Modus-Umschalter | \`src/components/workspaces/WorkspaceShell.tsx\` |
| Kachel, Indikator-Legende | \`src/components/workspaces/ChartPane.tsx\` |
| Kachelkopfzeile, Zeitrahmen, PLACE ORDER | \`src/components/workspaces/ChartOverlay.tsx\` |
| Zeichenwerkzeuge | \`src/components/workspaces/DrawingSidebar.tsx\` |
| Arbeitsbereichs-Reiter | \`src/components/workspaces/WorkspaceTabs.tsx\` |
| Trades-Tabelle, Zustandsmarken | \`src/components/trades/TradesPanel.tsx\` |
| Indikatornamen | \`src/components/charts/indicators/index.ts\` |
| Merkmale heute | \`src/app/globals.css\` |
| Seitenrahmen | \`src/components/live/LiveChartPage.tsx\` |
