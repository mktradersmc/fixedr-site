# Designauftrag R16 — Produkt-Banner und acht Feature-Seiten

**Für:** Claude Design · **Ticket:** `FXR-239` · **Stand:** 2026-09-11
**Gebauter Rohbau:** `C:\forge-os\fixedr-site` (Astro, offline baubar mit `npm run build`)
**Rückgabe:** je Seite ein Export nach `fixedr-site/temp/export-web-v5/<seitenname>.html`

---

## 0. Worum es geht, in drei Sätzen

Die Startseite steht und ist gestalterisch abgenommen (Runde 15/v4). Neu sind **ein Aufklappbanner
im Kopf** und **acht eigene Feature-Seiten**, die den Umfang des Produkts überhaupt erst sichtbar
machen. Der Inhalt dieser neun Flächen ist fertig geschrieben und im Repository gebaut — **gesucht
ist die Gestalt, nicht der Text.**

Texte dürfen gekürzt und umgestellt werden. Sie dürfen **nicht** inhaltlich erweitert werden: jede
Aussage auf diesen Seiten ist gegen den gemessenen Produktbestand geprüft. Neue Feature-Aussagen
wären ungeprüft.

---

## 1. Die tragende Regel dieser Runde: keine Redundanz

Michael, 2026-09-11: *„weil wir eben viel haben und ich keine Redundanz mag."*

Der erste Entwurf des Banners enthielt acht Punkte — **alle acht** standen weiter unten auf
derselben Startseite. Daraus folgt die Regel, an der diese Runde gemessen wird:

> **Der Banner ist das Komplement des Scrolls.** Wo die Startseite ein Argument ausführt, schweigt
> der Banner und verlinkt es einmal. Wo sie etwas nur *nennt*, packt die Unterseite es aus.

Praktisch heißt das für die Gestaltung: wenn eine Kachel, eine Zeile oder ein Bild dasselbe sagt wie
ein Abschnitt der Startseite, ist das **ein Befund, kein Stilproblem** — bitte melden statt schöner
machen.

---

## 2. Das Aufklappbanner

**Ort:** in der Kopfleiste, aufklappend unter der Leiste (nicht als Overlay). Die Kopfleiste wächst;
sie ist `position: sticky` und dunkel (Tinte).
**Auslöser:** Überfahren des Nav-Glieds „Product", Klick auf den Chevron daneben, Tastaturfokus auf
dem Chevron. Schließt bei Mausverlassen der Kopfleiste, mit `Esc`, und wenn der Fokus sie verlässt.
**Gebaut in:** `src/layouts/Base.astro` + `src/styles/mega.css`, Inhalt aus
`src/content/produktnavigation.ts`.

### 2.1 Aufbau

```
┌─ Kopfzeile über alle Spalten ─────────────────────────────────────────────────┐
│ The R view · mandatory stops · size from risk · one ticket for every account  │
│                                  the whole argument is on the front page →    │
├───────────────┬───────────────┬───────────────┬───────────────────────────────┤
│ ◎ THE TRADE   │ ↻ PRACTICE    │ ⌁ AROUND IT   │  Filmkarte  ODER              │
│               │   AND REVIEW  │               │  „Also in the build"          │
│ Accounts and  │ Backtesting   │ Alerts and    │                               │
│  risk         │  and replay   │  calendar     │  (s. 2.4)                     │
│ Charts and    │ Journal       │ Getting       │                               │
│  drawing      │ Metrics in R  │  started      │                               │
│ Workspaces    │               │               │                               │
│  and time-    │               │               │                               │
│  frames       │               │               │                               │
└───────────────┴───────────────┴───────────────┴───────────────────────────────┘
```

Je Eintrag: **Titel** (14 px, 600) und **eine Zeile** Beschreibung (12,5 px, gedämpft). Kein Bild,
keine Nummer, kein Chip.

### 2.2 Die Lane-Symbole — ausdrücklich gewünscht

Michael, 2026-09-11: *„für die bannerlanes will ich symbole."* Gebaut sind Strichsymbole auf 24×24,
Strich 1,6, in einem 26×26-Kästchen (Radius 7, Hintergrund `--ink-2`, Rahmen `--ink-line-2`,
Symbolfarbe `--brand-on-ink`). Quelle: `src/components/Icon.astro`.

