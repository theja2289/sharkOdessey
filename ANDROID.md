# Publishing Shark Odyssey on Google Play: a step-by-step guide

This guide is for someone who has never published an app. Every step happens in a web browser, so you don't need to install any software on your computer.

## What you need

- [ ] A Google account (Gmail)
- [ ] A credit or debit card for Google's **one-time $25** developer fee
- [ ] A government ID (Google checks your identity)
- [ ] An Android phone. Google uses it to verify you, and you can test the game on it.
- [ ] **12 or more friends or family members with Android phones** to test the game for 14 days. Google requires this for new developer accounts.

## How long it takes

| Part | Your time | Waiting |
|---|---|---|
| Steps 1–5: build the app | about 30 minutes | 10 minutes |
| Step 6: developer account | 15 minutes | a few hours to a few days (ID check) |
| Steps 7–8: set up the store page | about 1 hour | none |
| Step 9: closed test | 15 minutes | **14 days** (required) |
| Steps 10–11: go live | 15 minutes | a few days (Google review) |

## The big picture

```
GitHub builds the app file  →  you upload it to Play Console  →  12 testers try it for 14 days
        →  you apply for production  →  Google reviews it  →  🎉 live on the Play Store
```

> 💡 Google renames buttons in Play Console from time to time. If a button in this guide isn't where it says, use the search box at the top of Play Console.

---

## Step 1: Merge the pull request (2 minutes)

1. Open https://github.com/theja2289/sharkOdessey/pull/1
2. Scroll down and click **Merge pull request**, then **Confirm merge**.

This adds the Android app and the Play Store version of the game to your repo. GitHub then starts a first build automatically. That build only makes a test file, because the upload key from Step 2 doesn't exist yet.

## Step 2: Create your upload key (10 minutes)

Google only accepts app files "signed" with a secret key that belongs to you. A script in the repo creates the key. You run it in **GitHub Codespaces**, a free editor that runs in your browser.

1. Go to https://github.com/theja2289/sharkOdessey
2. Click the green **`<> Code`** button, open the **Codespaces** tab, and click **Create codespace on main**.
3. Wait about a minute for an editor to open in your browser. A **terminal** panel appears at the bottom.
4. Click in the terminal, paste this line, and press **Enter**:
   ```
   bash scripts/create-upload-key.sh
   ```
5. When you see **✅ Upload key created**, find the file list on the left. **Right-click** each of these two files and choose **Download**:
   - `upload-key-SECRETS.txt`
   - `shark-upload.keystore`
6. **Keep both files safe**, for example in a private Google Drive folder. Don't share them or post them anywhere. If you lose them, Google can reset your key (see Troubleshooting), but that takes a few days.
7. Go back to the terminal, paste this line, and press Enter to delete the copies in the Codespace:
   ```
   rm shark-upload.keystore upload-key-SECRETS.txt
   ```
8. Close the Codespace tab. To clean up completely, go to https://github.com/codespaces, click **⋯** next to the Codespace, and choose **Delete**.

## Step 3: Give GitHub the key (5 minutes)

1. Open the `upload-key-SECRETS.txt` file you downloaded.
2. In your repo on GitHub, click **Settings** (the tab at the top), then in the left menu click **Secrets and variables → Actions**.
3. Click **New repository secret**. Copy the first **Name** and **Value** from the file, paste them in, and click **Add secret**.
4. Repeat for all **4** secrets:
   - `ANDROID_KEYSTORE_PASSWORD`
   - `ANDROID_KEY_PASSWORD`
   - `ANDROID_KEY_ALIAS`
   - `ANDROID_KEYSTORE_BASE64` (a very long line; copy all of it)

## Step 4: Build the app (10 minutes, automatic)

