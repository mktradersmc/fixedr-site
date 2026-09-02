# E-Mail-Sequenz-Gerüst (Text, kein Werkzeug) — `FXR-45`

Quelle der Mechanik: `product\07-marketing-fundament.md` D0c ("Pre-Sell-Strecke + Kohorten-Fenster",
`E-C160`) + D1. **Kein Versand-Werkzeug hier** — Anbieter vs. Eigenbau ist ② und offen (`FXR-44`).
Diese Datei ist reiner Text: Zahl, Abstände, Dramaturgie, Betreff + Kern je Mail, Godin-Test.

## Ablauf

```
Warteliste-Eintrag
  → Mail 1 (sofort): PDF-Link
  → Mail 2 (Tag 3): Problem vertieft
  → Mail 3 (Tag 6): Mechanismus + Beweis (Guardian-Kontoauszug-Prinzip, keine erfundene Zahl)
  → Mail 4 (Tag 9): Einwand/Vertrauen
  → Mail 5 (Tag 12): Einladung ins Fenster — offen ODER Zwischen-Fenster-Zustand
```

5 Mails, 12 Tage Gesamtlänge, Kadenz alle 3 Tage. Dramaturgie folgt exakt der Vorgabe aus dem
Ticket: **Problem → Mechanismus → Beweis → Einladung ins Fenster.** Mail 1 ist die Auslieferung
selbst (kein separater Dramaturgie-Schritt, aber Pflicht — ohne sie hält niemand die Sequenz aus).

## Mails

| # | Tag | Betreff | Godin-Test |
|---|---|---|---|
| 1 | 0 | Your guide is here | ja — reine Zustellung, ohne sie fehlt das bezahlte/versprochene Stück |
| 2 | 3 | The stop that quietly grows | ja — vertieft genau EIN Kapitelproblem, keine Wiederholung des PDFs |
| 3 | 6 | What a month with the Guardian looks like | ja — einziger Beweis-Slot der Sequenz |
| 4 | 9 | Why this runs entirely on your machine | ja — beantwortet den Einwand, der bislang unbeantwortet blieb |
| 5 | 12 | The next window, and what's in it | ja — einzige Handlungsaufforderung der ganzen Strecke |

### Mail 1 — Tag 0 — "Your guide is here"
**Kern (drei Sätze):** Hier ist der direkte Link zum Guide, kein Login, kein Umweg. Er beschreibt
acht Probleme, die eine Challenge öfter beenden als die Strategie selbst — und was strukturell
dagegenhält. In den nächsten zwei Wochen kommen vier kurze Mails dazu, dann die Einladung ins
nächste Fenster.
**Godin-Test:** Würde sie vermisst? Ja — sie liefert das Versprochene aus. Ohne diese Mail bleibt
die Warteliste-Eintragung folgenlos.

### Mail 2 — Tag 3 — "The stop that quietly grows"
**Kern:** Vertieft Kapitel 1 aus dem Guide (Stop, der sich nach Orderaufgabe manuell vergrößern
lässt) mit einem Absatz, der im PDF keinen Platz hatte. Endet mit dem Mechanismus (Pflicht-Stop +
R-Ansicht, `E-C181`) in derselben Sprache wie das Kapitel — keine neue Behauptung. Kein CTA außer
"mehr im Guide, Kapitel 1".
**Godin-Test:** Würde sie vermisst? Ja, sofern sie wirklich vertieft statt wiederholt — reiner
Reminder wäre Rauschen; die Vertiefung ist der Unterschied.

### Mail 3 — Tag 6 — "What a month with the Guardian looks like"
**Kern:** Beschreibt, wie ein monatlicher Kontoauszug für Schutzfunktionen aussieht (Format aus
`product\07` D0b: "X Trades vor News geschlossen, Y× Daily-Limit-Stopp, Z Trades mit exakter
Größe") — als **Formatbeschreibung**, nicht als Ergebnis eines echten Kontos (es gibt noch keine
Nutzer, `E-C162`). Macht den unsichtbaren Wert (Nicht-Ereignisse) einmal konkret sichtbar.
**Godin-Test:** Würde sie vermisst? Ja — sie ist der einzige "Beweis"-Moment der Sequenz und
beantwortet "was bringt mir das eigentlich", ohne eine Zahl über ein Ergebnis zu behaupten.