| Lane | Symbol | Gedanke dahinter | ändern? |
|---|---|---|---|
| **The trade** | Fadenkreuz | Der Auftrag wird gesetzt, nicht gesucht. Er ist der Moment, in dem die Regel greift. | Form gern, Bedeutung nicht |
| **Practice and review** | Rücklauf mit Abspielzeichen | Zurückspulen und wieder durchlaufen — Üben und Auswerten sind dieselbe Bewegung. | Form gern |
| **Around it** | Glocke | Es erreicht dich, auch wenn du nicht hinsiehst. | ggf. Radar/Antenne prüfen |

**Auftrag:** die drei Symbole gestalterisch auf ein Niveau bringen (gleiche optische Gewichtung,
gleiche Anmutung wie die Mono-Schrift der Marke) und prüfen, ob das Kästchen bleibt oder das Symbol
frei steht. Wenn du zusätzlich **je Eintrag** ein Symbol vorschlagen willst: gern als zweite
Variante — es gibt bereits eines je Seite (s. Tabelle in 3.), heute nur auf den Nabe-Kacheln
benutzt. Die Frage ist, ob acht weitere Symbole im Banner ordnen oder nur flimmern.

### 2.3 Die Kopfzeile ist der Redundanz-Trick

Sie nennt die vier Mechaniken, die der Startseiten-Scroll ausführt, **einmal als Verweis** statt
sie als vier Karten zu wiederholen. Gestalterisch ist sie heute bewusst leise (13 px, gedämpft,
mit Trennlinie darunter). Bitte prüfen, ob sie so gelesen wird — sie hat eine echte Aufgabe und
darf nicht wie Kleingedrucktes wirken.

### 2.4 Zwei Zustände in der vierten Spalte

