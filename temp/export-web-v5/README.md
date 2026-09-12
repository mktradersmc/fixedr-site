# export-web-v5 — Produkt-Banner und acht Feature-Seiten (FXR-239)

Neun eigenständige HTML-Dateien, offline lauffähig. Alle aus EINER Quelle
(`FixedR Produktseiten.dc.html`), unterschieden nur durch die Startseite —
die Kopfleiste, das Banner und die Fußzeile sind in allen neun identisch.

| Datei | Zeigt |
|---|---|
| Banner.html | Kopfleiste mit offenem Banner über dunkler Fläche |
| Accounts.html … Start.html | je eine der acht Seiten unter /product/ |

## Banner
- Vier Lanes (`BANNER_LANES` unverändert), Raster `repeat(4, minmax(0,1fr))`, gap 20, padding 26/40/30.
- Lane-Kopf: Symbolkästchen 28×28 (Radius 7, `--ink-2`, Rahmen `--ink-line-2`, Symbol `--brand-on-ink` 15px)
  + Mono-Label 11/600/.1em `--on-ink-muted`. `min-height:52px`, `align-items:center`,
  Trennlinie `--ink-line` darunter — damit beginnen alle Spalten auf gleicher Höhe, auch bei zweizeiligem Namen.
- Punkt: 15px-Strichsymbol (`--on-ink-faint`, Strich 1.5) statt Mono-Nummer; Titel 14/600, Zeile 12 `--on-ink-muted`;
  padding 9/10, Radius 8, Hover `--ink-2`.
- Neue Symbole (24×24, Strich 1.6, in `Icon.astro` ergänzen): command, resume, idea, sigma, archive, pulse, shield,
  ladder, statement, clock. Pfade stehen im Objekt `P` der Quelldatei.

## Feature-Seite
1. Kopfband (Tinte): Eyebrow „Product / <Lane>", H1 52px, Lede; rechts das Lane-Symbol 72px in 160×160-Kachel (Radius 28).
2. Claim-Band (`--bg-alt`): Claim links (Space Grotesk 26/500), rechts der Produkt-Ausschnitt (`1fr 1.6fr`).
3. Blöcke: `1fr 1.7fr` — Mono-Nummer + H2 28px links, Absätze + Punkteliste rechts, Trennlinie `--line-soft`.
4. Keep reading (drei Karten) + der eine Abruf als Textlink.

## Produkt-Ausschnitte (Ersatz für die Schemagrafiken)
Gezeichnet in Produktsprache: Fensterchrom (Reiterzeile + Status rechts), Panels `--ink-2/--ink-3`,
Radien 8/12, Geist Mono 12, R-Werte als Badges in `--brand-on-ink`, Warnzustand `#c98a1c`, kein Grün/Rot.
Kerzen: hell = auf, gedämpft = ab. Später tauschbar gegen echte Screenshots ohne Layoutänderung.
