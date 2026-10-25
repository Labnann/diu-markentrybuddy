#!/bin/sh
set -eu
ROOT=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
DIST="$ROOT/dist"
rm -rf "$DIST"
mkdir -p "$DIST/chrome" "$DIST/firefox"
for browser in chrome firefox; do
    target="$DIST/$browser"
    cp "$ROOT/background.js" "$ROOT/content.js" "$ROOT/popup.html" \
       "$ROOT/popup.js" "$ROOT/speech-page.js" "$ROOT/LICENSE" "$ROOT/README.md" "$target/"
    if [ "$browser" = chrome ]; then
        cp "$ROOT/manifest.json" "$target/manifest.json"
    else
        cp "$ROOT/manifest-firefox.json" "$target/manifest.json"
    fi
done
printf 'Built extensions:\n  %s\n  %s\n' "$DIST/chrome" "$DIST/firefox"
