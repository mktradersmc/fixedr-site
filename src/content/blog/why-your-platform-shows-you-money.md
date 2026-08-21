---
title: "Why your trading platform shows you money — and why ours doesn't"
description: "Money on a trading screen triggers emotion, not analysis. Why denominating everything in R makes risk more visible, not less."
date: 2026-08-21
---

Open any trading platform and look at the top of the screen. There it is: your equity, blinking in currency. Every tick, the number moves. Every tick, some part of your brain does arithmetic it was never asked to do.

That number is not neutral information. It is the single most emotionally loaded object on your screen, and your platform puts it front and center because that is what platforms have always done. Nobody ever asked whether it should be there.

We asked. Then we removed it.

## What money on the screen actually does

A currency number is never just a number. It arrives with context attached — your context, the one you carry around all day.

A losing position stops being a losing position. It becomes rent. It becomes the vacation you were planning. A winning day stops being a winning day and becomes a comparison: that's more than I made in a week at my old job. Should I stop now? Should I press harder?

None of these thoughts are trading thoughts. All of them change trading behavior.

Ask any experienced trader about the trades they regret, and the pattern is consistent: the regretted decision was almost never an analytical error. It was an emotional override. Widening a stop because the loss "felt too big to take." Cutting a winner because the open profit "felt too good to give back." Sizing up after a losing streak to "make it back." Every one of these mistakes requires the trader to be thinking in money at the moment of decision. Take the money away, and the mistake loses its handle.

Traders know this. It's why so many cover their P&L widget with tape, or a sticky note, or a browser extension built for exactly this purpose. When your users are physically covering part of your interface to protect themselves from it, the interface is wrong.

## R: the alternative that was there all along

R is not a new idea. Professional risk managers have used it for decades, and most serious trading literature assumes it. R is simply the amount you decided to risk on a trade, fixed before the trade exists.

You define your risk — say, a fixed percentage of the account. Your stop-loss defines where that risk is realized. Position size is then derived, not chosen: it is whatever quantity makes the distance to your stop equal exactly one R. From that moment on, everything is measured in that unit. A winner that returns twice what you risked is a 2R trade. A stopped-out trade is minus one R. A month is a sum of R.

The arithmetic is identical to money. Nothing is hidden, nothing is lost. What changes is what the number can do to you. "Minus one R" is a unit of a plan. It says: the thing you decided could happen, happened, in exactly the size you decided. It does not say anything about rent.

## The casino chip objection

There is an obvious counterargument, and it deserves a straight answer.

Casinos convert money into chips, and behavioral research on payment abstraction is fairly consistent about why: abstracted money is easier to spend. A chip doesn't feel like money, so players part with it more freely. If hiding the currency makes gamblers looser, doesn't hiding the currency make traders looser too? Isn't R just a chip?

No — and the difference is the entire point.

A casino chip abstracts money in order to *obscure* risk. The chip has no stop-loss. There is no moment where the player writes down the maximum they can lose on the next hand, and no mechanism enforcing it. The abstraction exists so that risk stays vague, because vague risk is what the house sells.

R does the opposite. R does not exist until you have made your risk explicit. The unit *is* the risk: fixed in size, capped by a stop, decided before entry. You cannot denominate a trade in R without first answering the question the casino is designed to prevent you from asking — *exactly how much am I prepared to lose here?*

The chip hides the risk inside an abstraction. R hides the money inside the risk. These are not the same move. They are opposite moves that happen to share a surface feature.

Put differently: abstraction is dangerous when it removes the loss from view. R puts the loss in view first, before anything else is allowed to happen, and only then removes the currency. Risk becomes more visible, not less. What becomes invisible is the emotional payload — the rent, the salary comparison, the vacation — that was never information in the first place.

## A commitment device, not a gimmick

Behavioral economists have a name for structures like this: commitment devices. Arrangements you set up in a calm moment to bind the version of yourself that will not be calm.

The calm version of you knows the rules. Risk a fixed fraction. Honor the stop. Judge the system over a large sample, not a single trade. The version of you that is down on the day, three hours into a session, staring at a red currency number — that version negotiates. Removing the currency removes the negotiating table. You cannot agonize over an amount of money you cannot see. What remains on screen is the only question that was ever worth asking: is this trade, at this risk, a good trade by your own rules?

This matters doubly in prop trading, where the accounts aren't even yours and the real asset is your ability to follow rules under a drawdown limit. A prop trader's edge is discipline compounded over evaluations and payouts. Everything on the screen should serve that discipline. A live currency ticker serves nothing but the tilt.

## The money was never in the account anyway

For prop traders there is one more argument, and it may be the most honest one: the balance of a challenge or funded account is notional. It is not your money. In many arrangements it isn't literal firm capital either — it is a number in an evaluation system. The only real money in the entire process is the fee you paid to enter and the payout you eventually receive, and neither of those lives inside a trading platform.

A currency display on a notional account projects a concreteness that does not exist. What does exist, and what actually decides whether you keep the account, is your distance to the drawdown limit and your distance to the target — both defined by the firm as percentages, both perfectly expressible in R. A platform that shows you dollars on a challenge account is, in a quiet way, misrepresenting the situation. A platform that shows you your remaining risk budget is describing it exactly.

## Built into the walls

You can practice R-thinking on any platform. Journal in R, tape over the P&L, do the conversion in your head. Many disciplined traders do, and it works — until the one stressed evening it doesn't, because the money was always one glance away.

We took the other route when we built FixedR: make the discipline structural. There is no money display to cover, because there is no money display. Every trade requires a stop-loss before it can exist — not as a nag, but because without a stop there is no R, and without R there is nothing to show. Position size falls out of the risk percentage. The journal, the calendar, the stats: all denominated in R, comparable across accounts and across months, silent about currency.

Not a hidden setting. Not a toggle someone flips at midnight after a losing streak. The absence of money is the architecture.

Your platform shows you money because it inherited a default nobody questioned. We questioned it, and the answer changed what we built.

If that sounds like the cockpit you've been taping sticky notes onto your current platform to approximate, [join the waitlist](/waitlist).
