import { afterEach, describe, expect, it, vi } from "vitest";
import { stubChrome } from "../testing/chrome-stub";
import {
  discardRestoreState,
  parseRestorableState,
  saveRestoreState,
  takeRestoreState,
} from "./fullscreen.storage";

describe("parseRestorableState", () => {
  it.each([
    ["maximized", "maximized"],
    ["normal", "normal"],
    ["minimized", "normal"],
    ["fullscreen", "normal"],
    [undefined, "normal"],
    [42, "normal"],
  ])("maps %s to %s", (input, expected) => {
    expect(parseRestorableState(input)).toBe(expected);
  });
});

describe("restore state storage", () => {
  afterEach(() => vi.unstubAllGlobals());

  it("keeps windows isolated from each other", async () => {
    stubChrome("normal");
    await saveRestoreState(1, "maximized");
    await saveRestoreState(2, "normal");
    expect(await takeRestoreState(1)).toBe("maximized");
    expect(await takeRestoreState(2)).toBe("normal");
  });

  it("defaults to normal when nothing was saved", async () => {
    stubChrome("normal");
    expect(await takeRestoreState(3)).toBe("normal");
  });

  it("discards saved state", async () => {
    const { store } = stubChrome("normal");
    await saveRestoreState(3, "maximized");
    await discardRestoreState(3);
    expect(store.size).toBe(0);
  });
});
