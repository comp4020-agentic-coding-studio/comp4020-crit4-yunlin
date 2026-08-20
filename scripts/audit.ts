#!/usr/bin/env node
// Nothing in CI measures accessibility or performance -- wiring those sensors
// is this agent's own work. Runs Lighthouse's accessibility + performance
// audits against the built page, using the Chrome binary agent-browser
// already keeps on this machine so there's no second browser download.
// Accessibility is gated at 100: the grove's aria-label/role/aria-hidden
// markup is exactly the kind of thing a static audit can catch on first
// render, even though it can't strike a chime itself (that's the manual
// agent-browser pass documented in PROCESS.md). Performance is reported, not
// gated -- a single lab run on this machine is a rough estimate, not proof
// the instrument is fast for a real player, and a Web Audio page's real
// latency doesn't show up in a static-page audit at all.
import { execFileSync } from "node:child_process";
import { createServer } from "node:http";
import { extname, join } from "node:path";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { launch } from "chrome-launcher";
import lighthouse from "lighthouse";

const DIST = "dist";
const CHROME_BINARY = readdirSync("/home/ben/.agent-browser/browsers")
  .sort()
  .reverse()
  .map((dir) => join("/home/ben/.agent-browser/browsers", dir, "chrome"))
  .find((path) => {
    try {
      return statSync(path).isFile();
    } catch {
      return false;
    }
  });

execFileSync("pnpm", ["build"], { stdio: "inherit" });

const MIME: Record<string, string> = {
  ".html": "text/html",
  ".css": "text/css",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".ico": "image/x-icon",
  ".js": "text/javascript",
};

function allHtmlFiles(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) return allHtmlFiles(path);
    return path.endsWith(".html") ? [path] : [];
  });
}

const server = createServer((req, res) => {
  const url = new URL(req.url ?? "/", "http://localhost");
  const path = join(DIST, url.pathname === "/" ? "/index.html" : url.pathname);
  try {
    const body = readFileSync(path);
    res.writeHead(200, { "content-type": MIME[extname(path)] ?? "application/octet-stream" });
    res.end(body);
  } catch {
    res.writeHead(404);
    res.end();
  }
});

await new Promise<void>((resolve) => server.listen(0, resolve));
const { port } = server.address() as { port: number };

const chrome = await launch({
  chromePath: CHROME_BINARY,
  chromeFlags: ["--headless=new", "--no-sandbox", "--disable-gpu"],
});

let failed = false;
try {
  const pages = allHtmlFiles(DIST).map((path) => path.slice(DIST.length));
  for (const page of pages) {
    const result = await lighthouse(`http://localhost:${port}${page}`, {
      port: chrome.port,
      onlyCategories: ["accessibility", "performance"],
      output: "json",
      logLevel: "silent",
    });
    const categories = result?.lhr.categories;
    const a11y = Math.round((categories?.accessibility.score ?? 0) * 100);
    const perf = Math.round((categories?.performance?.score ?? 0) * 100);
    const mark = a11y === 100 ? "✓" : "✗";
    console.log(`${mark} ${page || "/"}: accessibility ${a11y}/100, performance ${perf}/100`);
    if (a11y !== 100) {
      failed = true;
      for (const audit of Object.values(result?.lhr.audits ?? {})) {
        if (audit.score !== null && audit.score < 1 && categories?.accessibility.auditRefs.some((r) => r.id === audit.id)) {
          console.error(`  - ${audit.title}`);
        }
      }
    }
  }
} finally {
  await chrome.kill();
  server.close();
}

if (failed) {
  console.error("\naccessibility must be 100/100 -- see failing audits above");
  process.exit(1);
}
console.log("\n✓ accessibility 100/100 (static first-render audit; performance is reported, not gated -- a lab score from one run on one machine, and doesn't drive the pointer/keyboard interaction the manual pass covers)");
