# Shark Odyssey on Google Play

The game is packaged as an Android app with [Capacitor](https://capacitorjs.com).
The app wraps `index.html` with the 3D library bundled in, so the game runs offline.
Only the optional Wikipedia shark photos need internet.

## Two editions

- **Family edition** is `index.html` as it is, for the web. It keeps the dedication to Advaith & Ayush, the real names, and the shorter 6/10/15-snack zones.
- **Play Store edition** is what the Android app ships. When `npm run build` runs, it swaps the `EDITION` block in `index.html` for `editions/store.js`, which means:
  - No personal names anywhere. The build fails if one slips through.
  - Longer zones: 15, 25 (the default), or 40 snacks.
  - More jellyfish, sea snakes more often, and faster prey.
  - Losing all your hearts restarts the current zone's hunt.

To tune the Play Store game, edit `editions/store.js`.

| Thing | Value |
|---|---|
| App ID (package name) | `com.sharkodyssey.game` (change this in `capacitor.config.json` and `android/app/build.gradle` **before your first upload**; you can't change it afterwards) |
| Min / target Android | API 24 (Android 7) / API 36 |
| Icon and splash sources | `assets/` (to regenerate: `npx @capacitor/assets generate --android`) |

## 1. Create your upload key (one time)

```bash
keytool -genkeypair -v -keystore shark-upload.keystore -alias shark \
  -keyalg RSA -keysize 2048 -validity 10000
```

Keep this file and its passwords somewhere safe, like a password manager.
**Never commit it.** `.gitignore` already excludes `*.keystore`.
Play App Signing holds the real signing key. If you lose this upload key, Google can reset it.

## 2. Build the `.aab` with GitHub Actions (no Android Studio needed)

1. In GitHub, go to **Settings → Secrets and variables → Actions** and add these four secrets:
   - `ANDROID_KEYSTORE_BASE64`: the output of `base64 -w0 shark-upload.keystore` (on macOS: `base64 -i shark-upload.keystore`)
   - `ANDROID_KEYSTORE_PASSWORD`
   - `ANDROID_KEY_ALIAS`: `shark`
   - `ANDROID_KEY_PASSWORD`
2. Merge this branch into `main`. The **Build Android app** workflow runs on every push to `main`. You can also start it by hand from the **Actions** tab.
3. Download the `shark-odyssey-android` artifact. It contains:
   - `app-release.aab`: upload this to Play
   - `app-debug.apk`: install this on a phone to try the app (`adb install app-debug.apk`, or copy the file over and open it)

Each run sets `versionCode` to the workflow run number, so every upload is numbered higher than the last, as Play requires.

### Or build on your own computer

You need Node 22, JDK 21, and Android Studio (or the Android SDK).

```bash
npm ci
npm run sync           # copies the game into android/
npm run android:open   # opens Android Studio → Build → Generate Signed App Bundle
```

## 3. Publish in Play Console

1. Create a developer account at https://play.google.com/console. It costs a one-time $25.
2. Click **Create app**, name it "Shark Odyssey", choose **Game**, and choose **Free**.
3. Fill in the **App content** section. Because this is a kids' game, these parts matter most:
   - **Target audience**: pick the age groups, for example 6–8 and 9–12. This puts the app under Google's **Families policy**.
   - **Privacy policy URL**: required for apps aimed at children. A simple page works, for example: "Shark Odyssey collects no personal data. It has no ads, no accounts, and no tracking. It loads public shark photos from Wikipedia."
   - **Data safety**: no data collected and no data shared.
   - **Ads**: no ads.
   - **Content rating**: fill in the IARC questionnaire. Expect "Everyone" or PEGI 3.
4. Fill in the **Store listing**:
   - 512×512 icon: `icon-512.png`
   - 1024×500 feature graphic
   - at least 2 phone screenshots
5. Upload `app-release.aab`. Start with **Testing → Internal testing**.
   New personal developer accounts must run a **closed test with at least 12 testers for 14 days** before they can publish to Production. Check Play Console for the current rule.
6. Promote the release to **Production** and send it for review.

## Updating the game later

Edit `index.html` as usual and push to `main`. The workflow builds a new `.aab` with a higher version number. Upload it as a new release in Play Console.
