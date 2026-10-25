// Baut die Website nach backend/public (JS/CSS mit Hash) und legt die HTML-Vorlage für Laravel ab.
import { build } from "esbuild";
import { createHash } from "node:crypto";
import { readFileSync, writeFileSync, readdirSync, unlinkSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const pub = join(here, "..", "backend", "public");
const assets = join(pub, "assets");
const hash = (s) => createHash("sha256").update(s).digest("hex").slice(0, 8);

const js = await build({
  entryPoints: [join(here, "src", "app.js")],
  bundle: true,
  minify: true,
  format: "esm",
  target: "es2020",
  legalComments: "none",
  write: false,
});
const css = await build({
  stdin: {
    contents: readFileSync(join(here, "styles", "base.css"), "utf8").replace(
      "url(/pflanzfarm.ch/assets/pflanzfarm-hero.jpeg)",
      "url(/assets/pflanzfarm-hero-1440.webp)",
    ) + "\n" + readFileSync(join(here, "styles", "site.css"), "utf8"),
    loader: "css",
  },
  minify: true,
  write: false,
});

const jsCode = js.outputFiles[0].text;
const cssCode = css.outputFiles[0].text;
const jsName = `index-${hash(jsCode)}.js`;
const cssName = `index-${hash(cssCode)}.css`;
for (const f of readdirSync(assets)) if (/^index-[0-9a-f]{8}\.(js|css)$/.test(f)) unlinkSync(join(assets, f));
writeFileSync(join(assets, jsName), jsCode);
writeFileSync(join(assets, cssName), cssCode);

const html = readFileSync(join(here, "index.template.html"), "utf8").replace("__JS__", jsName).replace("__CSS__", cssName);
mkdirSync(join(here, "..", "backend", "resources", "views"), { recursive: true });
writeFileSync(join(here, "..", "backend", "resources", "spa.html"), html);
writeFileSync(join(pub, "index.html"), html);
console.log(`gebaut: ${jsName} (${(jsCode.length / 1024).toFixed(0)} KB), ${cssName}`);
