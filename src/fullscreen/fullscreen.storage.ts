export type RestorableState = "normal" | "maximized";

const KEY_PREFIX = "restore:";

const keyFor = (windowId: number): string => `${KEY_PREFIX}${windowId}`;

export const parseRestorableState = (value: unknown): RestorableState =>
  value === "maximized" ? "maximized" : "normal";

export async function saveRestoreState(windowId: number, state: RestorableState): Promise<void> {
  await chrome.storage.session.set({ [keyFor(windowId)]: state });
}

export async function takeRestoreState(windowId: number): Promise<RestorableState> {
  const key = keyFor(windowId);
  const stored = await chrome.storage.session.get(key);
  await chrome.storage.session.remove(key);
  return parseRestorableState(stored[key]);
}

export async function discardRestoreState(windowId: number): Promise<void> {
  await chrome.storage.session.remove(keyFor(windowId));
}