1. In your repo, click the **Actions** tab. If GitHub asks you to enable workflows, click the green button to allow it.
2. In the left menu, click **Build Android app**.
3. Click **Run workflow** on the right, then the green **Run workflow** button.
4. Wait 5–10 minutes for the yellow dot to turn into a ✅ green check. Then click the run.
5. You should see **✅ Ready for Google Play**. Scroll down to **Artifacts** and click **shark-odyssey-android** to download a zip file.
6. Unzip it. It contains two files:
   - `shark-odyssey-UPLOAD-TO-PLAY-v….aab`: you upload this to Google Play
   - `shark-odyssey-TEST-ON-PHONE.apk`: this is for trying the game on your phone

If the run shows **⚠️ Only the test APK was built**, one of the 4 secrets is missing or has a typo in its name. Recheck Step 3, then run the workflow again.

## Step 5: Try it on your phone (optional, 5 minutes)

1. Send the `.apk` file to your Android phone, for example by emailing it to yourself or putting it in Google Drive.
2. Tap it on the phone. If Android asks, allow **Install unknown apps** for that app (Gmail, Drive, or Files).
3. If **Play Protect** warns that the app is from an unknown developer, tap **More details → Install anyway**. This happens because the app isn't on the store yet.
4. Play a couple of zones. Check that the sea snake appears and that the names are gone.

## Step 6: Create your Google Play developer account (15 minutes, then a wait)

1. Go to https://play.google.com/console/signup and sign in with your Google account.
2. When asked who the account is for, choose **Yourself** (a personal account).
3. Pay the **$25** one-time fee.
4. Fill in your details and **verify your identity** with your ID. Google also verifies your phone number and email.
5. Google asks you to install the **Play Console app** on your Android phone and sign in, to prove you have a real Android device. Do that.
6. Wait for the verification email. It can take from a few hours to a few days.

## Step 7: Create the app in Play Console (5 minutes)

1. In Play Console, click **Create app**.
2. Fill in:
   - **App name:** `Shark Odyssey`
   - **Default language:** English (United States)
   - **App or game:** Game
   - **Free or paid:** Free
3. Tick the declaration boxes and click **Create app**.

## Step 8: Fill in "Set up your app" (about 1 hour)

The app's **Dashboard** shows a checklist. Here's what to answer for each item:

| Item | Answer |
|---|---|
| **Privacy policy** | `https://theja2289.github.io/sharkOdessey/privacy.html` |
| **App access** | All functionality is available without any access restrictions |
| **Ads** | No, my app does not contain ads |
| **Content rating** | Start the questionnaire. Category: **Game**. Answer honestly; for a cartoon shark eating fish, almost every answer is **No**. You'll probably get **Everyone / PEGI 3**. |
| **Target audience** | Tick the age groups **6–8** and **9–12** (add older groups too if you like). Because these include children, the app falls under Google's **Families policy**. The game already meets it: no ads, no data collection, a privacy policy. |
| **Data safety** | "Does your app collect or share any of the required user data types?" → **No**. Then submit. |
| **Advertising ID** | No, the app doesn't use an advertising ID |
| **Government apps** | No |
| **Financial features** | My app doesn't provide any financial features |
| **Health** | My app does not have any health features |
| **News apps** | No |
| **Store listing** | Copy everything from [`store-listing/README.md`](store-listing/README.md): the name, the descriptions, and the icon, feature graphic, and screenshots, all in that folder |
| **App category & contact** | Game → **Educational**. Use your own email; it's shown publicly. |

## Step 9: Run a closed test (15 minutes, then 14 days)

New personal developer accounts must have **at least 12 testers who stay signed up for 14 days in a row** before the app can go public.

1. In the left menu, go to **Test and release → Testing → Closed testing**. Open the track Google created (often called **Alpha**) or create one.
2. Open the **Testers** tab, click **Create email list**, and add the Gmail addresses of your testers. Add **15 or more** in case someone drops out. They need Android phones. Click **Save**.
3. Pick the **countries** where testers live.
4. Click **Create new release**, then **Upload**, and choose the `.aab` file from Step 4.
5. Under **Release notes**, write something like `First test version`. Click **Next**, then **Save**, then **Send for review**. Google reviews test releases too, usually within a day or two.
6. Once approved, copy the **Join on the web** or **Join on Android** link from the **Testers** tab and send it to your testers. Each tester:
   1. opens the link while signed in with the Gmail address you added,
   2. taps **Become a tester**,
   3. installs Shark Odyssey from the Play Store link on that page,
   4. **stays signed up for at least 14 days**.
