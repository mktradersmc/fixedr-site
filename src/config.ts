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
export const TAGLINE = 'your trading cockpit.';
export const DESCRIPTION =
  'FixedR is a local-first trading cockpit for prop traders. It shows you risk in R, not money — mandatory stop-loss, position size from risk, one trade across many accounts.';
