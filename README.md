<p align="center">
  <img src="assets/icons/128.png" width="96" height="96" alt="Full Screen Any Website icon">
</p>

<h1 align="center">Full Screen Any Website</h1>

<p align="center">
  Make any website full screen, like a video player.<br>
  The address bar, tabs, sidebar and toolbars disappear. Just the page.
</p>

<p align="center">
  <a href="https://github.com/brian-rey-development/full-screen-any-website/actions/workflows/ci.yml"><img src="https://github.com/brian-rey-development/full-screen-any-website/actions/workflows/ci.yml/badge.svg" alt="CI"></a>
  <img src="https://img.shields.io/badge/manifest-v3-2563eb" alt="Manifest V3">
  <img src="https://img.shields.io/badge/Firefox-140%2B-ff7139" alt="Firefox 140+">
  <img src="https://img.shields.io/badge/Chrome-102%2B-4285f4" alt="Chrome 102+">
  <a href="LICENSE"><img src="https://img.shields.io/badge/license-MIT-green" alt="MIT license"></a>
</p>

---

Reading a long article, a book, docs or a dashboard? Browsers only give you true distraction-free full screen for videos. This extension gives it to every page.

- **Two modes.** Page full screen hides everything. Window full screen works everywhere.
- **Tiny.** Two scripts, under 1 KB each, zero runtime dependencies.
- **Private.** No tracking, no network requests, no data collection.
- **Cross-browser.** One codebase for Firefox and Chrome. The Chrome build also loads in other Chromium browsers.

## How to use it

| Action                                              | Mode                   | What happens                                                                                                                |
| --------------------------------------------------- | ---------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| `Alt+Shift+F` on a page (`Option+Shift+F` on macOS) | **Page full screen**   | Everything disappears, like a video. Press again or `Esc` to exit.                                                          |
| Click the toolbar icon                              | **Window full screen** | Same as F11. Works on every page, including `about:` and store pages. Click again to restore your window, maximized or not. |

## Install

There's no store listing yet, so for now you load it from source. It takes about a minute.

```bash
git clone https://github.com/brian-rey-development/full-screen-any-website.git
cd full-screen-any-website
pnpm install
pnpm build
```

This creates `dist/firefox` and `dist/chrome`.

### Firefox

1. Open `about:debugging#/runtime/this-firefox`.
2. Click **Load Temporary Add-on** and select `dist/firefox/manifest.json`.
3. Reload any tabs that were already open, so the shortcut reaches them.

