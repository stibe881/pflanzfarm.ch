// Rendert die öffentlichen Seiten mit den aktuellen Daten vor (für Suchmaschinen und schnellen Seitenaufbau).
// Aufruf: node prerender.mjs [Basis-URL des laufenden Laravel, Standard http://127.0.0.1:8000]
import { chromium } from "playwright";
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const pub = join(here, "..", "backend", "public");
const base = (process.argv[2] || "http://127.0.0.1:8000").replace(/\/$/, "");
const SITE = "https://pflanzfarm.ch";
const tpl = readFileSync(join(here, "..", "backend", "resources", "spa.html"), "utf8");
const esc = (s) => s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");

const catalog = await (await fetch(`${base}/api/catalog`)).json();
const routes = ["/", "/shop/", ...catalog.products.map((p) => `/produkt/${p.slug}/`), "/referenzen/", "/ueber-uns/", "/gartenservice/", "/ratgeber/", ...catalog.articles.map((a) => `/ratgeber/${a.id}/`), "/kontakt/", "/datenschutz/", "/impressum/", "/barrierefreiheit/", "/agb/"];

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
for (const r of routes) {
  await page.goto(base + r, { waitUntil: "networkidle" });
  await page.waitForTimeout(400);
  const d = await page.evaluate(() => {
    document.querySelectorAll(".popup-backdrop, .toast, video, .consent-bar").forEach((e) => e.remove());
    return {
      html: document.getElementById("root").innerHTML,
      title: document.title,
      desc: document.querySelector('meta[name="description"]')?.getAttribute("content") ?? "",
    };
  });
  const out = tpl
    .replace(/<title>[^<]*<\/title>/, `<title>${esc(d.title)}</title>`)
    .replace(/(<meta name="description" content=")[^"]*/, `$1${esc(d.desc)}`)
    .replace(/(<meta property="og:title" content=")[^"]*/, `$1${esc(d.title)}`)
    .replace(/(<meta property="og:description" content=")[^"]*/, `$1${esc(d.desc)}`)
    .replace(/(<link rel="canonical" href=")[^"]*/, `$1${SITE}${r}`)
    .replace(/(<meta property="og:url" content=")[^"]*/, `$1${SITE}${r}`)
    .replace('<div id="root"></div>', `<div id="root">${d.html}</div>`);
  const file = join(pub, r, "index.html");
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, out);
  console.log("vorgerendert", r);
}
await browser.close();
// Die Sitemap erzeugt Laravel dynamisch unter /sitemap.xml.
