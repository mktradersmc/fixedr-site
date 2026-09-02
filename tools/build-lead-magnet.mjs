// FXR-45 — baut die Lead-Magnet-PDF aus der Druckseite `/lead-magnet/print`.
//
//   node tools/build-lead-magnet.mjs
//
// Schritte: (1) Site bauen — außer `dist/` ist bereits frischer als `src/`, dann wird
// der bestehende Bau genutzt (dieselbe Frische-Regel wie `tools/guards.mjs --dist`);
// (2) `astro preview` auf einem freien Port starten; (3) Edge headless rendert die
// Druckseite zu PDF (`--print-to-pdf`, kein Chrome-Kopf-/Fußzeilen-Overlay — die Seite
// trägt ihre eigenen Seitenzahlen über einen CSS-Zähler, siehe `print.css`); (4) PDF
// nach `public/downloads/fixedr-guide.pdf`; (5) Preview-Server beenden; (6) Größe +
// Seitenzahl aus dem PDF selbst messen (kein Bau-Log-Vertrauen — Urteil am Artefakt).
import { readdirSync, readFileSync, copyFileSync, unlinkSync, rmSync, statSync, existsSync, mkdirSync } from 'node:fs';
import { join, extname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync, spawn } from 'node:child_process';
import { createServer } from 'node:net';
import { tmpdir } from 'node:os';
import http from 'node:http';

const root = join(fileURLToPath(new URL('.', import.meta.url)), '..');
const distDir = join(root, 'dist');
const srcDir = join(root, 'src');
const outPdf = join(root, 'public', 'downloads', 'fixedr-guide.pdf');
const EDGE = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const PRINT_PATH = '/lead-magnet/print';
// Astro direkt über node_modules aufrufen statt über `npx` — auf Windows spawnt `npx.cmd`
// zusätzlich eine cmd.exe-Ebene, deren Kindprozess ein `.kill()` auf den npx-Prozess
// überlebt (genau das lief in der ersten Fassung dieses Skripts als Waisenprozess weiter).
const ASTRO_BIN = join(root, 'node_modules', 'astro', 'astro.js');

function* walk(dir, exts) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) {
      if (name === 'node_modules') continue;
      yield* walk(p, exts);
    } else if (exts.has(extname(name))) {
      yield p;
    }
  }
}

function newestMtime(dir, exts) {
  let max = 0;
  if (!existsSync(dir)) return max;
  for (const f of walk(dir, exts)) max = Math.max(max, statSync(f).mtimeMs);
  return max;
}

function run(cmd, args, opts = {}) {
  const r = spawnSync(cmd, args, { stdio: 'inherit', shell: false, ...opts });
  if (r.error) {
    throw new Error(`Befehl nicht startbar: ${cmd} ${args.join(' ')} — ${r.error.message}`);
  }
  if (r.signal) {
    throw new Error(`Befehl per Signal beendet (${r.signal}, vermutlich Timeout): ${cmd} ${args.join(' ')}`);
  }
  if (r.status !== 0) {
    throw new Error(`Befehl fehlgeschlagen (${r.status}): ${cmd} ${args.join(' ')}`);
  }
}

function findFreePort() {
  return new Promise((resolve, reject) => {
    const srv = createServer();
    srv.unref();
    srv.on('error', reject);
    srv.listen(0, '127.0.0.1', () => {
      const { port } = srv.address();
      srv.close(() => resolve(port));
    });
  });
}

function waitForServer(url, timeoutMs = 20000) {
  const started = Date.now();
  return new Promise((resolve, reject) => {
    const tryOnce = () => {
      const req = http.get(url, (res) => {
        res.resume();
        if (res.statusCode && res.statusCode < 500) resolve();
        else retry();
      });
      req.on('error', retry);
      req.setTimeout(2000, () => {
        req.destroy();
        retry();
      });
    };
    const retry = () => {
      if (Date.now() - started > timeoutMs) {
        reject(new Error(`Preview-Server antwortet nicht innerhalb von ${timeoutMs} ms: ${url}`));
        return;
      }
      setTimeout(tryOnce, 300);
    };
    tryOnce();
  });
}

/** Seitenzahl aus dem PDF selbst zählen — `/Type /Page` (nicht `/Type /Pages`, der
 * Baumknoten). Chromiums Skia-PDF-Backend schreibt Objektdefinitionen unkomprimiert
 * (nur Content-Streams sind Flate-komprimiert), deshalb ist ein Text-Scan über die
 * Rohbytes verlässlich — zusätzlich als Gegenprobe der `/Count`-Wert des `/Pages`-
 * Wurzelknotens, falls vorhanden. */