Der Produktfilm **existiert noch nicht** (`public/videos/product-loop.mp4` fehlt, `FXR-164`:
„das müssen wir noch produzieren"). Deshalb rendert die vierte Spalte heute automatisch:

- **Ohne Filmdatei:** `Also in the build` — acht Substantive als kleine Mono-Marken
  (*Saved layouts · Custom timeframes · Command palette · Economic calendar · Dynamic risk rules ·
  Live data guard · Mobile alerts · Account archive*). Sie geben die Breite in einem Blick, ohne den
  Banner zu einem Katalog zu machen.
- **Mit Filmdatei:** dunkle Filmkarte, Abspielknopf, Titel *„One trade, in R, start to finish."*,
  Unterzeile *„Watch · 45 s · no sound needed"*.

**Beide Zustände brauchen eine Gestalt.** Der Wechsel ist automatisch (`existsSync` im Layout) — es
darf keinen geben, der ungestaltet aussieht.

### 2.5 Bekannte Grenze: mobil gibt es das Banner nicht

`global.css` blendet `header.site nav` unter 780 px komplett aus, und es gibt **keinen Ersatz** —
mobil führt heute nur die Fußzeile irgendwohin. Der Banner erbt das. **Ein Mobil-Menü ist ein
offener Punkt für Michael (FXR-239), kein Teil dieses Auftrags** — aber wenn du für die Kopfleiste
mobil einen Vorschlag mitlieferst, ist er willkommen.

---

## 3. Die acht Feature-Seiten

Alle acht liegen als **inhaltliche Rohversion** vor: Text fertig, Struktur fertig, Gestalt
absichtlich schlicht. Gemeinsames Gerüst: `src/layouts/FeaturePage.astro`.

**Jede Seite hat heute:** dunkles Kopfband (`PageHead`: Eyebrow, H1, Lede) → ein größer gesetzter
Claim-Satz → vier bis sechs Blöcke (`h2` + Absätze + optional eine zweispaltige Punkteliste) → Fuß
mit den beiden Nachbarseiten, „All eight" und dem einen Abruf.

| Seite | Lane | Aufgabe in einem Satz | Symbol | **Bild, das fehlt** |
|---|---|---|---|---|
| `/product/accounts` | The trade | Die Regeln gelten dem Trader, nicht dem Login | Ebenen | hat 3 (Distribution, PayoutLock, DynamicRisk) |
| `/product/charts` | The trade | Das Werkzeug, mit dem die Analyse überhaupt aufgeschrieben wird | Stift | **Zeichenwerkzeuge am Chart** — Trendlinie, Fibonacci, Notiz, Positionsrechner in einem Ausschnitt |
| `/product/workspaces` | The trade | Aus einer Fensteranordnung wird eine benannte Analysestruktur | Raster | hat 2 (LayoutMosaic, Horizon) — fehlt: **Rollen HTF/MTF/LTF als Beschriftung an drei Kacheln** |
| `/product/backtesting` | Practice and review | Die Vergangenheit im eigenen Takt handeln | Rücklauf | **Replay-Leiste** (Play/Pause/Step/Tempo) mit dem R-Ergebnis daneben |
| `/product/journal` | Practice and review | Das Journal füllt sich, weil das Werkzeug den Auftrag gesetzt hat | Buch | **Eintrag**: Plan links, Ergebnis rechts, Chartbild daneben |
| `/product/metrics` | Practice and review | Ein Datensatz, der einen Kontowechsel überlebt | Säulen | hat 2 (RCalendar, RScale) |
| `/product/alerts` | Around it | Es erreicht dich, auch wenn du nicht am Schirm sitzt | Glocke | **Alarm am gezeichneten Objekt** + Handy-Benachrichtigung + Kalenderzeile |
| `/product/start` | Around it | Der erste Trade in R, in fünfzehn Minuten | Kompass | **Erste-Schritte-Tour**: Sprechblase, die auf ein echtes Element zeigt, plus Todo-Panel |

**Auftrag je Seite:** ein Kanvas. Gliederung darf umgestellt werden, wenn es besser liest. Der
Prev/Next-Fuß und der einzige Abruf müssen bleiben.

---

## 4. Michaels Frage zu den Schemagrafiken — und der Vorschlag

Michael, 2026-09-11: *„wir haben als style zu den features hier in der regel schemagrafiken. das ist
für den prototyp in ordnung. aber es wirkt noch irgendwie disconnected vom produkt. irgendwie
generisch. kommen dort nachher screenshots rein, oder hübscht man diese schemagrafiken noch auf?"*

**Beides, in dieser Reihenfolge — und das ist teilweise schon entschieden.**

1. **Screenshots sind gesetzt, aber zeitlich gesperrt.** `marketing/KONZEPT.md`:
   *„Screenshots nur aus der App mit Demo-Daten und nur nach AC19 (R-only gebaut) — bis dahin gar
   keine."* Solange irgendwo im Bild noch ein Geldwert stehen könnte, widerspricht jeder Screenshot
   der Kernthese der Marke. Es gibt heute genau **einen** Screenshot im Repository
   (`public/screens/trading-dark.png`).

2. **Das „generisch"-Gefühl hat aber eine andere Ursache** als das fehlende Foto: die neun
   vorhandenen Grafiken (`src/components/illus/`) benutzen eine **eigene** Bildsprache. Sie sind
   Infografiken *über* das Produkt, nicht Ausschnitte *aus* ihm. Deshalb liest man sie als
   Illustration und nicht als Beweis.

**Der Auftrag daraus — der wichtigste Punkt dieses Dokuments:** zeichne die Schemagrafiken als
**Ausschnitte der Anwendung**. Konkret heißt das:

- dieselben Panel-Kanten, Radien und Abstände, die die Anwendung benutzt;
- die echte Chartfarbe und die echten Zustandsfarben, nicht ein Grafik-Blau;
- R-Werte als **Mono-Badges** in der Schriftart der Anwendung (`Geist Mono`), nie als Fließtext;
- Fensterchrom, wo es einen Ausschnitt glaubwürdig macht (Reiterzeile, Panel-Titel);
- keine Icons, die es in der Anwendung nicht gibt.

Der Gewinn ist doppelt: es wirkt sofort wie das Produkt, **und** der späte Tausch gegen echte
Screenshots ändert nur die Auflösung, nicht das Layout. Wer heute in Produktsprache zeichnet, baut
den Rahmen, in den der Screenshot später einfach hineinrutscht.

---

## 5. Gestaltungs-Marken (bitte übernehmen, nicht neu erfinden)

Aus `src/styles/global.css`, `:root`:

| Zweck | Token | Wert |
|---|---|---|
| Grund hell / abwechselnd | `--bg` / `--bg-alt` | `#ffffff` / `#f6f8fb` |
| Linien | `--line` / `--line-soft` | `#e3e8ef` / `#eef1f6` |
| Text / gedämpft / blass | `--text` / `--muted` / `--faint` | `#0b0f17` / `#576274` / `#7d8798` |
| Marke auf Hell | `--brand` | `#0a62cf` |
| Tinte (Kopf, Fuß, Bänder) | `--ink` / `--ink-2` | `#06070a` / `#0c0e12` |
| Linien auf Tinte | `--ink-line` / `--ink-line-2` | `#1c2027` / `#2b313a` |
| Text auf Tinte | `--on-ink` / `--on-ink-muted` / `--on-ink-faint` | `#f3f5f7` / `#98a1ab` / `#6b747e` |
| Marke auf Tinte | `--brand-on-ink` | `#2e86f6` |
| Radien | `--radius-sm` / `--radius` / `--radius-lg` | 8 / 12 / 14 px |

Schriften: **Space Grotesk** (Display/H1), **Geist** (Text), **Geist Mono** (Zahlen, Marken,
Eyebrows). Alle drei liegen lokal in `node_modules` — **keine externe Schriftquelle**, die Site lädt
nichts von Dritten.

Raster: Inhalt max. 1200 px, Innenrand 40 px, Abschnitte 80 px oben/unten.

---

## 6. Was nicht verhandelbar ist

Diese Punkte sind maschinell bewacht (`tools/guards.mjs` + `guards-rules.mjs`); ein Verstoß bricht
den Bau, nicht erst das Review.

1. **Kein Geld auf dem Schirm.** Keine Währungszeichen, keine Beträge — außer den drei bereits
   freigegebenen Preiskarten-Werten auf der Startseite. Alles andere in **R** und Prozent.
2. **Der Begriff der aus dem Produkt entfernten Signalstrecke ist komplett gesperrt** (`FXR-01b`).
   Falls du sie in älteren Vorlagen findest: nicht übernehmen.
3. **Kein Wettbewerbervergleich, kein „vs", kein „unlike".** Der Kontrast reibt sich an der LAGE:
   *„The rules apply before the trade exists."*
4. **Kein „der Erste" / „der Einzige" / „#1".** Nachweispflichtige Tatsachenbehauptung, abmahnbar.
5. **Kein Erfolgsversprechen, keine Garantie, kein „pass your challenge".**
6. **Keine Zukunftszahl** („in 90 Tagen wirst du …", „you'll average 1.8 R").
7. **Das Werkzeug führt niemanden.** „We guide you", „let the numbers guide you" sind gesperrt — es
   hält die Regel, die der Trader selbst aufgeschrieben hat.
8. **Ein Ziel, ein Knopf.** Jede Seite endet auf „Join the waitlist". Alles andere (Manifesto,
   Methodology, Nachbarseiten) ist Textlink, nie ein zweiter Knopf daneben.
