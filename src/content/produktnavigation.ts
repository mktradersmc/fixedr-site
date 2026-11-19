// Produkt-Navigation — EINE Quelle für Aufklappbanner, Nabe (/product) und Fußzeile.
//
// ⚠️ ERZEUGT aus dem Kanvas-Entwurf `temp/export-web-v5` (FXR-239, 2026-09-11), nicht
// von Hand geschrieben: die Werte sind maschinell aus der Quelldatei ausgewertet worden,
// damit beim Übertragen kein Wort und kein Symbolname abweicht. Wer hier etwas ändert,
// ändert es zuerst im Kanvas — sonst läuft der nächste Export gegen den Bestand.
//
// Zwei Listen, absichtlich getrennt: `BANNER_LANES` sind fünfzehn FÄHIGKEITEN (was das
// Banner zeigt), `FEATURE_PAGES` sind acht SEITEN (was Nabe und Fußzeile führen).
// Mehrere Fähigkeiten dürfen auf dieselbe Seite zeigen.

export interface FeaturePageRef {
  slug: string;
  title: string;
  /** Symbolname, s. src/components/Icon.astro */
  icon: string;
  /** Lane-Beschriftung, für die Kachel-Fußzeile auf /product und das Kopfband. */
  lane: string;
}

export interface BannerItem {
  /** Eigenes Strichsymbol je Punkt — v5 ersetzt damit die Mono-Nummern aus v4. */
  icon: string;
  title: string;
  text: string;
  slug: string;
}

export interface BannerLane {
  name: string;
  icon: string;
  items: BannerItem[];
}

export const FEATURE_PAGES: FeaturePageRef[] = [
  {
    "slug": "accounts",
    "title": "Accounts and risk",
    "icon": "layers",
    "lane": "The trade"
  },
  {
    "slug": "protection",
    "title": "Protection",
    "icon": "shield",
    "lane": "The trade"
  },
  {
    "slug": "charts",
    "title": "Charts and drawing",
    "icon": "pen",
    "lane": "The trade"
  },
  {
    "slug": "indicators",
    "title": "Indicators",
    "icon": "pulse",
    "lane": "The trade"
  },
  {
    "slug": "workspaces",
    "title": "Workspaces and timeframes",
    "icon": "grid",
    "lane": "The trade"
  },
  {
    "slug": "backtesting",
    "title": "Backtesting and replay",
    "icon": "replay",
    "lane": "Practice and review"
  },
  {
    "slug": "journal",
    "title": "Journal",
    "icon": "book",
    "lane": "Practice and review"
  },
  {
    "slug": "metrics",
    "title": "Metrics in R",
    "icon": "chart",
    "lane": "Practice and review"
  },
  {
    "slug": "planning",
    "title": "Planning view",
    "icon": "clock",
    "lane": "Around it"
  },
  {
    "slug": "alerts",
    "title": "Alerts and calendar",
    "icon": "bell",
    "lane": "Around it"
  },
  {
    "slug": "start",
    "title": "Getting started",
    "icon": "compass",
    "lane": "Around it"
  }
];

