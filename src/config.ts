// Zentrale Site-Konfiguration.
// WARTELISTE (E-C132): der Empfänger ist austauschbar — Dienst-Entscheid fällt mit dem
// Hosting-Entscheid vor G4. Solange WAITLIST_ENDPOINT leer ist, rendert die Waitlist-Seite
// den mailto:-Fallback. Einen Formulardienst aktivieren = nur diese eine Zeile füllen
// (z. B. Formspree: 'https://formspree.io/f/<id>').
export const WAITLIST_ENDPOINT = '';

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
