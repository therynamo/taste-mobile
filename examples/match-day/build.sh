#!/bin/sh
# Build Scoreboard End with swiftc (no Xcode project) and install it on one simulator.
# Usage: ./build.sh <simulator-udid> [screen] [state]
set -e
cd "$(dirname "$0")"
UDID="$1"
if [ -z "$UDID" ]; then echo "usage: ./build.sh <simulator-udid> [screen] [state]" >&2; exit 2; fi
SDK="$(xcrun --sdk iphonesimulator --show-sdk-path)"
rm -rf build/App.app && mkdir -p build/App.app && cp Info.plist build/App.app/
xcrun --sdk iphonesimulator swiftc -sdk "$SDK" -target arm64-apple-ios26.0-simulator \
  -parse-as-library -O Sources/*.swift -o build/App.app/ScoreboardEnd
xcrun simctl install "$UDID" build/App.app
xcrun simctl launch "$UDID" dev.tastemobile.examples.match-day -screen "${2:-today}" -state "${3:-live}"
