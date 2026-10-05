// Copies the game into www/ for the Android app (Play Store edition).
// three.js is bundled locally so the 3D shark viewer works offline.
const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..");
const out = path.join(root, "www");
fs.rmSync(out, { recursive: true, force: true });
fs.mkdirSync(out);

const CDN_THREE = "https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js";
let html = fs.readFileSync(path.join(root, "index.html"), "utf8");
if (!html.includes(CDN_THREE)) throw new Error("three.js script tag not found in index.html");
html = html.replace(CDN_THREE, "three.min.js");

// Swap in the Play Store edition: no personal names, longer and harder.
const editionBlock = /\/\* edition:start[\s\S]*?\/\* edition:end \*\//;
if (!editionBlock.test(html)) throw new Error("EDITION block not found in index.html");
const store = fs.readFileSync(path.join(root, "editions", "store.js"), "utf8").trim();
html = html.replace(editionBlock, () => store);
for (const name of ["Advaith", "Ayush", "Atisha", "Sofia"]) {
  if (html.includes(name)) throw new Error(`Play Store build still mentions ${name}`);
}

fs.copyFileSync(require.resolve("three/build/three.min.js"), path.join(out, "three.min.js"));

// Bundle the Baloo 2 / Nunito fonts too, so the app looks the same offline.
const FONT_IMPORT = /@import url\('https:\/\/fonts\.googleapis\.com\/[^']*'\);/;
if (!FONT_IMPORT.test(html)) throw new Error("Google Fonts @import not found in index.html");
fs.mkdirSync(path.join(out, "fonts"));
const faces = [];
for (const [pkg, family, weights] of [["baloo-2", "Baloo 2", [600, 700, 800]], ["nunito", "Nunito", [500, 700, 800]]]) {
  for (const w of weights) {
    const file = `${pkg}-latin-${w}-normal.woff2`;
    fs.copyFileSync(require.resolve(`@fontsource/${pkg}/files/${file}`), path.join(out, "fonts", file));
    faces.push(`@font-face{font-family:'${family}';font-style:normal;font-weight:${w};font-display:swap;src:url(fonts/${file}) format('woff2');}`);
  }
}
html = html.replace(FONT_IMPORT, () => faces.join("\n  "));
fs.writeFileSync(path.join(out, "index.html"), html);
// sw.js is left out on purpose: the app already has every file locally, and a cache would only risk stale updates
for (const f of ["manifest.json", "icon-192.png", "icon-512.png"]) {
  if (fs.existsSync(path.join(root, f))) fs.copyFileSync(path.join(root, f), path.join(out, f));
}
console.log("Built www/");
