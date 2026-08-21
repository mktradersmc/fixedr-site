# UEBERGABE — FixedR-Symbolsatz ins Produkt-Repo

Erzeugt von WP-AC26 (Site-Repo, `tools/gen-assets.mjs`). Die **Verdrahtung macht eine
Produkt-Session** (Repo-Grenze) — diese Datei benennt nur exakt, welche Datei wohin gehört.
Produkt-Repo: `C:\forge-os\awesome-cockpit`, Branch `produktschnitt`.

| Datei hier (`branding/app-icons/`) | Zielpfad im Produkt-Repo | Zweck |
|---|---|---|
| `pwa-192.png` | `src\trading-cockpit\public\icons\icon-192x192.png` (**ersetzen**) | Ersatz für die JPEG-Daten mit .png-Endung (AC23-Befund); `symbol()` in `src\huelle\haupt.js:127` liest genau diesen Pfad — danach zeigt Fenster/Taskbar das FixedR-Symbol statt des Electron-Vorgabesymbols |
| `pwa-512.png` | `src\trading-cockpit\public\icons\icon-512x512.png` (**ersetzen**) | dito, große PWA-Stufe |
| `pwa-maskable-512.png` | `src\trading-cockpit\public\icons\icon-maskable-512.png` (**neu**) | optional; dazu in `public\manifest.webmanifest` einen icons-Eintrag mit `"purpose": "maskable"` ergänzen |
| `icon.ico` (16–256, 7 Stufen) | `src\huelle\build\icon.ico` (**neu**) | electron-builder-Konvention: `build/icon.ico` neben `electron-builder.yml` wird automatisch als Installer-/EXE-Symbol gezogen; die `win:`-Sektion in `src\huelle\electron-builder.yml` hat derzeit **keinen** `icon:`-Eintrag — entweder Konvention nutzen oder explizit `win.icon: build/icon.ico` setzen |
| `icon-master.svg` | — (bleibt hier, Quelle) | Master; Änderungen NUR hier, dann `node tools/gen-assets.mjs` neu ausführen |
| `og-image.svg` | — (bleibt hier, Quelle) | Quelle des OG-Images der Site (`public/og-image.png`) |

Nach dem Ersetzen im Produkt: `symbol()`-Warnung in der Hülle verschwindet; der
Kommentar „Der FixedR-Symbolsatz kommt mit AC25" in `haupt.js` kann bereinigt werden.
Prüfschritt: `node -e "const i=require('electron').nativeImage"` entfällt — einfach Hülle
starten und Fenster-/Taskbar-Symbol ansehen.

Farbwelt: R in Amber `#FFB000` auf `#0B0E14` (G1-Entscheid, `branding/palette.md`).
