# export-web-v6 — Startseite mit rotem Faden, Manifesto, Waitlist, Banner und acht Feature-Seiten

Zwölf eigenständige HTML-Dateien, offline lauffähig. Zwei Quellen:
`FixedR Webauftritt v4.dc.html` (Home, Manifesto, Waitlist) und `FixedR Produktseiten.dc.html`
(Banner + acht Seiten unter /product/). Kopfleiste, Banner und Fußzeile sind überall identisch.

## Was sich gegenüber v5 ändert (alle Seiten)
- **Rhythmus:** Akt-Abstände 72 px oben / 64 px unten (vorher 80–96). Kein `border-block` mehr
  zwischen Abschnitten; helle Flächen (`--bg-alt`) sind gerundete Bänder: `border-radius:12px; margin:0 16px`.
- **Radien (revidiert):** helle Bänder 12 px, Bühne / Bildkarten / Pricing-Karten 10 px, innere Kacheln und
  Kalenderzellen 8 px, Knöpfe und Felder 8 px, Kopfleisten-Knopf 6 px, Chips 5 px. Keine Pillen.
- **Typografie:** H1 56–64 px und H2 46 px in Gewicht **500** (vorher 600), `letter-spacing:-.03…-.035em`.
- **Banner:** nicht mehr Vollbreite — schwebende Karte innerhalb 1200 px, `border-radius:0 0 10px 10px`,
  Rahmen `--ink-line-2`, Innenabstand 20/22; Lane-Symbol im Kästchen (28 px, Radius 7), Punkte Radius 8.
- **Reveal:** Elemente mit `data-reveal` starten `opacity:0; translateY(28px)` und blenden per
  IntersectionObserver (`rootMargin: 0 0 -12%`) ein, Übergang `.8s ease`. Elemente im ersten Viewport
  bleiben sofort sichtbar.

## Home (Home.html) — Reihenfolge
1. **Hero** — Zweispalter, Bild rechts (Film-Schleier beim Überfahren), Mono-Zeile statt Pill, H1 64/500.
2. **Roter Faden 01–04** — vier Kacheln (`pillars`, unverändert), Radius 10, ragen 36 px in den Hero
   (`transform:translateY(-36px)`), Grid `repeat(4,1fr) gap 14`. Klick springt weich zum Akt
   (`[data-akt]`, `scrollTo` mit Offset 80).
3. **01 · The R view** — Einleitung links sticky (`top:120px`), rechts drei Regeln als Liste mit
   Nummern im Kreis (56 px, Rahmen `--brand-line`) und Haarlinien. Karten entfallen.
4. **02 · Safety guard** — Scroll-Bühne: links vier Schritte (`min-height:46vh`, inaktive `opacity:.28`),
   rechts sticky Bühne 500 px (`top:110px`, Radius 10, Tinte, Raster-Hintergrund). Aktiver Schritt per
   IntersectionObserver `rootMargin:-40% 0 -50%`; Lagen wechseln mit Opacity + 28 px Versatz, `.55s`.
   Inhalte: Verteilung → Timeframes → Payout paused → Monat in R. Fortschritt oben rechts als vier Punkte.
5. **03 · Backtest / 04 · Journal** — Zweispalter, je Bildkarte 240 px (Replay mit „FUTURE HIDDEN";
   Plan vs. Outcome), Eyebrow, H2 34/500, ein Absatz. Texte aus den Produktseiten.
6. **Pricing** — drei Karten Radius 10, Gap 14, Advanced auf Tinte mit Schatten; Beträge €19/39/69,
   Hinweis „Vorschlag" bleibt.
7. **What's on the screen + Founders circle** — eine dunkle Fläche, These links/rechts, darunter
   Haarlinie und Founders mit Feld + Knopf.
8. Fußzeile unverändert.

Entfallen: Kennzahlenband, die drei Konto-Karten, „These" als eigener Abschnitt, Founders-Karte mit App-Ausschnitt.

## Manifesto / Methodology / Trust / FAQ / Blog
Alle Textseiten im 1200er-Raster wie die übrigen Seiten. Kopfband linksbündig (Eyebrow, H1 56/500 `max-width:20ch`,
optional Lede). Darunter Zweispalter `minmax(0,.9fr) minmax(0,1.6fr)`, Gap 96: links sticky Randspalte
(`top:120px`; Seitenname in Mono, Haarlinie, Lesezeit), rechts die Lesespalte (17 px / 1.7, H2 28/500).
- **Methodology:** vier Fragen als Liste mit Nummernkreisen (40 px), drei Bedingungen als Kacheln (Radius 10, `--bg-alt`).
- **Trust:** „Stays / Leaves" als Kartenpaar (Tinte / hell) in gerundetem Band, dann vier Karten mit Reifegrad-Chip
  (BUILT = `--brand-soft`/`--brand`, PLANNED = gestrichelt, `--faint`), danach Langtext. Reifegrad aus `reifegrad.ts`.
- **FAQ:** Akkordeon mit Haarlinien, Frage 20/500, Pfeil im Kreis (30 px, dreht 180°), erste Frage offen, eine offen zugleich.
- **Blog:** Kartenraster 3 Spalten, Gap 14, Radius 10; neuester Beitrag `grid-column:span 2` auf `--bg-alt`, Titel 30 statt 21.
- **Blog Post (Vorlage `[...slug].astro`, Beispiel trade-in-r):** Kopfband mit Pfad „Blog / Datum", H1 52/500 `max-width:22ch`,
  `description` als Lede. Zweispalter wie oben; links sticky „In this post" — Inhaltsverzeichnis aus den H2 (Mono-Nummer + Titel,
  Sprung mit Offset 100), Lesezeit. Rechts: erster Absatz als Lead (19 px, `--text`), Absätze 17/1.7 `--muted`, H2 28/500.
  Zwei Block-Typen zusätzlich zum Markdown, als Container-Direktiven vorgesehen: `:::r` → drei Tinte-Kacheln (Label Mono 10,
  Wert Display 26 in `--brand-on-ink`, Zeile 12) und `>` Blockquote → Display 22/500 auf `--bg-alt`, Radius 10.
  Fuß: Haarlinie, „← All posts · Join the FixedR waitlist", dann „Keep reading" mit zwei weiteren Beiträgen (gerundetes Band).
- **Waitlist:** Karte Radius 10, Feld und Knopf 8 px, `min-height:560px`.

## Feature-Seiten (product/*.html)
Kopfband 64/56, H1 54/500, Lane-Symbol in Kachel 160 px (Radius 24). Claim-Band als gerundete Fläche
(`margin:24px 16px 0`), Ausschnitt Radius 10. Blöcke 36 px Abstand, H2 500, Punkte Radius 8, alle mit
`data-reveal`. „Keep reading" als gerundete Fläche, Karten Radius 8.
