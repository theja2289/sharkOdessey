# Shark Odyssey — project context for Claude Code

## What this is
An educational, single-file HTML5 canvas shark game. It began as a gift for my nephews **Advaith and Ayush**. It is shared as a web link (GitHub Pages, installable as a PWA) and packaged for the **Google Play Store** as an Android app.

- GitHub user: `theja2289`
- Repo: `sharkOdessey` (note the spelling). Live at https://theja2289.github.io/sharkOdessey/
- Primary test device: **iPhone**. iOS can't run JS from local HTML files, so test through the GitHub Pages URL or a local server (`python3 -m http.server`), never by opening the file directly.
- Companion game: Dino Odyssey (separate repo `dinoOdyssey`) reuses this architecture.

## Architecture
- The whole game lives in one `index.html` (CSS, HTML and JS inline). Keep it that way. The web version has **no build step**.
- PWA files: `manifest.json`, `sw.js` (offline cache: network-first for pages, cache for three.js and fonts, Wikipedia never cached), `privacy.html`, `icon-192.png`, `icon-512.png`, `feature-graphic.png` (1024×500, for Play).
- 3D: Three.js r128 parametric models with drag-to-orbit, and a 2D canvas fallback.
- Wikipedia: real photo tabs and live blurbs. Uses the REST summary endpoint, falling back to the MediaWiki action API (`origin=*` for CORS). Don't reintroduce the thumbnail-upscale trick; it 404s on small originals.
- Mobile audio: unlocked by playing a silent buffer inside the first user gesture. Keep this.
- After editing, syntax-check the inline scripts:
  `node -e "const s=require('fs').readFileSync('index.html','utf8');[...s.matchAll(/<script>([\s\S]*?)<\/script>/g)].forEach(x=>new Function(x[1]))"`

## Editions (web vs Play Store)
- An `EDITION` block near the top of the main `<script>` (between the `/* edition:start */` and `/* edition:end */` markers) holds all personal text and difficulty settings.
- **Family edition** (`index.html` as is, served on Pages): has the dedications, 6/10/15-snack zones, and the gentler difficulty.
- **Play Store edition** (`editions/store.js`): has **no personal names**, 15/25/40-snack zones, more jellyfish and sea snakes, faster prey, and losing all hearts restarts the zone. `scripts/build-web.js` swaps this block in and **fails the build** if "Advaith", "Ayush", "Atisha" or "Sofia" are still present.
- Any new personal or difficulty text goes into **both** EDITION blocks. Never hardcode it in the game code.

## Android / Play Store
- Capacitor 8 (`android/`, app ID `com.sharkodyssey.game`, target API 36). I chose it over a TWA because the app must ship the store edition, not the Pages site with the names, and so it works offline.
- Run `npm run sync`: it builds `www/` (store edition, with three.js bundled from npm instead of the CDN) and copies it into `android/`.
- `.github/workflows/android.yml` builds a signed `.aab` and a debug `.apk` on every push to `main`. The signing keystore comes from repo secrets and is never committed.
- `ANDROID.md` has the full keystore and Play Console walkthrough: content rating, data safety ("no data collected"), Families policy, and the 12-tester / 14-day closed test for new accounts.

## Game content
- Campaign: 10 sharks across zones. Configurable "Dive Length", star ratings per zone, combo floaties.
- Sharkpedia: 58 species (10 campaign + 48 extra).
- Shark Lab comparison (size/speed/lifespan) is generated from the live roster. Don't hardcode lists.
- Curated fact database with reshuffling pools, quiz questions between zones, and badges.
- Golden Tuna turbo power-up, Abyss Mode (endless, full roster), Species Spotlight purple orbs.
- Hazards:
  - Jellyfish.
  - **Banded sea krait**: a black-and-white sea snake my nephew asked for. It appears from zone 2, costs a heart on touch, gets bonked away by turbo or the shield, and letting one pass earns the "Snake Dodger" badge.

## Family easter eggs (handle with care)
- **Mochi and Boba** (my twin daughters Atisha and Sofia) appear as **magical seahorse sisters** who cast a protective Twin Shield bubble and swim away. They must **never** be eaten or harmed; this was an explicit design correction.
- The treasure chest surprise rewards Advaith & Ayush with bonus snacks. In the store edition it's a generic sunken chest.
