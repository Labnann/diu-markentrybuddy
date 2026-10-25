# Marks Entry Helper — 0.2a

Keyboard-driven marks entry helper for the DIU teacher portal.

## Install

### Firefox
1. Open `about:debugging#/runtime/this-firefox`.
2. Choose **Load Temporary Add-on…** and select `manifest.json` from the extracted directory.

### Chrome
1. Open `chrome://extensions/` and enable Developer mode.
2. Choose **Load unpacked** and select the extracted directory.

## Usage

- Configure the target field, optional full mark, hotkeys, and speech pause in the extension popup.
- Press `Alt+E` (default) to open the existing grade-entry flow.
- Open the existing grade-entry dialog, then press `.` to toggle speech-to-entry. Say a three-digit student-ID suffix, pause, then say the mark. The recognized values are passed through the existing dialog validation and submission flow after the configured silence interval (default 1 second).
- A bottom-right panel shows the last three successful entries while the entry dialog is open.
- `W` marks a speech entry that was parsed as a best guess; verify those rows.

Speech recognition uses Vosk Browser and the small English Vosk model. The first activation downloads the model through the extension service worker and caches it in extension-origin IndexedDB, avoiding page-origin CORS restrictions. Later activations reuse that cache. Microphone permission is required.

**Version:** `0.2a` (`manifest.json` numeric version `0.2`, with `version_name` `0.2a`).
