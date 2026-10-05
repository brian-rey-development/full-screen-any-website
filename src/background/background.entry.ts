import { discardRestoreState } from "../fullscreen/fullscreen.storage";
import { toggleWindowFullscreen } from "../fullscreen/fullscreen.window";

const reportError = (error: unknown): void => {
  console.error("[full-screen-any-website]", error);
};

chrome.action.onClicked.addListener((tab) => {
  toggleWindowFullscreen(tab.windowId).catch(reportError);
});

chrome.windows.onRemoved.addListener((windowId) => {
  discardRestoreState(windowId).catch(reportError);
});
