import { parseRestorableState, saveRestoreState, takeRestoreState } from "./fullscreen.storage";

type WindowState = chrome.windows.Window["state"];

async function enterWindowFullscreen(windowId: number, previous: WindowState): Promise<void> {
  await saveRestoreState(windowId, parseRestorableState(previous));
  await chrome.windows.update(windowId, { state: "fullscreen" });
}

async function exitWindowFullscreen(windowId: number): Promise<void> {
  const restored = await takeRestoreState(windowId);
  await chrome.windows.update(windowId, { state: restored });
}

export async function toggleWindowFullscreen(windowId: number): Promise<void> {
  const { state } = await chrome.windows.get(windowId);
  if (state === "fullscreen") return exitWindowFullscreen(windowId);
  return enterWindowFullscreen(windowId, state);
}