7. Ask testers to play a few times and tell you what they think. In Step 10, Google asks how testing went.

## Step 10: Apply for production (15 minutes, then a review)

1. After 14 days, the Dashboard offers **Apply for production**. Click it.
2. Answer the short questionnaire about your test: how you found testers, what feedback you got, and what you changed. Short, honest answers are fine.
3. Google reviews your application, usually within about a week.
4. Once approved, go to **Test and release → Production → Create new release**. Upload the same `.aab` (or a newer one), pick your countries, and click **Send for review**.

## Step 11: 🎉 It's live!

After the final review, which often takes a few days, Shark Odyssey appears on Google Play at:

https://play.google.com/store/apps/details?id=com.sharkodyssey.game

---

## Updating the game later

1. Change the game and merge the change into `main`. GitHub builds a new `.aab` automatically, and every build gets a higher version number, which Play requires.
2. Download it from the **Actions** tab, as in Step 4.
3. In Play Console, go to **Production → Create new release**, upload it, and send it for review.

## Troubleshooting

| Problem | Fix |
|---|---|
| The build shows **⚠️ Only the test APK was built** | One of the 4 secrets is missing or misnamed. Recheck Step 3, then run the workflow again. |
| Play says **"Version code … has already been used"** | Run the workflow again (Step 4). Each run gets a higher number. |
| Play says the **package name is already in use** | Someone else already uses `com.sharkodyssey.game`. Ask Claude to change it; it's a two-file change. |
| You **lost the keystore or passwords** | In Play Console, go to **Test and release → Setup → App signing → Request upload key reset**. Google holds the real app signing key, so your app is safe. |
| The build fails (red ❌) | Open the failed run and ask Claude for help, with a link to it. |

---

## Technical details (for later)

The game is packaged as an Android app with [Capacitor](https://capacitorjs.com). The app wraps `index.html` with the 3D library and fonts bundled in, so the game runs offline. Only the optional Wikipedia shark photos need internet.

### Why Capacitor and not a TWA

A Trusted Web Activity just opens the GitHub Pages site inside a Chrome window. That would put the family edition, names and all, into the Play Store, and the app would need internet to start. Capacitor bundles the store edition inside the app, so it plays offline.

### Two editions

- **Family edition** is `index.html` as it is, for the web. It keeps the dedication to Advaith & Ayush, the real names, and the shorter 6/10/15-snack zones.
- **Play Store edition** is what the Android app ships. When `npm run build` runs, it swaps the `EDITION` block in `index.html` for `editions/store.js`, which means:
  - No personal names anywhere. The build fails if one slips through.
  - Longer zones: 15, 25 (the default), or 40 snacks.
  - More jellyfish, sea snakes more often, and faster prey.
  - Losing all your hearts restarts the current zone's hunt.

To tune the Play Store game, edit `editions/store.js`.

### Project facts

| Thing | Value |
|---|---|
| App ID (package name) | `com.sharkodyssey.game` (change this in `capacitor.config.json` and `android/app/build.gradle` **before your first upload**; you can't change it afterwards) |
| Min / target Android | API 24 (Android 7) / API 36 |
| Icon and splash sources | `assets/` (to regenerate: `npx @capacitor/assets generate --android`) |
| Store graphics and text | `store-listing/` |
| Version code | Set from the workflow run number, so every upload is numbered higher than the last |

### Or build on your own computer

You need Node 22, JDK 21, and Android Studio (or the Android SDK).

```bash
npm ci
npm run sync           # copies the game into android/
npm run android:open   # opens Android Studio → Build → Generate Signed App Bundle
```