9. **Marke exakt `FixedR`.**
10. **`noindex,nofollow` bleibt** auf jeder Seite (die Site steht hinter einer Login-Wall).

---

## 7. Wie du es zurückgibst

Ein Export je Fläche nach `fixedr-site/temp/export-web-v5/`:

```
Banner.html          — die Kopfleiste offen, mit den drei Lanes und BEIDEN vierten Spalten
Accounts.html        Charts.html        Workspaces.html
Backtesting.html     Journal.html       Metrics.html
Alerts.html          Start.html
```

Wenn du Kanvas-Props benutzt, um Varianten zu schalten: **sag welche und was sie bedeuten.** Der
letzte Export (`export-web-v4`) waren drei Dateien, die sich ausschließlich in einem Prop
unterschieden (`filmOrt`) — das war erst nach dem Entpacken erkennbar und hat einen Vergleich
gekostet, der keiner war.

---

## 8. Was im Rohbau bewusst offen ist

Damit du es nicht als Mangel meldest:

- **Keine Reifegrad-Chips auf den acht Seiten.** Auf `/product` tragen die zwei Gruppen die
  Unterscheidung „läuft heute" / „entsteht". Auf den Unterseiten wurde in dieser Runde entschieden,
  ohne Chips zu arbeiten: das Produkt ist in der Entwicklungsphase, der Umfang ist beschlossen.
  Ob die Chips auf den Unterseiten später wiederkommen, entscheidet Michael.
- **Vier der acht Seiten haben noch kein Bild** (s. Tabelle in 3.) — das ist der Auftrag, nicht das
  Versehen.
- **Die Filmkarte ist heute nicht sichtbar**, weil die Filmdatei fehlt. Sie braucht trotzdem eine
  Gestalt (2.4).
- **Der Hero-Play-Chip ist neu** und absichtlich klein: der bestehende Schleier über dem Standbild
  liegt in Ruhe auf `opacity: 0`, also verrät mit Maus bis zur ersten Bewegung nichts, dass es einen
  Film gibt. Der Chip ist der Ruhezustand, der Schleier bleibt die Verstärkung beim Überfahren.
  Falls dir eine bessere Ruhe-Anmutung einfällt: gern, aber **der Ruhezustand muss den Film
  verraten.**
