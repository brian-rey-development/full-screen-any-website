import { vi } from "vitest";

export type WindowState = NonNullable<chrome.windows.Window["state"]>;

export interface ChromeStub {
  readonly win: { state: WindowState };
  readonly store: Map<string, unknown>;
}

export function stubChrome(initialState: WindowState): ChromeStub {
  const win = { state: initialState };
  const store = new Map<string, unknown>();

  vi.stubGlobal("chrome", {
    windows: {
      get: (id: number) => Promise.resolve({ id, state: win.state }),
      update: (_id: number, info: { state: WindowState }) => {
        win.state = info.state;
        return Promise.resolve();
      },
    },
    storage: {
      session: {
        set: (items: Record<string, unknown>) => {
          for (const [key, value] of Object.entries(items)) store.set(key, value);
          return Promise.resolve();
        },
        get: (key: string) => Promise.resolve(store.has(key) ? { [key]: store.get(key) } : {}),
        remove: (key: string) => {
          store.delete(key);
          return Promise.resolve();
        },
      },
    },
  });

  return { win, store };
}
