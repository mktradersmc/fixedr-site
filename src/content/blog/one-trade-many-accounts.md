---
title: "One trade, many accounts: distribution without doubling your risk"
description: "Running one setup across several prop accounts multiplies operations, not decisions. How disciplined trade distribution should actually work."
date: 2026-08-21
---

Serious prop traders rarely run one account. The economics push toward several: accounts at different firms, some in evaluation and some funded, often at different sizes. The trading doesn't change — a good setup is a good setup — but the *operations* multiply. One decision now has to land on four or six accounts, correctly, at the same moment.

That multiplication is where a clean system quietly turns into a risk problem. Not a market-risk problem — an operational one. And operational risk has a distinctive signature: it doesn't show up in your analysis, your backtest, or your journal. It shows up as the account you didn't mean to blow.

## The copy problem, stated honestly

Placing one trade on many accounts sounds like a solved problem. Copy tools have existed for years. But look at what actually has to be true for a multi-account trade to be *correct*, and the problem gets less trivial:

The risk must be right **per account**. Accounts differ in size, in remaining drawdown, in firm rules. "Same position size everywhere" is exactly wrong: a quantity that risks a modest fraction of one account can be an oversized bet on a smaller one. The correct behavior is to fix the risk — the same percentage, the same R — and derive a *different* position size for each account.

The stop must exist **everywhere**. A distributed trade that lands on five accounts with a stop and on a sixth without one hasn't been distributed. It has created five planned trades and one unbounded liability, and the unbounded one is on whichever account you'll notice last.

The failure must be **visible**. If one account rejects the order — connection dropped, symbol not mapped, margin state unexpected — the trader needs to know *now*, not at the end-of-day reconciliation, because a partially distributed position is a position you don't actually hold in the size you think you hold it.

Get all three right and multi-account trading is genuinely one decision with several executions: your risk per account stays fixed at the R you chose, and adding an account adds surface area without adding a single decision. Get any of them wrong and you've built a machine for producing positions you didn't intend.

## The failure mode nobody designs for: the helpful guess

Here's the uncomfortable pattern in a lot of trading automation, and in software generally: when a tool hits a gap in its configuration, it fills the gap with a guess and keeps going.

The symbol isn't mapped for this broker? Take the closest match. No risk percentage set for this account? Fall back to a default. Contract specification missing? Assume the standard one. Each individual guess is well-intentioned and usually right. That's precisely what makes the pattern dangerous — *usually right* means the guesses accumulate silently for months, invisible because nothing breaks, until the one session where a default doesn't match reality. Then a trade goes out on the wrong instrument, or at a size computed from an assumption instead of a decision, on a live funded account with real drawdown rules.

Ask around and you'll find the stories: the correlated symbol that wasn't actually the same market, the fallback lot size that was fine on one account class and absurd on another. The common thread is never malice and rarely even a bug in the narrow sense. The software did what it was built to do. It was built to guess.

For a discretionary tool aimed at a person, guessing is sometimes acceptable. For a system that places risk on evaluation and funded accounts — accounts where a single oversized error can end months of work — it is not. The stakes are asymmetric: a loud failure costs you one missed trade; a quiet wrong guess can cost you an account.

## "Without configuration, nothing is guessed"

The alternative is a principle, and it's worth stating as bluntly as we state it internally: **the software never guesses.** If an account isn't fully configured for a trade — risk parameters, symbol mapping, everything the calculation needs — the system doesn't improvise a value and proceed. It stops, loudly, and tells you exactly which account and exactly what's missing.

This is less convenient in the small. You will occasionally be interrupted by a hard error where a friendlier tool would have hummed along. That interruption is the feature. It means every trade that *does* go out was computed entirely from decisions you actually made — your risk percentage, your stop, your mappings — and never from a default you didn't know existed.

There's a deeper reason to want this, beyond avoiding the one catastrophic mistake: **auditability of trust**. With a guessing system, you can never fully relax, because you can't enumerate what it assumed on your behalf. With a refusing system, the contract is simple: if it executed, it executed your configuration and nothing else. If it couldn't, it said so before any order existed. Trust in trading software isn't built by the tool being clever. It's built by the tool being *predictable* — especially about its own limits.

This mirrors how the drawdown rules themselves work, incidentally. Prop firms don't guess on your behalf either; the limit is the limit. A tool that sits between you and those rules should hold itself to at least that standard.

## How this looks in practice

This principle is load-bearing in how FixedR distributes trades. One trade — one instrument, one direction, one mandatory stop, one risk in R — is fanned out across your prop accounts, with position size derived independently per account from that account's own configuration. Same R everywhere, different quantities everywhere, by construction. And if any account in the set lacks the configuration to do that derivation honestly, the distribution for that account fails loudly and immediately, rather than silently sending something plausible. Works with MetaTrader and NinjaTrader; the principle doesn't change with the platform underneath.

The result is the version of multi-account trading that scales the right thing. Your decision count stays at one. Your risk per account stays at the R you fixed before entry. What multiplies is only execution — and execution, unlike judgment, is exactly the part software should be trusted with, precisely because it refuses to exercise judgment at all.

One decision, many accounts, zero guesses. If that's the kind of cockpit you want between you and your funded accounts, [join the waitlist](/waitlist).
