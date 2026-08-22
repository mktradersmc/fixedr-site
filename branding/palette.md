# FixedR — Farbwelt (A2)

**⚠️ Revidiert am 2026-08-22 (Michael): HELL ist die Leitfassung, nicht Dark.** Grund: Die
Anwendung bekommt Hell als Standard (Dark bleibt umschaltbar) — der Webauftritt folgt, damit
Seite und Produktbilder zusammenpassen. Die dunklen Werte unten bleiben gültig für den
Dark-Mode der Anwendung; die Website nutzt die **helle Fassung** (s. unten und
`src/styles/global.css`).

Unverändert gilt: Bewusster Bruch mit der Geld-PnL-Welt — **kein Grün/Rot als Signalfarben**;
die Signalfarbe gehört dem R, nach dem Vorbild von Avionik-Instrumenten.

## Helle Leitfassung (Website, künftig App-Standard)

| Rolle | Wert | Verwendung |
|---|---|---|
| `--bg` | `#FFFFFF` | Seitenhintergrund |
| `--bg-alt` | `#F7F9FC` | abwechselnde Abschnittsbänder |
| `--surface-2` | `#F2F5F9` | Eingabefelder, Kacheln |
| `--line` | `#E1E7EF` | Ränder, Trennlinien |
| `--text` | `#101623` | Fließtext |
| `--muted` | `#59617A` | Sekundärtext |
| `--signal` | `#B37B00` | R-Werte, Links (kontraststark auf Hell) |
| `--signal-bright` | `#FFB000` | Flächen: Knöpfe, Akzentlinien |
| `--signal-bg` | `#FFF6E5` | Hervorhebungskästen |

## Dunkle Fassung (App-Dark-Mode) — Grundtöne

| Rolle | Wert | Verwendung |
|---|---|---|
| `--bg` | `#0B0E14` | Seitenhintergrund (tiefes Blau-Schwarz) |
| `--surface` | `#121722` | Karten, Codeblöcke, Panels |
| `--surface-2` | `#1A2130` | Hover, erhabene Flächen |
| `--line` | `#2A3242` | Trennlinien, Ränder |
| `--text` | `#E6E9F0` | Fließtext |
| `--muted` | `#8B93A7` | Sekundärtext, Bildunterschriften |

## Palette 1 — „Amber" (Avionik-Warnlicht, warm)

| Rolle | Wert |
|---|---|
| `--signal` | `#FFB000` |
| `--signal-dim` | `#B37B00` |
| `--signal-bg` | `#241B08` |

## Palette 2 — „Cyan" (Glass-Cockpit-Display, kühl)

| Rolle | Wert |
|---|---|
| `--signal` | `#3FC6DC` |
| `--signal-dim` | `#2A8A9A` |
| `--signal-bg` | `#0A1E24` |

## Helle Ableitung (nur für Dokumente/Druck, Site bleibt dark-first)

`--bg #FFFFFF · --surface #F4F6F9 · --line #D8DDE6 · --text #14181F · --muted #5A6274`,
Signalfarbe unverändert (Amber auf Hell: `#B37B00` für Kontrast).

## Regeln

1. Die Signalfarbe ist **dem R und Interaktion** vorbehalten (Links, CTA, R-Werte in Grafiken).
   Nie flächig einsetzen.
2. Grün/Rot erscheinen nirgends als Wertungsfarben — auch nicht in Illustrationen.
3. Kontrast: Fließtext ≥ 7:1, Sekundärtext ≥ 4,5:1 auf `--bg` (beide Paletten erfüllen das;
   Amber `#FFB000` auf `#0B0E14` ≈ 9,9:1, Cyan `#3FC6DC` ≈ 9,3:1).
4. Typografie: Inter (Text), JetBrains Mono (Zahlen, R-Werte, Wortmarke) — beide OFL,
   lokal gebündelt, Lizenztexte unter `branding/font-licenses/`.
