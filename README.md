# Marks Entry Helper 0.3

A browser extension for entering marks on `teacherportal.diu.edu.bd` using the existing keyboard workflow or numeric-only speech recognition.

## Build and install

Run `./build.sh`. This creates two loadable builds from the same source folder:

- Chrome: `dist/chrome/` — open `chrome://extensions`, enable Developer mode, choose **Load unpacked**, and select this folder.
- Firefox: `dist/firefox/` — open `about:debugging#/runtime/this-firefox`, choose **Load Temporary Add-on…**, and select `manifest.json` inside this folder.

The source is shared; the only browser-specific file is the manifest background declaration (`manifest.json` for Chrome and `manifest-firefox.json` for Firefox).

## Speech entry

Open the extension popup/settings to download and cache the Vosk English small model on first use. The first download can take a while. Start grade entry, then click **Enable speech entry** in the entry dialog. Speech recognition is only active while that dialog is open and enabled. The dialog minimizes to the bottom-right while a recent-entry panel stays at the bottom-left.

Speak a three-digit student-ID suffix, pause, then speak the mark. The recognizer uses the supplied Vosk numeric grammar and `vosk-browser@0.0.7`; it is not general-purpose dictation. It accepts digit sequences (for example, “two nine zero”) and number phrases (for example, “two hundred ninety”), including decimal marks (for example, “ten point five”).

By default, recognition fills the entry dialog and you press **Enter** to submit. Enable **Submit recognized entries automatically** in settings to submit after the configurable pause (default 1 second). Speech-derived entries are highlighted yellow in the recent-entry panel for checking. The panel displays the last three successful entries with student ID, field name, and mark. Click **Disable speech entry** to stop the microphone.

The extension retains the existing entry workflow, full-mark validation, duplicate-entry check, and configurable keyboard controls.
