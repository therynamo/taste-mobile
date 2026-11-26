#!/bin/sh
# Builds a Release app with the JS bundle embedded (no Metro) and installs it on a simulator.
# Usage: ./build.sh <simulator udid>
# DERIVED_DATA overrides where Xcode puts its build products (default: ./build/dd).
set -eu
UDID="${1:?usage: build.sh <simulator udid>}"
HERE="$(cd "$(dirname "$0")" && pwd)"
DD="${DERIVED_DATA:-$HERE/build/dd}"
cd "$HERE"

[ -d node_modules ] || npm install
npx expo prebuild -p ios

WORKSPACE="$(ls -d ios/*.xcworkspace | head -1)"
SCHEME="$(basename "$WORKSPACE" .xcworkspace)"
xcodebuild -workspace "$WORKSPACE" -scheme "$SCHEME" -configuration Release \
  -sdk iphonesimulator -destination "id=$UDID" -derivedDataPath "$DD" \
  CODE_SIGNING_ALLOWED=NO -quiet build

APP="$DD/Build/Products/Release-iphonesimulator/$SCHEME.app"
xcrun simctl install "$UDID" "$APP"
echo "Installed $APP on $UDID"
echo "Open a screen: xcrun simctl launch $UDID dev.tastemobile.examples.readingassistant -screen book"