function countPdfPages(buf) {
  const text = buf.toString('latin1');
  const pageMatches = text.match(/\/Type\s*\/Page(?!s)\b/g) || [];
  const countMatch = text.match(/\/Type\s*\/Pages\b[^>]*?\/Count\s+(\d+)/) || text.match(/\/Count\s+(\d+)[^>]*?\/Type\s*\/Pages\b/);
  return { fromPageObjects: pageMatches.length, fromCount: countMatch ? Number(countMatch[1]) : null };
}

async function main() {
  if (!existsSync(EDGE)) {
    throw new Error(`Microsoft Edge nicht gefunden unter: ${EDGE}`);
  }

  const srcExts = new Set(['.astro', '.md', '.mdx', '.ts', '.mjs', '.css', '.html', '.json']);
  const srcStand = newestMtime(srcDir, srcExts);
  const distStand = newestMtime(distDir, new Set(['.html', '.css', '.js']));
  if (!existsSync(distDir) || distStand < srcStand) {
    console.log('build-lead-magnet: dist/ fehlt oder ist älter als src/ — baue neu (astro build)...');
    run(process.execPath, [ASTRO_BIN, 'build'], { cwd: root });
  } else {
    console.log('build-lead-magnet: dist/ ist frisch genug — Bau wird wiederverwendet.');
  }

  const printFile = join(distDir, 'lead-magnet', 'print.html');
  if (!existsSync(printFile)) {
    throw new Error(`Gebaute Druckseite fehlt: ${printFile} — Bau unvollständig?`);
  }

  const port = await findFreePort();
  console.log(`build-lead-magnet: starte "astro preview" auf Port ${port}...`);
  const preview = spawn(process.execPath, [ASTRO_BIN, 'preview', '--port', String(port), '--host', '127.0.0.1'], {
    cwd: root,
    stdio: 'inherit',
    shell: false,
  });

  let previewExited = false;
  preview.on('exit', () => {
    previewExited = true;
  });

  try {
    const base = `http://127.0.0.1:${port}`;
    await waitForServer(`${base}${PRINT_PATH}`);
    if (previewExited) throw new Error('astro preview ist vorzeitig beendet.');

    mkdirSync(join(root, 'public', 'downloads'), { recursive: true });
    const tmpPdf = join(root, 'public', 'downloads', '.fixedr-guide.tmp.pdf');

    // Eigenes, leeres Profilverzeichnis: verhindert, dass unser Headless-Aufruf über
    // Chromiums Single-Instance-Mechanik an ein bereits laufendes Edge (Michaels
    // normales Profil, z. B. im Hintergrund-Modus) weitergereicht wird — dort würde
    // weder `--headless` noch `--print-to-pdf` greifen, sondern nur ein Fenster
    // im falschen Profil öffnen bzw. der Aufruf einfach verpuffen.
    const profileDir = join(tmpdir(), `fixedr-lead-magnet-print-${Date.now()}`);
    mkdirSync(profileDir, { recursive: true });

    console.log('build-lead-magnet: drucke mit Edge headless...');
    run(
      EDGE,
      [
        '--headless=new',
        '--disable-gpu',
        `--user-data-dir=${profileDir}`,
        '--no-first-run',
        '--no-default-browser-check',
        `--print-to-pdf=${tmpPdf}`,
        '--no-pdf-header-footer',
        '--virtual-time-budget=10000',
        `${base}${PRINT_PATH}`,
      ],
      { timeout: 30000 }
    );

    rmSync(profileDir, { recursive: true, force: true });

    if (!existsSync(tmpPdf)) {
      throw new Error('Edge hat keine PDF-Datei erzeugt.');
    }
    const buf = readFileSync(tmpPdf);
    const sizeBytes = buf.length;
    const { fromPageObjects, fromCount } = countPdfPages(buf);

    copyFileSync(tmpPdf, outPdf);
    // Temp-Datei aufräumen — nur die Zieldatei bleibt unter public/downloads/.
    unlinkSync(tmpPdf);

    console.log('\n--- build-lead-magnet: Ergebnis ---');
    console.log(`PDF:              ${outPdf}`);
    console.log(`Größe:            ${sizeBytes} Bytes (${(sizeBytes / 1024).toFixed(1)} KB)`);
    console.log(`Seiten (/Page):   ${fromPageObjects}`);
    console.log(`Seiten (/Count):  ${fromCount ?? 'nicht gefunden'}`);

    const okSize = sizeBytes > 100 * 1024;
    const pageCount = fromPageObjects || fromCount || 0;
    const okPages = pageCount >= 12 && pageCount <= 16;
    console.log(`Urteil Größe > 100 KB:     ${okSize ? 'OK' : 'ROT'}`);
    console.log(`Urteil Seitenzahl 12–16:   ${okPages ? 'OK' : 'ROT'} (${pageCount})`);

    if (!okSize || !okPages) {
      process.exitCode = 1;
    }
  } finally {
    if (!previewExited) {
      preview.kill();
    }
  }
}

main().catch((err) => {
  console.error('build-lead-magnet ABGEBROCHEN:', err.message);
  process.exit(1);
});
