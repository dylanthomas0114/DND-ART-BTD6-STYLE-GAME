#!/usr/bin/env bash
# Installs the Android SDK command-line tools, platform and build-tools needed to build the APK.
# Usage: bash scripts/setup-android-sdk.sh   (installs into $ANDROID_HOME, default ~/android-sdk)
set -euo pipefail
SDK="${ANDROID_HOME:-$HOME/android-sdk}"
PLATFORM="${ANDROID_PLATFORM:-android-36}"
BUILD_TOOLS="${ANDROID_BUILD_TOOLS:-36.0.0}"
mkdir -p "$SDK/cmdline-tools"
if [ ! -x "$SDK/cmdline-tools/latest/bin/sdkmanager" ]; then
  ZIP=$(curl -sS https://dl.google.com/android/repository/repository2-3.xml | grep -o 'commandlinetools-linux-[0-9]*_latest.zip' | sort -t- -k3 -n | uniq | tail -1)
  echo "Downloading $ZIP"
  TMP=$(mktemp -d)
  curl -sSL "https://dl.google.com/android/repository/$ZIP" -o "$TMP/tools.zip"
  unzip -q "$TMP/tools.zip" -d "$TMP"
  rm -rf "$SDK/cmdline-tools/latest"
  mv "$TMP/cmdline-tools" "$SDK/cmdline-tools/latest"
  rm -rf "$TMP"
fi
export ANDROID_HOME="$SDK"
yes | "$SDK/cmdline-tools/latest/bin/sdkmanager" --licenses > /dev/null || true
"$SDK/cmdline-tools/latest/bin/sdkmanager" "platform-tools" "platforms;$PLATFORM" "build-tools;$BUILD_TOOLS" > /dev/null
echo "Android SDK ready at $SDK"
echo "export ANDROID_HOME=$SDK"
