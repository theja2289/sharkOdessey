#!/usr/bin/env bash
# Creates the Play Store upload key and prints the 4 values to paste into GitHub secrets.
# Run it once, in a GitHub Codespace (Java is preinstalled there):  bash scripts/create-upload-key.sh
set -euo pipefail

KEYSTORE="shark-upload.keystore"
SECRETS="upload-key-SECRETS.txt"
ALIAS="upload"

if ! command -v keytool >/dev/null 2>&1; then
  echo "keytool (part of Java) was not found. Open this repo in a GitHub Codespace and run this again." >&2
  exit 1
fi
if [ -e "$KEYSTORE" ]; then
  echo "$KEYSTORE already exists — not overwriting it. Delete it first if you really want a new key." >&2
  exit 1
fi

PASSWORD="$(od -An -N18 -tx1 /dev/urandom | tr -d ' \n')"

keytool -genkeypair -keystore "$KEYSTORE" -storetype PKCS12 -alias "$ALIAS" \
  -keyalg RSA -keysize 2048 -validity 10000 \
  -storepass "$PASSWORD" -keypass "$PASSWORD" \
  -dname "CN=Shark Odyssey" >/dev/null 2>&1

B64="$(base64 < "$KEYSTORE" | tr -d '\n')"

cat > "$SECRETS" <<TXT
Shark Odyssey — Play Store upload key
Keep this file AND $KEYSTORE somewhere safe (e.g. Google Drive or a password manager).
Never post them anywhere public.

Add these 4 secrets on GitHub: repo → Settings → Secrets and variables → Actions → New repository secret

Name:  ANDROID_KEYSTORE_PASSWORD
Value: $PASSWORD

Name:  ANDROID_KEY_PASSWORD
Value: $PASSWORD

Name:  ANDROID_KEY_ALIAS
Value: $ALIAS

Name:  ANDROID_KEYSTORE_BASE64
Value (one long line):
$B64
TXT

echo ""
echo "✅ Upload key created."
echo ""
echo "Next:"
echo "  1. In the file list on the left, right-click  $SECRETS  → Download."
echo "  2. Right-click  $KEYSTORE  → Download."
echo "  3. Open $SECRETS and copy the 4 secrets into GitHub (instructions are inside it)."
echo "  4. Back here, delete both files:  rm $KEYSTORE $SECRETS"
echo ""
echo "(Both files are git-ignored, so they can't be committed by accident.)"
