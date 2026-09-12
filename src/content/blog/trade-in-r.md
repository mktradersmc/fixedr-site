---
title: "Trade in R: the only metric that survives account growth"
description: "Money P&L stops meaning anything the moment your account size changes. R is the unit that stays comparable across accounts, sizes, and years."
date: 2026-08-21
---

Every trader keeps some kind of record. Fewer traders keep a record they can still read a year later.

Here is the problem, stated plainly: money P&L is denominated in a unit that keeps changing under your feet. The moment your account grows, shrinks, splits across firms, or resets after an evaluation, your currency history stops being comparable with itself. You are left with a journal written in a language whose words changed meaning halfway through.

There is a unit that doesn't have this problem. Most serious trading literature has been using it for decades. Almost no platform puts it on screen.

## What R is, in one paragraph

R is the amount you decided to risk on a trade, fixed before entry. You pick a risk — commonly a fixed percentage of the account. Your stop-loss defines where that risk is realized, and your position size is derived so that a stop-out costs exactly one R. Every outcome is then expressed as a multiple: a trade that returns twice what it risked is +2R, a stop-out is −1R, a scratch is 0R. That's the whole system. No conversion tables, no exceptions.

<span class="r-kacheln">
  <span><span class="k">STOP HIT</span><span class="v">−1 R</span><span class="t">The plan executed.</span></span>
  <span><span class="k">SCRATCH</span><span class="v">0 R</span><span class="t">Nothing risked, nothing lost.</span></span>
  <span><span class="k">TARGET</span><span class="v">+2 R</span><span class="t">Twice what was staked.</span></span>
</span>

The consequence is easy to miss and worth stating: R normalizes every trade by its own predefined risk. And that single normalization is what makes the rest of this article possible.

## The metric that breaks when you grow

Imagine a trader who passes an evaluation on a 10k account, gets funded, performs, and scales up over time to a 100k account. Good outcome. Now ask them to review their year in money terms.

The early trades look like rounding errors. The recent trades look enormous. A mediocre week on the large account dwarfs the best week on the small one. Was March better than September? The currency numbers can't tell you — they're measuring account size at least as much as they're measuring trading. Any chart of daily P&L in money is dominated by one variable, and it isn't skill.

The same distortion appears in the other direction. A trader who moves from a large personal history to a fresh evaluation account sees their numbers collapse — not because anything about their trading changed, but because the denominator did.

Now run the same review in R. A +2R day on the 10k account and a +2R day on the 100k account are the same day. Same decision quality, same risk discipline, same outcome relative to what was staked. The R history is flat where it should be flat and varies only where the trading varied. It is the only version of your track record in which *you* are the signal.

## Expectancy: the number R exists to feed

R isn't just a display preference. It's the input format for the one statistic that actually describes a trading system: expectancy — the average R you make per trade, across a large sample.

Expectancy folds win rate and average win/loss size into a single number. A system that wins rarely but wins big can carry positive expectancy; a system that wins constantly can still bleed. You cannot see either fact in a money ledger polluted by changing account sizes. You can see both instantly in an R ledger.

Suppose, hypothetically, a trader closes a month at an average of +1.8R per winning trade, with losers held to −1R by honored stops, and wins about a third of the time. That hypothetical arithmetic works out positive: roughly one-third of trades contribute +1.8R while two-thirds cost −1R, for a small positive expectancy per trade. Whether such a month happened on one funded account or spread across five, on 10k or on 100k, the number means exactly the same thing. That is a made-up illustration, not a result, and no real month is that tidy — but the point stands: the calculation is only *possible* because every trade was normalized to its own risk at entry.

Money P&L can't feed this calculation without constant re-normalization. R *is* the normalization.

## Comparability is a discipline tool, not an accounting trick

There's a second-order effect that traders discover after a few weeks of R-denominated review, and it's the one that keeps them there.

When your journal is in money, every review session is an emotional event. Big red numbers from a bad week on a big account hijack the analysis. When your journal is in R, review becomes almost clinical. A −1R loss is a plan that executed. A −2.5R loss is a red flag — not because of its size in currency, but because it means a stop was moved or missed. The unit itself audits your discipline: any loss beyond −1R is, by definition, a rule violation, visible at a glance in a way no currency column can match.

This matters most in prop trading, where a trader often runs several accounts at different firms, at different sizes, some in evaluation and some funded. In money terms these accounts can't be aggregated into one coherent picture at all. In R terms they merge into a single track record — one stream of decisions, measured in one unit, across every account you touch.

## Putting the unit on the screen

You can keep an R journal by hand next to any platform, and disciplined traders have done it in spreadsheets for years. The friction is that the platform keeps talking money at you while your journal talks R, and under pressure the louder voice tends to win.

This is the gap [FixedR](/product) was built to close. The unit isn't a column you add — it's the only unit the application knows. Every trade starts from a mandatory stop-loss, position size is derived from your risk percentage, and the outcome lands in the calendar and journal as a multiple of R. Run one account or ten across MetaTrader and NinjaTrader; the history stays one history, in one unit, readable this year and readable in five.

Your account size will change. Your unit shouldn't. If you want a cockpit that measures the trader instead of the account, [join the waitlist](/waitlist).