export const BANNER_LANES: BannerLane[] = [
  {
    "name": "Your working surface",
    "icon": "pen",
    "items": [
      {
        "icon": "pen",
        "title": "Charts and drawing tools",
        "text": "60+ tools, saved automatically, identical in replay",
        "slug": "charts"
      },
      {
        "icon": "grid",
        "title": "Layouts and custom timeframes",
        "text": "Saved arrangements, intervals like M90",
        "slug": "workspaces"
      },
      {
        "icon": "bell",
        "title": "Alerts",
        "text": "Price levels, trendlines, candle patterns — and they reach your phone",
        "slug": "alerts"
      },
      {
        "icon": "command",
        "title": "Command palette and calendar",
        "text": "Ctrl+K finds everything; the economic calendar sits in a pane",
        "slug": "start"
      },
      {
        "icon": "pulse",
        "title": "Indicators",
        "text": "50+ standard indicators, 18 candle patterns and our own, identical in replay",
        "slug": "indicators"
      },
      {
        "icon": "clock",
        "title": "Planning view",
        "text": "Week calendar and economic calendar in one window",
        "slug": "planning"
      }
    ]
  },
  {
    "name": "Test and build a strategy",
    "icon": "replay",
    "items": [
      {
        "icon": "clock",
        "title": "Replay controls",
        "text": "Play, pause, step, jump; several symbols on one clock",
        "slug": "backtesting"
      },
      {
        "icon": "resume",
        "title": "Sessions that resume",
        "text": "Pick a backtest up where you left it",
        "slug": "backtesting"
      },
      {
        "icon": "idea",
        "title": "A strategy from an idea",
        "text": "Describe a setup, get a rule set you can test",
        "slug": "backtesting"
      },
      {
        "icon": "sigma",
        "title": "Expectancy in R",
        "text": "Per symbol, per week, per session",
        "slug": "metrics"
      }
    ]
  },
  {
    "name": "Accounts over a career",
    "icon": "layers",
    "items": [
      {
        "icon": "archive",
        "title": "Account lifecycle",
        "text": "Archive a failed challenge, the history stays",
        "slug": "accounts"
      },
      {
        "icon": "pulse",
        "title": "Live data guard",
        "text": "Green only when candles actually arrive, and it repairs itself",
        "slug": "accounts"
      },
      {
        "icon": "shield",
        "title": "Firm rule profiles",
        "text": "Maintained rule sets per prop firm, not hand-entered numbers",
        "slug": "accounts"
      },
      {
        "icon": "ladder",
        "title": "Protection",
        "text": "Drawdown, daily loss and news windows, enforced in the terminal",
        "slug": "protection"
      },
      {
        "icon": "compass",
        "title": "Guided setup",
        "text": "Six guides for six purposes, plus a todo panel until you are done",
        "slug": "start"
      }
    ]
  },
  {
    "name": "On the way",
    "icon": "path",
    "items": [
      {
        "icon": "book",
        "title": "Automatic trade documentation",
        "text": "The plan next to the result, without typing it up",
        "slug": "journal"
      },
      {
        "icon": "statement",
        "title": "The monthly guardian statement",
        "text": "What the tool quietly prevented over a month",
        "slug": "metrics"
      }
    ]
  }
];

export const LANE_OF: Record<string, string> = Object.fromEntries(FEATURE_PAGES.map((p) => [p.slug, p.lane]));

/**
 * Eine Zeile je Seite — für die Kacheln auf /product. Abgeleitet aus dem ERSTEN
 * Banner-Punkt, der auf diese Seite zeigt, statt sie ein zweites Mal zu pflegen:
 * sonst stünde derselbe Satz an zwei Orten und driftet auseinander.
 */
export const LINE_OF: Record<string, string> = Object.fromEntries(
  FEATURE_PAGES.map((p) => [
    p.slug,
    BANNER_LANES.flatMap((l) => l.items).find((i) => i.slug === p.slug)?.text ?? '',
  ]),
);

export const bySlug = (slug: string): FeaturePageRef | undefined => FEATURE_PAGES.find((p) => p.slug === slug);

// Jeder Banner-Punkt muss auf eine existierende Seite zeigen, und jede Seite muss von
// mindestens einem Punkt erreichbar sein — sonst entstünde eine Seite, die im Banner
// fehlt, oder ein Punkt, der ins Leere führt. Beim Bau werfen, nicht still danebenliegen.
{
  const slugs = new Set(FEATURE_PAGES.map((p) => p.slug));
  for (const lane of BANNER_LANES) {
    for (const item of lane.items) {
      if (!slugs.has(item.slug)) {
        throw new Error(`produktnavigation: Banner-Punkt "${item.title}" zeigt auf "${item.slug}" — die Seite gibt es nicht.`);
      }
    }
  }
  const erreicht = new Set(BANNER_LANES.flatMap((l) => l.items.map((i) => i.slug)));
  for (const p of FEATURE_PAGES) {
    if (!erreicht.has(p.slug)) {
      throw new Error(`produktnavigation: die Seite "${p.slug}" wird von keinem Banner-Punkt erreicht.`);
    }
  }
}