### Mail 4 — Tag 9 — "Why this runs entirely on your machine"
**Kern:** Trust-Seite verdichtet (`product\07` D0b "Warum du uns vertrauen kannst"): local-only
(`E-C154`), Sunset-Totmannschalter (`E-C134`), Datenexport, Stop liegt immer beim Broker. Adressiert
den Einwand "ein Ein-Personen-Produkt" direkt, bevor die Einladung kommt.
**Godin-Test:** Würde sie vermisst? Ja — ohne sie bleibt der einzige unausgesprochene Einwand der
ganzen Strecke unbeantwortet, genau vor der Kaufentscheidung.

### Mail 5 — Tag 12 — "The next window, and what's in it"
**Kern:** Nennt die Fenstermechanik ehrlich (max. 20–30 Plätze, Grund ist Support-Kapazität, keine
Fake-Verknappung). Zwei Zweige: Fenster offen → Einladungslink; Fenster zu → Zwischen-Fenster-Text
(unten). Schließt die Dramaturgie: Problem (Mail 1–2) → Mechanismus (Mail 2–3) → Beweis (Mail 3) →
Einladung (Mail 5).
**Godin-Test:** Würde sie vermisst? Ja — es ist die einzige Mail mit einer Handlung, auf die die
gesamte Sequenz hinarbeitet.

## Zwischen-Fenster-Zustand (kein Mail-Zähler, ein Wartezustand)

Wenn das Fenster bei Mail 5 geschlossen ist: **Ansage statt Stille.** Fester Text-Baustein:
*"The current window is full. The next one opens once the last cohort has run for about a month —
that's the point, not a delay we're trying to hide. You'll get exactly one mail when it opens,
nothing before that."* Kein Rabatt, kein Countdown (`E-C160`: Knappheit ist echt und wird so
kommuniziert). Der Kontakt bleibt auf der Liste, ohne weitere Mails bis zur nächsten Öffnung.

## Messgrößen (`E-C160`/`E-C161` FALSCH-WENN, eigene minimale Messung, kein Dritt-Pixel)

Vorbild TAW `WP-308`: Ziel-URL im HMAC, kein Tracking-Pixel, kein Fremd-Skript in Mail oder
Landing. Double-Opt-in ist in jede Conversion-Zahl unten eingepreist (eine Anmeldung zählt erst als
Anmeldung nach Bestätigung).

- **Anmeldungen** je Kohorte (bestätigt, nach Double-Opt-in).
- **Quelle je Anmeldung** — eigener Link je Kanal (YouTube, TikTok, X), nicht aggregiert; die
  Kanal-Steuerung ("Botschaft nachsteuern oder Kanal einstellen") hängt an dieser Zahl.
- **Öffnungen je Kohorte** — eigene, minimale Messung (Ziel-URL im HMAC wie TAW `WP-308`), kein
  Drittanbieter-Tracking-Pixel.
- **Klick auf den Einladungslink (Mail 5) je Kohorte.**
- **Conversion in den Kauf je Kohorte** — Nenner ist die bestätigte Anmeldung, nicht der Klick.

**FALSCH-WENN (`E-C160`):**
- **Zwei aufeinanderfolgende Fenster bleiben ungefüllt** (unter der Zielgröße von 20–30) — dann ist
  die Sequenz oder die Zielgruppenwahl das Problem, nicht die Kohortengröße.
- **Support-Last je Kohorte** übersteigt, was ein Einzelner trägt — dann ist die Fenstergröße das
  Problem, nicht die Sequenz; Fenster verkleinern statt Sequenz verlängern.

## Offen (nicht Teil dieses Gerüsts)

② E-Mail-Werkzeug (Anbieter vs. Eigenbau, `FXR-44`), ③ Kohortenmechanik (Einladungscodes vs.
Kaufseite im Fenster vs. Lizenz-Deckel) — beide Michael-Entscheidungen, beide unangetastet.
