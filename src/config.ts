// Zentrale Site-Konfiguration.
// WARTELISTE (E-C132, FXR-1938): Empfänger ist der eigene Lizenzserver (fixedr-server,
// `POST /api/waitlist/subscribe`, Double-Opt-in). Die Adresse kommt beim Bau aus der
// Umgebung (`PUBLIC_WAITLIST_ENDPOINT`, z. B. https://<dienst>/api/waitlist/subscribe),
// nie fest in den Quelltext. Leer = die Seite rendert den mailto:-Fallback wie bisher.
export const WAITLIST_ENDPOINT: string = String(import.meta.env.PUBLIC_WAITLIST_ENDPOINT ?? '').trim();

// FXR-1938: der Wortlaut der Einwilligung MIT Fassung. Er muss Zeichen für Zeichen dem
// Register des Servers entsprechen (fixedr-server `src/waitlist/consent.js`) — der Server
// vergleicht den gezeigten Text und lehnt eine Abweichung mit 409 ab, statt einen Nachweis
// über einen Text zu speichern, den niemand gesehen hat. Neue Fassung = beide Stellen.
export const WAITLIST_CONSENT_VERSION = '2026-11-17';
export const WAITLIST_CONSENT_TEXT =
  'I want to join the FixedR waitlist. FixedR may e-mail me about my seat in the founders circle and the launch, ' +
  'and occasionally about the topics of the guide and about FixedR. I can unsubscribe at any time with one click ' +
  'in every e-mail.';

// Postfach für den mailto:-Fallback. HINWEIS: E-Mail auf der Domain ist noch nicht
// eingerichtet (Michael-Handarbeit, z. B. Cloudflare Email Routing — gratis).
export const WAITLIST_EMAIL = 'waitlist@fixedr.com';

export const SITE_TITLE = 'FixedR';
// E-C157 (2026-08-27): löst „your trading cockpit." ab. Exakt so geschrieben, beide
// Punkte — sie sind das Gestaltungselement. Sparsamkeitsregel: EIN Slogan, keine
// „By design."-Serien im Fließtext. „Plan your trade, trade your plan" eröffnet die
// Methodik-Seite und steht NICHT unter dem Logo.
export const TAGLINE = 'Trade Calm. By Design.';
// Das ist die Eingangs-Message im Suchergebnis — dieselbe Regel wie für die H1
// (Michael 2026-08-29): mit dem Ergebnis führen, das Mittel danach. „Es zeigt dir
// Risiko" war eine Aussage darüber, was wir verweigern.
export const DESCRIPTION =
  'A local-first trading cockpit for prop traders, where everything on the screen is built to keep you level. Same trader, better conditions: the numbers do not disappear, they change scale — you risk a percentage, not an amount, and every result reads in R rather than a sum you can hold against your rent.';
