import { togglePageFullscreen } from "../fullscreen/fullscreen.page";
import { isToggleShortcut } from "../fullscreen/fullscreen.shortcut";

// Page fullscreen is only allowed during real input inside the page, so the
// shortcut is handled here rather than as a browser command.
const onKeyDown = (event: KeyboardEvent): void => {
  if (!isToggleShortcut(event)) return;
  event.preventDefault();
  event.stopPropagation();
  togglePageFullscreen().catch((error: unknown) => {
    console.error("[full-screen-any-website]", error);
  });
};

window.addEventListener("keydown", onKeyDown, { capture: true });
