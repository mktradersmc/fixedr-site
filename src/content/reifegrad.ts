// Reifegrad je Feature-Aussage (product\10 §4.1/§4.2, FXR-26 Nachtrag 2026-09-01 Punkt 4).
// Der Reifegrad ist Gliederung, nicht Fußnote — deshalb liegt er hier als Daten und
// nicht in der Prosa: eine Aussage ohne Eintrag darf nicht als "built" durchrutschen.
//
// <ReifegradChip id="…" /> schlägt in dieser Liste nach und wirft beim Bau, wenn eine
// zitierte id fehlt — dieselbe Regel wie bei Ticketnummern (erst anlegen, dann zitieren).
export type ReifegradStatus = 'built' | 'in-progress' | 'planned';

export interface ReifegradEntry {
  id: string;
  status: ReifegradStatus;
  /** Kurzer Grund/Beleg, sichtbar als title-Attribut des Chips. Bei "planned" Pflicht. */
  note?: string;
}

export const REIFEGRAD: ReifegradEntry[] = [
  // ── §4.1 "In the build today" ──────────────────────────────────────────
  { id: 'mandatory-stop', status: 'built', note: 'No stop, no trade — structural, not a habit.' },
  { id: 'position-size-from-risk', status: 'built', note: 'Lot size is computed from the stop distance and your risk.' },
  { id: 'across-accounts', status: 'built', note: 'One order, distributed by configuration — nothing guessed.' },
  { id: 'r-only-display', status: 'built', note: 'Every result in R. No money mode, no toggle.' },
  { id: 'multi-timeframe-sync', status: 'built', note: 'Roles (HTF/MTF/LTF) drive sync, not window position.' },
  { id: 'on-your-machine', status: 'built', note: 'Windows app, installer, no cloud account.' },
  { id: 'payout-lock', status: 'built', note: 'Trading can be paused on an account once it is payout-eligible.' },
  { id: 'dynamic-risk-rule', status: 'built', note: 'R can follow a written rule on account state.' },
  // FXR-1765: beide waren „planned", sind gebaut (Auftraggeber, November 2026).
  { id: 'firm-rule-profiles', status: 'built', note: 'Maintained rule sets per prop firm, delivered by us.' },
  { id: 'news-protection', status: 'built', note: 'News window with buffer, locks only the affected symbol. A net, not a guarantor.' },

  // ── §4.2 "On the way — and what shapes it" — Founders-Pitch, keine Zahl/Datum ──
  { id: 'auto-documentation', status: 'planned', note: 'The plan next to the result, without typing it up.' },
  { id: 'guardian-statement', status: 'planned', note: 'What the tool quietly prevented over a month.' },

  // ── §6 /trust ────────────────────────────────────────────────────────
  { id: 'local-only', status: 'built', note: 'The server never learns what you trade.' },
  { id: 'stop-loss-at-broker', status: 'built', note: 'The safety net sits with the broker, not with us.' },
  { id: 'sunset-clause', status: 'planned', note: 'Intent decided (E-C004/FXR-28); exact terms not yet written.' },
  { id: 'data-export', status: 'planned', note: 'Committed, not built — export to open formats.' },
];
