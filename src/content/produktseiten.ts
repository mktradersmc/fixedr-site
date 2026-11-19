// Inhalt der acht Feature-Seiten unter /product/.
//
// ⚠️ ERZEUGT aus dem Kanvas-Entwurf `temp/export-web-v5` (FXR-239, 2026-09-11).
// Der Entwurf trägt den Text mit — er ist maschinell aus der Quelle übernommen, nicht
// abgeschrieben. Änderungen gehören zuerst ins Kanvas.
//
// `tabs` und `chrom` gehören zum Produkt-Ausschnitt: sie füllen dessen Fensterchrom
// (Reiterzeile links, Statuszeile rechts) und sind deshalb je Seite verschieden.

export interface SeitenBlock {
  h2: string;
  ps: string[];
  /** Optionale Punkteliste: `b` = fett vorangestellt, `t` = der Satz dahinter. */
  punkte?: { b: string; t: string }[];
}

export interface Produktseite {
  eyebrow: string;
  h1: string;
  lede: string;
  claim: string;
  /** Reiter im Fensterchrom des Ausschnitts. */
  tabs: string[];
  /** Rechte Statuszeile im Fensterchrom. */
  chrom: string;
  bloecke: SeitenBlock[];
}

export const SEITEN: Record<string, Produktseite> = {
  "accounts": {
    "eyebrow": "The trade",
    "h1": "The rules follow the trader, not the login.",
    "tabs": [
      "Order",
      "Accounts",
      "Rules"
    ],
    "chrom": "3 accounts · 2 configured",
    "lede": "A prop trader rarely has one account. Different firms, different platforms, different balances — and a limit breached on one of them ends the same way regardless of what the other three were doing. One ticket, checked and sized per account, closes that gap.",
    "claim": "The rules belong to the trader, not to a login. FixedR applies the same order across every account you hold, each one sized from its own risk, its own firm's limits already checked.",
    "bloecke": [
      {
        "h2": "One order, several accounts, no guessing",
        "ps": [
          "Place the order once. FixedR sizes it for each account from that account's own risk — never copied blindly from another one, because two accounts of different sizes with the same contract count are not taking the same risk. You choose which accounts the order goes to: all of them, or a selection.",
          "An account that has not been configured does not get a guessed size. It stops the distribution with a loud error instead — silence here would mean a position nobody sized on purpose."
        ],
        "punkte": [
          {
            "b": "Sized per account.",
            "t": "Each ticket computed from that account's own risk, not copied."
          },
          {
            "b": "Pick the set.",
            "t": "All accounts, or a chosen few, per order."
          },
          {
            "b": "No silent guess.",
            "t": "An unconfigured account halts the order with an explicit error."
          }
        ]
      },
      {
        "h2": "Firm rules, checked before the order leaves",
        "ps": [
          "Drawdown limit, daily loss limit, flatten time — every prop firm writes its own version of these, and a breach on any one account can end that account on the spot. FixedR checks the rule for each account before the order is sent, on every account at once, not after a fill comes back and it is too late to undo."
        ],
        "punkte": [
          {
            "b": "Drawdown and daily loss.",
            "t": "Checked against the account's own limit, not a generic one."
          },
          {
            "b": "Flatten time.",
            "t": "Enforced on the account it belongs to, not remembered separately by you."
          },
          {
            "b": "Before, not after.",
            "t": "The check runs before the order leaves, on every account at once."
          }
        ]
      },
      {
        "h2": "Rule profiles, not hand-typed numbers",
        "ps": [
          "Each prop firm's rule set lives as a maintained profile rather than a set of figures you transcribe from a PDF and hope you got right. Attach the profile to the account and the limits above are the firm's own, kept current."
        ]
      },
      {
        "h2": "Payout protection",
        "ps": [
          "Once an account is eligible for payout, FixedR can pause trading on it until the money is actually out. Most risk tooling exists to protect you from a loss. This protects a gain that already happened, from a trade placed after the fact that undoes it."
        ]
      },
      {
        "h2": "Risk that follows a rule, not a mood",
        "ps": [
          "1 R does not have to be the same fraction forever. Smaller in a drawdown, larger near a target — written into the account profile as a rule ahead of time, not decided in the moment a trade looks tempting."
        ]
      },
      {
        "h2": "An account lifecycle that keeps its history",
        "ps": [
          "A failed challenge is archived, not deleted — the trades and the statistics stay reachable. Hiding a still-open account asks first, so a mis-click never removes something you are still trading."
        ],
        "punkte": [
          {
            "b": "Archived, not erased.",
            "t": "A failed challenge keeps its full record."
          },
          {
            "b": "Asks first.",
            "t": "Hiding a live account needs confirmation, not a single click."
          },
          {
            "b": "Reversible.",
            "t": "A switch brings closed accounts back into view."
          }
        ]
      },
      {
        "h2": "Watching the data feed, not just the account",
        "ps": [
          "An account only shows green when candles are actually arriving. If the feed goes quiet, it turns yellow instead of staying falsely green, and three stages of self-healing try to repair the connection — usually before you notice anything happened."
        ]
      },
      {
        "h2": "Two platforms, one order",
        "ps": [
          "MetaTrader 5 and NinjaTrader 8 accounts sit under the same order ticket, so one order can go to accounts on both. Broker passwords are kept in the Windows Credential Manager, not in a file, and are never sent to us."
        ]
      },
      {
        "h2": "What still depends on the broker",
        "ps": [
          "The stop itself sits with the broker, not with us. If FixedR were to go offline, an order already placed with a stop attached still closes where it was set — the software watches and enforces the rule, it does not stand between your stop and the market."
        ]
      }
    ]
  },
  "charts": {
    "eyebrow": "The trade",
    "h1": "The tool you write the analysis with.",
    "tabs": [
      "NQ · M15",
      "ES · M15",
      "+"
    ],
    "chrom": "62 tools · auto-saved",
    "lede": "A level, a trendline, a note on the chart — none of it means anything if it disappears the moment you close the window. Charts in FixedR are where the analysis is drawn, saved, and trusted to still be there tomorrow.",
    "claim": "An analysis that only exists in your head is not an analysis yet. FixedR is the tool you write it down with, and it keeps what you wrote.",
    "bloecke": [
      {
        "h2": "Over sixty tools",
        "ps": [
          "Trendlines, Fibonacci tools, notes pinned directly to the chart, a position calculator, and more besides — the drawing kit is not a short list of the obvious ones. Whatever the setup needs marked, there is a tool built for marking it, rather than a workaround with the two or three that shipped."
        ]
      },
      {
        "h2": "Saved without asking",
        "ps": [
          "Every drawing is saved automatically and restored the next time you open the chart. Closing a window is not a decision to throw away the work on it — an analysis you spent twenty minutes building is exactly where you left it."
        ]
      },
      {
        "h2": "The same tools, live and in replay",
        "ps": [
          "A trendline drawn during replay is not a lesser, throwaway kind of object compared to one drawn live — it is the same kind of object, made with the same tool, on the same chart. That is what makes practice actually transferable."
        ],
        "punkte": [
          {
            "b": "One tool set.",
            "t": "No separate, cut-down drawing kit for replay."
          },
          {
            "b": "Same object type.",
            "t": "A replay drawing and a live drawing are equal, not similar."
          }
        ]
      },
      {
        "h2": "Style once, reuse everywhere",
        "ps": [
          "Style templates, multi-select, and grouping mean a recurring annotation is not re-styled by hand every time it appears. Set the look once, apply it to the next twenty lines, and move the group as one thing when the chart needs rearranging."
        ],
        "punkte": [
          {
            "b": "Style templates.",
            "t": "A look defined once, applied to every new drawing of that kind."
          },
          {
            "b": "Multi-select and grouping.",
            "t": "Several drawings moved or restyled as one."
          }
        ]
      },
      {
        "h2": "Indicators that come with the platform",
        "ps": [
          "Support and resistance, ICT sessions, news markers, candle patterns, market structure, and fair-value gaps are part of the standard set. They sit on the chart next to your own drawings rather than in a separate panel you have to reconcile against them."
        ]
      },
      {
        "h2": "A drawing that belongs to a trade",
        "ps": [
          "Click an object on the chart and it is attached to a trade, not just to a window position. The mark you made to justify an entry stays connected to the entry it justified, long after the chart has scrolled on."
        ]
      },
      {
        "h2": "What the tools do not do",
        "ps": [
          "Tools do not replace a strategy. What they do is make an existing one checkable — a setup you can point to on the chart is a setup you can argue with, which is the only kind worth trading."
        ]
      },
      {
        "h2": "Managing the trade on the chart",
        "ps": [
          "An open trade is handled where you see it. Take a partial close, move the stop to breakeven, or drag a mark to a new level — the chart is the control, not a form beside it. The long and short tool draws the trade with a fixed reward-to-risk ratio, so the target follows the stop instead of being guessed separately."
        ],
        "punkte": [
          {
            "b": "Partial close and breakeven.",
            "t": "Handled on the chart itself."
          },
          {
            "b": "Marks by dragging.",
            "t": "Levels are moved by dragging them on the chart."
          },
          {
            "b": "Long and short tool.",
            "t": "A fixed reward-to-risk ratio, drawn as part of the trade."
          },
          {
            "b": "Split chart.",
            "t": "A chart divided within its window."
          }
        ]
      }
    ]
  },
  "workspaces": {
    "eyebrow": "The trade",
    "h1": "An arrangement of windows becomes a structure.",
    "tabs": [
      "London open",
      "NY session",
      "+"
    ],
    "chrom": "layout 3 of 10 · saved",
    "lede": "Anyone can put four charts on a screen. The question that decides whether it helps is what each one is doing there — and whether the setup survives being closed and reopened tomorrow.",
    "claim": "An arrangement of windows is not yet a structure. Naming what each chart is for turns it into one.",
    "bloecke": [
      {
        "h2": "One symbol, several timeframes, side by side",
        "ps": [
          "The same instrument across multiple timeframes at once, each tile carrying its own symbol, timeframe, and indicators. Nothing forces the tiles to match each other — a workspace can just as easily hold four different symbols as one symbol four times over."
        ]
      },
      {
        "h2": "A role, not a position",
        "ps": [
          "Every chart in a workspace can be given a role — HTF, MTF, LTF. Synchronisation follows that role, not the tile's position on screen. Move the windows around and the higher timeframe is still the higher timeframe; it does not quietly become the middle one because it changed corners.",
          "That is the difference between an arrangement of windows and a named structure. The charts belong together because you said what each one is for."
        ],
        "punkte": [
          {
            "b": "HTF, MTF, LTF.",
            "t": "A role assigned per chart, independent of screen position."
          },
          {
            "b": "Sync follows the role.",
            "t": "Rearranging tiles does not reassign what they mean."
          }
        ]
      },
      {
        "h2": "Ten layouts",
        "ps": [
          "Splits, a 2×2 grid, and several more besides — the shape of the workspace is chosen from a set built for how charts actually get compared, not squeezed into a single fixed grid."
        ]
      },
      {
        "h2": "Saved arrangements",
        "ps": [
          "A workspace is a state you return to, not something rebuilt from scratch every morning. Close it, reopen it, and the tiles, roles, and layout are exactly where you left them."
        ]
      },
      {
        "h2": "Timeframes the platforms don't offer",
        "ps": [
          "Custom timeframes such as M90 sit alongside the standard ones — intervals the underlying platforms do not provide on their own, available here as an ordinary choice on any tile."
        ]
      },
      {
        "h2": "What more charts do not buy you",
        "ps": [
          "More charts are not more clarity — the role is. Four windows with nothing said about what each is for add noise; the same four windows with HTF, MTF and LTF assigned add up to a single statement about the market."
        ]
      },
      {
        "h2": "More than one monitor",
        "ps": [
          "A workspace can spread across several monitors. A second window carries its own chart group and stays in sync with the first, so the roles keep meaning the same thing on every screen."
        ]
      }
    ]
  },
  "backtesting": {
    "eyebrow": "Practice and review",
    "h1": "Trade the past at your own pace.",
    "tabs": [
      "Replay · NQ",
      "Session 14",
      "+"
    ],
    "chrom": "resumes where you stopped",
    "lede": "Most traders test a strategy by scrolling a chart and imagining the entry. That measures memory, not method. Replay hides the future, hands you the clock, and makes you commit before you can see what happens next.",
    "claim": "A backtest is only worth something if the trade goes in the way a real one does. So in FixedR it does — same order ticket, same mandatory stop, same size computed from your risk, same result in R.",
    "bloecke": [
      {
        "h2": "The clock is yours",
        "ps": [
          "Play, pause, step one candle, or run at a speed you pick. Jump forward to the session you want to study — or backwards, when you realise the setup started earlier than you thought. The point is not to finish quickly; it is to make the same decision you would make live, with the same information you would have live."
        ],
        "punkte": [
          {
            "b": "Step and speed.",
            "t": "One candle at a time, or continuous at your chosen tempo."
          },
          {
            "b": "Jump either way.",
            "t": "Forward to a session, backwards when the setup began earlier."
          },
          {
            "b": "Several symbols, one clock.",
            "t": "Correlated markets move together, as they did."
          },
          {
            "b": "Draw as you would live.",
            "t": "The same tools, on the same charts, saved the same way."
          }
        ]
      },
      {
        "h2": "Orders that behave like orders",
        "ps": [
          "Market, limit and stop entries, a stop-loss and a target, partial exits when you take something off. The position size is computed from your stop distance and the risk you chose — exactly as it is on a live account, because it is the same mechanism, not a simplified copy of it.",
          "A test where you enter with a round number of contracts and no stop measures a different strategy than the one you actually trade. Here the constraint that shapes your live trading — no stop, no trade — shapes the test too."
        ]
      },
      {
        "h2": "A session you can come back to",
        "ps": [
          "Testing a market properly takes longer than one sitting. A replay session in FixedR keeps its state: the symbol, the point in time, the charts you arranged, the trades you already took. You close it and pick it up where you stopped."
        ],
        "punkte": [
          {
            "b": "State survives.",
            "t": "Time, charts, trades — the session is a place, not a run."
          },
          {
            "b": "Its own evaluation.",
            "t": "Each session and symbol gets its own read-out in R."
          }
        ]
      },
      {
        "h2": "From an idea to something testable",
        "ps": [
          "Describe the setup in your own words — the conditions, what invalidates it, where the stop goes — and get back a rule set written down explicitly enough to run against real candles.",
          "An unwritten strategy cannot be broken, and therefore cannot be improved either. The strategies that ship with FixedR work the same way: their trades are drawn on the chart, entry, stop and target as bands, so you check the mechanism by looking at it rather than by trusting a summary row."
        ]
      },
      {
        "h2": "Prop challenge simulation",
        "ps": [
          "A programme's rules can run along with the replay clock. Drawdown floor, daily loss limit and the rest are checked as simulated time passes, and each session ends as passed or broken. Fees and payouts are not modelled — the simulation tests whether the rules held, nothing more."
        ]
      },
      {
        "h2": "Costs the way a broker charges them",
        "ps": [
          "Spread, commission, slippage and swap are part of the test. A result that ignores them measures a market nobody can trade."
        ]
      },
      {
        "h2": "Reading the result",
        "ps": [
          "Each session is evaluated as an R curve with its drawdown beside it. Start at a random point in the data when you do not want to pick the day, and jump to the next session when you do."
        ]
      },
      {
        "h2": "What the record is for",
        "ps": [
          "Every replay trade lands in the same record as a live one, in R. A month of practice and a month of trading are comparable, and the routine you build in replay is the routine you already know when it counts. The honest limit belongs here too — a replay is the market without the money. It trains the method. It does not simulate the fear."
        ]
      }
    ]
  },
  "journal": {
    "eyebrow": "Practice and review",
    "h1": "The journal fills itself, because the order was set here first.",
    "tabs": [
      "Journal",
      "Entry #412",
      ""
    ],
    "chrom": "written at entry · closed 10:14",
    "lede": "FixedR sits where the entry happens. It sets the order, sizes it from the risk you fixed, and keeps writing while the trade is open — not afterwards, from memory. There is no second, later version of the trade for a rule to quietly bend in.",
    "claim": "A journal that requires typing gets filled for a week and then stops. One that fills itself is still there in month three.",
    "bloecke": [
      {
        "h2": "No second version of the trade",
        "ps": [
          "FixedR places the order. It computes the size from the stop you drew and the risk you chose, and the record keeps running while the position is open. The sizing that happened is the sizing that gets logged — not a number typed in afterwards from memory, in whichever direction memory happens to round."
        ]
      },
      {
        "h2": "The plan next to the outcome",
        "ps": [
          "What you intended to do and what actually happened sit in the same place, without a separate step to write either one up. The plan was the order ticket; the outcome is the trade as it closed. Comparing them is reading two fields on one entry."
        ]
      },
      {
        "h2": "Setup, rule adherence, outcome",
        "ps": [
          "Three things carry an entry, and each answers a different question."
        ],
        "punkte": [
          {
            "b": "Setup.",
            "t": "Which named idea the trade belongs to, recorded at entry, not decided in hindsight."
          },
          {
            "b": "Rule adherence.",
            "t": "Whether the trade matched the plan written for it — size, stop, target."
          },
          {
            "b": "Outcome.",
            "t": "What the trade closed at, in R, next to the setup and the check it belongs to."
          }
        ]
      },
      {
        "h2": "The chart, at the moment",
        "ps": [
          "Every entry keeps a screenshot of the chart as it looked when the decision was made — not a chart pulled up later and redrawn until the setup looks cleaner than it was. That is the difference between a record and a reconstruction. The screenshot is taken automatically for each trade."
        ]
      },
      {
        "h2": "Tags and strategy",
        "ps": [
          "Every entry belongs to a named strategy, and can carry tags on top of it. A review that asks how the pullback strategy did this month is asking a question the label already answers."
        ]
      },
      {
        "h2": "Your own traits, and a rating before the trade",
        "ps": [
          "Each strategy can carry traits of its own — the things you want to see on every entry of that strategy. A rating given before the trade sits on the entry too, so how sure you were is on the record next to how it ended."
        ]
      },
      {
        "h2": "Notes, and the part that never gets automated",
        "ps": [
          "Below the fields there is a plain-text note, for whatever the automatic part left out — why you actually took the trade, what the session felt like. Nothing enforces a structure there; the format is your own words.",
          "Journaling usually fails for a boring reason: it is work that happens after the trade, exactly when there is the least appetite for it. A journal that fills itself is the one still there after four weeks."
        ]
      }
    ]
  },
  "metrics": {
    "eyebrow": "Practice and review",
    "h1": "One record that survives changing accounts.",
    "tabs": [
      "Metrics",
      "Calendar",
      "Per symbol"
    ],
    "chrom": "all accounts · in R",
    "lede": "Every currency statistic resets when your account size changes. Average win, worst day, best month — all of them stop being comparable the moment you scale. Expressed as multiples of the risk you fixed yourself, they never do.",
    "claim": "A number is only useful if it means the same thing next year. Measured in R, yours does — the same routine reads identically on a small account and a large one.",
    "bloecke": [
      {
        "h2": "The numbers, and what each one is for",
        "ps": [
          "Not a wall of tiles. A short set that answers the questions a trader actually asks after a week: did I win more often than I lost, was the average winner bigger than the average loser, and did the whole thing add up to anything."
        ],
        "punkte": [
          {
            "b": "Winrate.",
            "t": "How often, not how much — on its own it decides nothing."
          },
          {
            "b": "Average R.",
            "t": "What a typical trade returned, measured in your own unit of risk."
          },
          {
            "b": "Expectancy.",
            "t": "The two above combined: what one trade is worth on average."
          },
          {
            "b": "Net percentage.",
            "t": "The account's own yardstick, the one your firm also uses."
          }
        ]
      },
      {
        "h2": "Per symbol, per week, per session",
        "ps": [
          "An aggregate hides the thing you need to change. Broken down by symbol, it usually turns out that the edge lives in two of them and the rest is noise with commission attached. Broken down by week, a run of discipline looks different from a run of luck. Broken down by replay session, practice stops being a feeling about how it went."
        ]
      },
      {
        "h2": "The calendar",
        "ps": [
          "Days as cells, in R. A month you can read in two seconds: where the streaks sat, which day broke the rhythm, how much of the result came from one afternoon. Scale from a small evaluation account to a large funded one and the calendar reads exactly the same.",
          "It is also the cheapest honesty check there is. A single oversized cell says more about a month than any average does."
        ]
      },
      {
        "h2": "Streaks and the deepest hole",
        "ps": [
          "Two numbers that decide whether a strategy is tradeable by you rather than in principle: the longest run of losses it has actually produced, and the deepest drawdown it went through on the way to its result. A method with a fine average and a run you cannot sit through is not a method you can use."
        ]
      },
      {
        "h2": "The patterns you cannot see from inside",
        "ps": [
          "Behaviour shows up in the data long before you would admit it in words. Position size creeping up after two losses. Losers held several times longer than winners. A measurably worse hour late in the day. The record states it plainly, out of your own trades.",
          "The order matters: the mirror first, the interpretation second, and only as an offer. The record tells you what you did. What to do about it stays your call."
        ]
      },
      {
        "h2": "The monthly statement of what did not happen",
        "ps": [
          "Protection is invisible when it works. Once a month, the record adds up the things that quietly did not go wrong: orders held to the exact size, stops that were never moved, sessions stopped at the limit instead of continued. It is the answer to the only question that matters when a subscription renews — what is this actually doing for me."
        ]
      }
    ]
  },
  "alerts": {
    "eyebrow": "Around it",
    "h1": "It reaches you before you're back at the screen.",
    "tabs": [
      "NQ · M15",
      "Alerts · 3",
      "Calendar"
    ],
    "chrom": "phone paired",
    "lede": "FixedR watches the charts even when you don't. Set an alert once, on the object you already work with — not a number typed into a list you have to remember — and it comes to you, instead of you having to go looking for it.",
    "claim": "An alert only matters if it reaches you before the level does. FixedR sends it to your phone, not just to a chart you have already stopped watching.",
    "bloecke": [
      {
        "h2": "Attached to what you drew, not typed in",
        "ps": [
          "A price-level alert fires on a level you marked on the chart. A trendline alert is the same idea for a slanted line: the trigger follows the line's current value, because it is attached to the drawn object, not to a number captured the day you drew it."
        ],
        "punkte": [
          {
            "b": "Price levels.",
            "t": "Fires on a level marked once, directly on the chart."
          },
          {
            "b": "Trendlines.",
            "t": "Attached to the drawn line, so the trigger moves as the line does."
          },
          {
            "b": "Candle patterns.",
            "t": "Recognised shapes, without a screen to watch for them."
          },
          {
            "b": "Custom ranges.",
            "t": "A band you define, not a single price."
          }
        ]
      },
      {
        "h2": "On your phone, without a second account",
        "ps": [
          "Alerts push to your phone while you are away from the screen. Pairing a phone is a QR code scanned once, cockpit to handset — there is no account to create with us, and no login beyond the one already on your desk.",
          "The phone app is built for Android. There is no iOS version — that is the honest state of it today, not a footnote to skip past."
        ]
      },
      {
        "h2": "Encrypted end to end",
        "ps": [
          "The key is exchanged by that same QR code, so the relay between your computer and your phone cannot read an alert. The computer has to be running: the alerts come from the cockpit on your desk, and the phone only receives them."
        ]
      },
      {
        "h2": "The calendar you're already looking at",
        "ps": [
          "An economic calendar panel — by day, week or month — sits in the same window as your charts, so checking for news is not a separate errand on a separate site. On the chart itself, markers show exactly where a release fell, on the candles it moved."
        ]
      },
      {
        "h2": "“A net, not a guarantor.”",
        "ps": [
          "News protection locks the affected symbol for a window around a high-impact release, with a buffer on either side; every other symbol stays tradable. The times come from the economic calendar. It catches most of what would otherwise catch you; it does not promise that every release ends quietly."
        ]
      },
      {
        "h2": "Who decides",
        "ps": [
          "The server that watches your alerts and your calendar never sends an order. It watches, and it tells you. The decision to act — resize, exit, sit still — stays with you, and the position itself lives with your broker, not with FixedR. An alert is a reminder, not a safeguard. What actually holds a trade is the stop sitting at the broker."
        ]
      }
    ]
  },
  "start": {
    "eyebrow": "Around it",
    "h1": "Your first trade in R, inside fifteen minutes.",
    "tabs": [
      "Start",
      "Order",
      "Guides · 2/6"
    ],
    "chrom": "demo account connected",
    "lede": "Connect a demo account, place a trade sized in R, and watch the size calculation and the distance-to-limit display do their job once. That sequence is the entire pitch of the product, experienced rather than described — so it happens first, not after a settings screen.",
    "claim": "Fifteen minutes should teach you what the cockpit does, not what its menus are called.",
    "bloecke": [
      {
        "h2": "The first fifteen minutes decide",
        "ps": [
          "Connect a demo account, set a first trade sized in R, and see the size calculation and the limit display work once, on a real order. Ask someone to configure indicators before any of that happens, and the moment is gone before it started — the guided setup exists to put the experience first and the configuration after it."
        ]
      },
      {
        "h2": "Not another tool you invest in and hope",
        "ps": [
          "Backtesting and journal tools are, as a category, investment tools: you pay, you put in weeks of work, and only later find out whether it paid off. FixedR is built to be different at the very first trade. Click an entry and a stop, choose a fraction of a unit of risk, and the size is computed on the spot; the trade then runs in R, with the distance to the daily limit sitting right next to it."
        ]
      },
      {
        "h2": "Six guides, each with one job",
        "ps": [
          "A generic click-through teaches “next, next, next” and nothing about why. Six purpose-built guides replace it instead — connecting an account, placing a sized trade, reading the limit display, and the rest — each with a speech bubble that points at the real control on the real screen, not at a screenshot of it."
        ]
      },
      {
        "h2": "A todo panel, not a one-time tour",
        "ps": [
          "The guides are not something you dismiss and never see again. A todo panel keeps the same list as a permanent fixture: what is still open, with a direct jump to wherever it lives. Hint points sit on the parts of the cockpit whose setup isn't finished yet.",
          "The start dashboard itself decides what it's looking at: a fresh cockpit shows a setup checklist, a cockpit already running shows the week's numbers instead."
        ]
      },
      {
        "h2": "Ctrl+K, and no menu to learn",
        "ps": [
          "A command palette opens with Ctrl+K and searches the whole application as text — every account, every setting, every panel. Finding something is typing its name, not remembering which menu it was filed under."
        ]
      },
      {
        "h2": "Installed once, on your own machine",
        "ps": [
          "FixedR is a Windows application with an installer. No cloud account holds your setup, no browser tab keeps it alive — it runs on the machine in front of you, the same way it did the day before.",
          "Fifteen minutes teaches the mechanics: connecting an account, sizing a trade, reading a limit. It does not teach the strategy — deciding what to trade and when stays your work, same as it always was."
        ]
      }
    ]
  },
  // FXR-1765: drei Seiten nach Stand November 2026, gleiches Muster wie oben.
  "protection": {
    "eyebrow": "The trade",
    "h1": "Your firm's rules, enforced where the order executes.",
    "tabs": [
      "Guard",
      "Rules",
      "News"
    ],
    "chrom": "guard active · rules per account",
    "lede": "A prop firm's programme is a list of limits, and each account has its own copy of it. The guard holds that list for every account and enforces it in the terminal itself, at the place the order is executed.",
    "claim": "A rule you have to remember is a rule you will eventually break. The guard remembers it for you, on every account, and tells you when it is not running.",
    "bloecke": [
      {
        "h2": "The programme's rules, per account",
        "ps": [
          "The rules of the firm's programme apply to each account on its own. Three of them carry most of the weight."
        ],
        "punkte": [
          {
            "b": "Drawdown floor.",
            "t": "Static or trailing, measured on equity or on balance — as the programme defines it."
          },
          {
            "b": "Daily loss limit.",
            "t": "The day's limit for that account, not a figure shared with the others."
          },
          {
            "b": "News window.",
            "t": "A window around high-impact releases, with a buffer on either side."
          }
        ]
      },
      {
        "h2": "Enforced in the terminal",
        "ps": [
          "In MetaTrader, the FixedR Expert Advisor runs inside the terminal and enforces the rules there — where the order is executed, not in a window beside it. For NinjaTrader the same is built."
        ]
      },
      {
        "h2": "You see whether it is running",
        "ps": [
          "The state of the guard is reported back to the cockpit and shown. If the guard is not active on an account, the interface says so. Silence never means that everything is fine."
        ]
      },
      {
        "h2": "News locks the symbol it concerns",
        "ps": [
          "The news guard blocks only the affected symbol. A release that moves one market does not stop you trading another. The times come from the economic calendar on the planning view."
        ]
      },
      {
        "h2": "Target close",
        "ps": [
          "When an account reaches its profit target, it closes. The target is a stopping point, not a number to push past."
        ]
      },
      {
        "h2": "Payout protection",
        "ps": [
          "Once an account is eligible for payout, FixedR can pause trading on it until the money is actually out. Most risk tooling exists to protect you from a loss. This protects a gain that already happened, from a trade placed after the fact that undoes it."
        ]
      },
      {
        "h2": "Recognised by the account name, maintained by us",
        "ps": [
          "FixedR recognises the firm from the name of the account and applies that firm's rule profile. We maintain the profiles and deliver them. Maintained today: Apex, FTMO, IQ Capital and Lucid. In preparation: FundedNext, The5ers, MyFundedFutures, Blue Guardian, Alpha Capital Group and Sure Leverage Funding."
        ]
      },
      {
        "h2": "A net, not a guarantor",
        "ps": [
          "The guard enforces the rules it knows, on the accounts it is running on. It is a net, not a guarantor: it does not decide your trades, and the stop that holds a position still sits with the broker."
        ]
      }
    ]
  },
  "indicators": {
    "eyebrow": "The trade",
    "h1": "The indicators come with the platform.",
    "tabs": [
      "NQ · M15",
      "Indicators",
      "CVD"
    ],
    "chrom": "same in live, test and backtest",
    "lede": "Most of what a chart is asked to show is already built in. More than fifty standard indicators, eighteen candle patterns, and a set of our own for levels, structure and sessions.",
    "claim": "An indicator that behaves differently in a backtest than live tells you nothing about the strategy. Here the same indicator runs in all three places.",
    "bloecke": [
      {
        "h2": "More than fifty standard indicators",
        "ps": [
          "Moving averages, oscillators, volatility and volume are covered, along with 18 candle patterns. The usual ones are there so that you do not need a workaround to put them on a chart."
        ]
      },
      {
        "h2": "Our own indicators",
        "ps": [
          "On top of the standard set there are indicators built by FixedR itself."
        ],
        "punkte": [
          {
            "b": "Institutional Levels.",
            "t": "Drawn on the chart next to your own marks."
          },
          {
            "b": "Liquidity Levels.",
            "t": "A second set of levels, on the same chart."
          },
          {
            "b": "Market Structure.",
            "t": "Shown in three tiers."
          },
          {
            "b": "Opening Gaps.",
            "t": "The new week opening gap (NWOG) and the new day opening gap (NDOG)."
          },
          {
            "b": "Sessions and Pivots.",
            "t": "Both available as indicators in their own right."
          }
        ]
      },
      {
        "h2": "Footprint and CVD for futures",
        "ps": [
          "Footprint candles and a CVD pane are available for futures, drawn from NinjaTrader data. They sit on the chart like any other indicator."
        ]
      },
      {
        "h2": "The same in live, test and backtest",
        "ps": [
          "Live, test and backtest use the same indicators. What you see in replay is what the indicator would have shown live, so a backtest is not read through a different instrument."
        ]
      }
    ]
  },
  "planning": {
    "eyebrow": "Around it",
    "h1": "The week, laid out before it starts.",
    "tabs": [
      "Week",
      "Economic calendar",
      ""
    ],
    "chrom": "news times feed the guard",
    "lede": "A trading week has a shape that is known in advance: when the releases fall, which days are quiet. The planning view puts that shape on one screen, next to the charts it affects.",
    "claim": "Looking at the week before it starts is not a ritual. It is how you find out which hours you are not going to trade.",
    "bloecke": [
      {
        "h2": "A week calendar and an economic calendar",
        "ps": [
          "The planning view holds a week calendar and the economic calendar together. Releases appear at the hour they happen, with their impact, so the day's quiet and loud stretches are visible at a glance."
        ]
      },
      {
        "h2": "The times feed the news guard",
        "ps": [
          "The release times in the calendar are the same times the news guard works from. A window around a release is therefore not typed in separately: it comes from the calendar you are already reading."
        ]
      },
      {
        "h2": "No look-ahead in the backtest",
        "ps": [
          "In a backtest, the calendar shows the actual value only from the simulated moment of publication. Before that moment the release is there, but its result is not. The test cannot know what you could not have known."
        ]
      }
    ]
  }
};
