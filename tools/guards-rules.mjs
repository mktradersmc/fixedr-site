// Die Verbotsregeln als Daten — einzige Quelle für `guards.mjs` (misst) und
// `guards-rotprobe.mjs` (belegt, dass jede Regel greift und nicht zu breit greift).
//
// BREIT geschnitten (design-guard-Lehre: ein zu enger Wächter ist gefährlicher als
// keiner): lieber ein falscher Alarm, den ein Mensch freigibt, als ein stilles Loch.
// Es gibt ABSICHTLICH keinen Inline-Disable-Mechanismus.
//
// Jede Regel MUSS `trips` (muss auslösen) und `passes` (darf nicht auslösen) tragen.
// Die Rotprobe bricht ab, wenn eine Regel ohne Belege dazukommt — sonst wäre eine
// neue Regel grün, ohne je gezeigt zu haben, dass sie überhaupt etwas fängt.

/** Claims-Verbotsliste: Rendite-/Erfolgsversprechen, Geldbeträge, Preise, erfundene Zahlen. */
export const CLAIM_RULES = [
  {
    // FXR-2011 (2026-11-19): die Ausnahme fuer den unscharfen Betrag aus FXR-239 ist
    // ENTFALLEN. Die Startseite zeigt neben dem scharfen R-Wert jetzt einen unscharfen
    // Fleck OHNE Zahl — das Bild traegt dasselbe Argument, und im Quelltext steht kein
    // Geldbetrag eines Trades mehr. Damit gilt die Regel wieder ohne Loch.
    id: 'dollarbetrag',
    re: /\$\s?\d/,
    why: 'Dollarbetrag (keine Geldbeträge, nirgends)',
    trips: ['costs $49 a month', 'made $1,241 last week', 'a $1,240,000 account', 'blurred out: $1,240'],
    passes: ['+2.4 R', 'the $ symbol never appears next to a number'],
  },
  {
    // E-C319 / E-C321 (Michael 2026-11-19): genau EIN Betrag ist erlaubt — €29, der
    // Preis der Basisstufe, als Vorschlag markiert. Die hoeheren Stufen haben noch keinen
    // Preis und stehen als „to be announced" da; die frueheren €19/€39/€69 (FXR-164) sind
    // abgeloest und fallen wieder in die Regel. Jedes ANDERE Eurozeichen (andere Zahl,
    // Zahl vor dem Zeichen) bleibt gesperrt — so kann kein erfundener Stufenpreis und
    // kein Preisanker mit Summe unbemerkt auf die Seite kommen.
    id: 'eurozeichen',
    re: /€(?!29\b)/,
    why: 'Eurozeichen außerhalb des einen erlaubten Preises €29 (E-C321; höhere Stufen offen)',
    trips: ['39 € pro Monat', '€100 per month', '€199', '€19 / month', '€69 / month', '€290'],
    passes: ['no currency signs anywhere', 'One account is listed at €29 / month'],
  },
  {
    id: 'waehrungsbetrag',
    re: /\d\s?(eur|usd|gbp|chf)\b/i,
    why: 'Währungsbetrag',
    trips: ['a 100 USD account', '49 EUR'],
    passes: ['measured in R, never in a currency'],
  },
  {
    id: 'garantie',
    re: /guarantee/i,
    why: '„guarantee" (kein Erfolgs-/Renditeversprechen)',
    trips: ['we guarantee results', 'profit guarantee'],
    passes: ['a safety net, not a guarantor'],
  },
  {
    id: 'challenge-versprechen',
    re: /\bpass (your|the) (challenge|evaluation|eval)\b/i,
    why: '„pass your challenge"-Versprechen',
    trips: ['pass your challenge faster'],
    passes: ['most traders fail evaluations for reasons that are not analysis'],
  },
  {
    id: 'preisnennung',
    re: /\b(39|49)\s?(\$|€|usd|eur|\/\s?mo|per month|a month|monthly)/i,
    why: 'Preisnennung (E-C009 offen — Website nennt KEINE Preise)',
    trips: ['49 per month', '39/mo'],
    passes: ['pricing is announced with the founders circle'],
  },
  {
    id: 'nutzerzahlen',
    re: /\b\d{3,}[\d,.]*\+?\s?(traders|users|customers|members)\b/i,
    why: 'Nutzerzahlen-Behauptung',
    trips: ['join 4,200 traders'],
    passes: ['a small group of prop traders first'],
  },
  {
    id: 'testimonial',
    re: /\btestimonial/i,
    why: 'Testimonial (keine — es gibt noch keine Nutzer)',
    trips: ['read our testimonials'],
    passes: ['we have no users to quote yet'],
  },
  {
    id: 'erfolgsversprechen',
    re: /\b(risk[- ]free|get funded faster|double your|triple your|profit guarantee)\b/i,
    why: 'Erfolgsversprechen',
    trips: ['risk-free trial', 'double your account'],
    passes: ['risk is fixed before entry'],
  },
  {
    id: 'rendite-zahl',
    re: /\b\d+(?:[.,]\d+)?\s?%\s?(return|profit|gain|win rate|winrate)\b/i,
    why: 'Rendite-/Winrate-Zahl',
    trips: ['a 70% win rate', '12 % return', 'a 62.5 % winrate'],
    passes: ['0.5 % risk per trade', 'the drawdown limit is defined in percent'],
  },

  // ── E-C162 (2026-08-27) — Titel-/Sprachregeln aus Transkript Teil 3 ──────────
  {
    id: 'zahl-als-zukunft',
    re: /\b(?:in|within|after|nach)\s+\d+\s*(?:days?|weeks?|months?|years?|trades?|Tagen|Wochen|Monaten|Jahren|Trades)\b[^.!?]{0,80}\b(?:you['’]?ll|you will|you can expect|you get|wirst du|du wirst)\b/i,
    why: 'Zahl als Zukunft/Versprechen (E-C162: Zahlen dürfen Vergangenheit oder Problem beschreiben — nie Zukunft)',
    trips: [
      'In 90 days you will trade the same way every session.',
      'Nach 6 Monaten wirst du ruhiger handeln.',
    ],
    passes: [
      'Last month: 3 trades closed before news, 2 daily-limit stops.',
      'After 40 trades the record starts to say something.',
    ],
  },
  {
    id: 'zukunft-mit-zahl',
    // Dezimalstellen MÜSSEN mit: „1.8 R" ist genau die Form, in der ein
    // Renditeversprechen auftritt — `\d+` allein hätte sie durchgelassen.
    re: /\b(?:you['’]?ll|you will|you can expect|expect to|wirst du|du wirst)\b[^.!?]{0,80}\b\d+(?:[.,]\d+)?\s*(?:R\b|%|percent|Prozent)/i,
    why: 'Versprechen mit Zahl (E-C162: kein Zukunftswert in R oder Prozent)',
    trips: ['You will average 1.8 R per trade.', 'Expect to keep 80 % of your drawdown.'],
    passes: ['A trade closed at twice the risked amount is +2 R.'],
  },
  {
    id: 'metrik-fuehrt',
    re: /\b(?:let|lass|lassen sie)\s+(?:the\s+|die\s+|der\s+)?(?:metrics?|numbers?|data|stats?|statistics|Metrik|Metriken|Zahlen|Daten)\b[^.!?]{0,40}\b(?:guide|lead|steer|führen|leiten|lenken)\b/i,
    why: '„lass dich von der Metrik führen" — Guru-Rolle, gesperrt (E-C162)',
    trips: ['Let the numbers guide your next trade.', 'Lass die Zahlen dich führen.'],
    passes: ['The record tells you what you actually did.'],
  },
  {
    id: 'wir-fuehren-dich',
    re: /\b(?:we|FixedR|wir)\s+(?:will\s+|werden\s+|can\s+)?(?:guide|coach|mentor|führen|coachen)\s+(?:you|dich|Sie)\b/i,
    why: 'Coach-/Guru-Rolle (E-C162: das Werkzeug hält Regeln, es führt niemanden)',
    trips: ['We guide you to consistency.', 'FixedR will coach you through drawdown.'],
    passes: ['FixedR holds the rule you wrote down.'],
  },
  {
    id: 'entfernte-signalstrecke',
    re: /\bdivergen(?:ce|ces|t|z|zen)\b/i,
    why: 'Begriff einer Signalstrecke, die aus dem Produkt entfernt wurde (FXR-01b) — komplett gesperrt (E-C162)',
    trips: ['built-in divergence detection', 'RSI-Divergenz erkennen'],
    passes: ['indicators you configure yourself'],
  },

  // ── E-C196 (c), 2026-09-01 — Erstheits-/Spitzenstellungsbehauptung ───────
  // UWG §5: "der Erste"/"die Einzige" ist eine nachweispflichtige Tatsachenbehauptung,
  // nicht Meinung — abmahnfähig, und die Herleitung stützt sich hier auf ungebaute
  // Features UND einen ungemessenen Markt (L1 offen). Erlaubte Ersatzformen bleiben
  // unberührt: Bauabsicht ("built as the only one to …") und selbstprüfbare Abwesenheit
  // ("find the switch that removes the balance") — beides ohne Marktrang-Anspruch, also
  // OHNE "the only <Kategorie> that/in the market/available" direkt danach.
  {
    id: 'erstheitsbehauptung',
    re: /(?:\bthe first (?:tool|platform|app|software|company|cockpit|trading (?:app|tool|platform))\b|\bfirst[- ]ever\b|\bworld'?s first\b|#1\b|\bpioneer(?:s|ing|ed)?\b|\bthe only (?:tool|platform|app|software|company|product|cockpit)\s+(?:that|in the market|available)\b)/i,
    why: 'Erstheits-/Spitzenstellungsbehauptung (UWG §5, abmahnfähig; E-C196 (c)) — nutze stattdessen eine Bauabsicht ("built as the only … to …") oder eine selbstprüfbare Abwesenheit',
    trips: [
      'FixedR is the first trading platform to hide your balance.',
      'The only tool that removes money from your screen.',
      "We are the world's first risk-first cockpit for prop traders.",
      'FixedR pioneered R-only trading for prop firms.',
      'The #1 cockpit for prop traders.',
    ],
    passes: [
      'FixedR was built as the only tool made to remove the balance from your screen.',
      'Open your platform. Find the switch that removes the balance.',
      'A small group of prop traders first, then the waitlist.',
    ],
  },
];

/** Markenkonsistenz: Schreibweise exakt „FixedR"; Kleinschreibung nur in Domains/Pfaden/Idents. */
export const BRAND_RULES = [
  {
    id: 'marke-falschschreibung',
    re: /\b(Fixedr|fixedR|FIXEDR|Fixed-R)\b/,
    why: 'Falschschreibung der Marke (exakt: FixedR)',
    trips: ['Fixedr is a cockpit', 'welcome to FIXEDR'],
    passes: ['FixedR is a cockpit', 'fixedr.com', 'waitlist@fixedr.com'],
  },
  {
    id: 'marke-klein',
    re: /(?<![.\/@\w-])fixedr(?![.\w-])/,
    why: 'Marke kleingeschrieben im Fließtext (exakt: FixedR)',
    trips: ['try fixedr today'],
    passes: ['FixedR today', 'https://fixedr.com/blog', 'branding/fixedr-avatar-512.png'],
  },
];

export const ALL_RULES = [...CLAIM_RULES, ...BRAND_RULES];