Firefox removes temporary add-ons on restart. To keep it installed, sign it through [addons.mozilla.org](https://addons.mozilla.org/developers/), which also works for unlisted, private add-ons.

### Chrome, Edge, Brave, Opera, Arc

1. Open `chrome://extensions` (or `edge://extensions`, and so on).
2. Turn on **Developer mode**.
3. Click **Load unpacked** and select `dist/chrome`.
4. Pin the extension from the puzzle-piece menu.

## The `about:config` trick (Firefox)

Window mode (the toolbar icon) uses the browser's own full screen, the one F11 gives you. Whether Firefox hides its toolbars there is a hidden preference.

If clicking the icon goes full screen but the toolbar and sidebar stay visible, turn this on:

1. Open `about:config` and accept the warning.
2. Search for `browser.fullscreen.autohide`.
3. Set it to **`true`**.

It's `true` by default, so most people never need this. It usually gets switched off by accident: while in full screen, right-clicking the toolbar shows a **Hide Toolbars** option, and unchecking it flips this preference. Checking it again is the same fix, without opening `about:config`.

To make the setting survive profile resets, add it to a `user.js` file in your profile folder. You can find the folder in `about:profiles`.

```js
user_pref("browser.fullscreen.autohide", true);
```

**Chrome on macOS** has the same switch: **View > Always Show Toolbar in Full Screen**. Uncheck it.

> Extensions can't change these preferences themselves. That's a deliberate browser restriction, and the reason page mode exists: it hides everything whatever these settings are.

## Why two modes?

Browsers only let a page go full screen during real user input _inside that page_. Without that rule, a malicious site could go full screen and draw a fake address bar to phish you.

That rule shapes the design:

- A **toolbar click** happens in the browser's own UI, not in the page. The browser always rejects a page full screen request made from there. So the icon uses the window API (`windows.update({ state: "fullscreen" })`), which is allowed but follows the browser's toolbar setting.
- A **keypress inside the page** counts as real input. So a small content script listens for `Alt+Shift+F` in the page and calls `requestFullscreen()`. This is real page full screen, the same thing a video player does, and the browser hides all of its UI.

## Permissions and privacy

| Permission                  | Why                                                                                                                                                            |
| --------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `storage`                   | Remembers whether each window was normal or maximized, so it can restore it after full screen. Uses session storage, which is cleared when the browser closes. |
| Content script on all sites | Needed to hear `Alt+Shift+F` on any page. It registers one key listener and nothing else.                                                                      |

The extension makes no network requests, reads no page content and collects no data. The whole content script is 15 lines: [`src/content/content.entry.ts`](src/content/content.entry.ts).

## Troubleshooting

**The toolbar icon leaves the toolbar visible.** See [the `about:config` trick](#the-aboutconfig-trick-firefox) above, or use `Alt+Shift+F`.

**`Alt+Shift+F` does nothing.**

- Reload the tab. The shortcut only reaches pages opened after the extension was loaded.
- In Firefox, open `about:addons`, select the extension, open **Permissions**, and make sure access to all websites is allowed.
- It can't work on `about:`, `chrome://`, add-on store pages or the built-in PDF viewer, because browsers block extensions there. Use the toolbar icon on those pages.
- Some sites ban full screen with a `Permissions-Policy` header. That's rare, and the toolbar icon still works there.

**The shortcut clashes with a site's own shortcut.** The extension handles the key first. Use the toolbar icon on that site, or open an issue.

## Development

Requires Node 20.11+ and pnpm.

| Command       | What it does                                                |
| ------------- | ----------------------------------------------------------- |
| `pnpm build`  | Bundles both browsers into `dist/chrome` and `dist/firefox` |
| `pnpm check`  | Lint, format check, typecheck and tests (what CI runs)      |
| `pnpm test`   | Unit tests (Vitest, with the browser APIs stubbed)          |
| `pnpm format` | Formats everything with Prettier                            |
| `pnpm icons`  | Regenerates the PNG icons from code                         |

After changing code, run `pnpm build` and click reload on the extension card. In Firefox, load it again from `about:debugging`.

### Project structure

```
manifest/
  base.json                    shared manifest
  chrome.json, firefox.json    per-browser overrides, merged at build time
src/
  background/                  toolbar click -> window full screen
  content/                     Alt+Shift+F -> page full screen
  fullscreen/                  the feature: page, window, storage and shortcut logic
  testing/                     browser API test double
scripts/
  build/                       bundling and manifest composition (esbuild)
  icons/                       draws the icon and encodes the PNGs, no image libraries
assets/icons/                  generated icons
```

Conventions:

- **File names:** kebab-case, `<feature>.<role>.ts` inside a feature folder, and `*.entry.ts` for bundle entry points.
- **Tests:** next to the code they cover, as `*.test.ts`.
- **Lint:** TypeScript strict with typed ESLint. Functions are capped at 20 lines and magic numbers are errors.

## Browser support

| Browser                 | Minimum      | Build          |
| ----------------------- | ------------ | -------------- |
| Firefox                 | 140          | `dist/firefox` |
| Chrome                  | 102          | `dist/chrome`  |
| Edge, Brave, Opera, Arc | Chromium 102 | `dist/chrome`  |

## Contributing

Issues and pull requests are welcome. Please run `pnpm check` before opening a PR.

## License

[MIT](LICENSE) © Brian Rey
