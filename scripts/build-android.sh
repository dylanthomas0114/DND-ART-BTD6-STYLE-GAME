#!/usr/bin/env bash
# Builds a debug APK: web build → Capacitor sync → Gradle assembleDebug.
# Output: android/app/build/outputs/apk/debug/app-debug.apk
set -euo pipefail
export ANDROID_HOME="${ANDROID_HOME:-$HOME/android-sdk}"
if [ ! -d "$ANDROID_HOME/platforms" ]; then bash "$(dirname "$0")/setup-android-sdk.sh"; fi
echo "sdk.dir=$ANDROID_HOME" > android/local.properties
npm run build
npx cap sync android
(cd android && ./gradlew --no-daemon -q assembleDebug)
ls -lh android/app/build/outputs/apk/debug/app-debug.apk
