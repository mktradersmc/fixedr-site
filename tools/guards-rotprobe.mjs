// Rotprobe für den Leitplanken-Wächter (E-C162 verlangt einen roten Beleg je Regel).
// Aufruf: node tools/guards-rotprobe.mjs
//
// Ein grüner Wächter ist für sich genommen eine Nichtaussage — er ist grün, wenn er
// funktioniert, und genauso grün, wenn seine Regel nichts trifft. Deshalb prüft diese
// Probe je Regel BEIDE Richtungen:
//   trips[]  — muss auslösen. Findet die Regel nichts, ist sie ein stilles Loch.
//   passes[] — darf NICHT auslösen. Löst sie aus, blockiert sie erlaubte Sprache.
// Eine Regel ohne Belege lässt die Probe scheitern: sonst könnte eine neue Regel
// dazukommen und grün bleiben, ohne je gezeigt zu haben, dass sie etwas fängt.
import { ALL_RULES } from './guards-rules.mjs';

const fehler = [];

for (const rule of ALL_RULES) {
  if (!Array.isArray(rule.trips) || rule.trips.length === 0) {
    fehler.push(`[${rule.id}] hat keinen roten Beleg (trips) — Regel unbelegt.`);
  }
  if (!Array.isArray(rule.passes) || rule.passes.length === 0) {
    fehler.push(`[${rule.id}] hat keinen grünen Gegenbeleg (passes) — Reichweite unbelegt.`);
  }
  for (const s of rule.trips ?? []) {
    if (!rule.re.test(s)) fehler.push(`[${rule.id}] MÜSSTE auslösen, tut es aber nicht:\n      ${s}`);
  }
  for (const s of rule.passes ?? []) {
    if (rule.re.test(s)) fehler.push(`[${rule.id}] DARF NICHT auslösen, tut es aber:\n      ${s}`);
  }
}

// Gegenprobe auf die Probe selbst: eine absichtlich kaputte Regel MUSS auffallen.
// Ohne diesen Fall könnte die Schleife oben leer laufen und trotzdem „grün" melden.
const kaputt = { id: 'selbsttest', re: /wird-nie-vorkommen/, trips: ['ein Satz ohne das Wort'], passes: [] };
const selbsttestGreift = !kaputt.re.test(kaputt.trips[0]);
if (!selbsttestGreift) fehler.push('Selbsttest der Rotprobe versagt — die Probe kann nichts nachweisen.');

if (fehler.length) {
  console.error(`ROTPROBE ROT — ${fehler.length} Problem(e):\n`);
  for (const f of fehler) console.error('  ' + f + '\n');
  process.exit(1);
}

const belege = ALL_RULES.reduce((n, r) => n + r.trips.length + r.passes.length, 0);
console.log(
  `Rotprobe grün: ${ALL_RULES.length} Regeln, ${belege} Belege (je Regel mindestens ein roter und ein grüner Fall).`
);
