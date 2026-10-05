import { afterEach, describe, expect, it, vi } from "vitest";
import { stubChrome } from "../testing/chrome-stub";
import { toggleWindowFullscreen } from "./fullscreen.window";

const WINDOW_ID = 7;

describe("toggleWindowFullscreen", () => {
  afterEach(() => vi.unstubAllGlobals());

  it("enters fullscreen from a normal window and restores it", async () => {
    const { win } = stubChrome("normal");
    await toggleWindowFullscreen(WINDOW_ID);
    expect(win.state).toBe("fullscreen");
    await toggleWindowFullscreen(WINDOW_ID);
    expect(win.state).toBe("normal");
  });

  it("restores a maximized window to maximized", async () => {
    const { win } = stubChrome("maximized");
    await toggleWindowFullscreen(WINDOW_ID);
    await toggleWindowFullscreen(WINDOW_ID);
    expect(win.state).toBe("maximized");
  });

  it("falls back to normal when fullscreen was entered outside the extension", async () => {
    const { win } = stubChrome("fullscreen");
    await toggleWindowFullscreen(WINDOW_ID);
    expect(win.state).toBe("normal");
  });

  it("clears the saved state once it is consumed", async () => {
    const { store } = stubChrome("maximized");
    await toggleWindowFullscreen(WINDOW_ID);
    expect(store.size).toBe(1);
    await toggleWindowFullscreen(WINDOW_ID);
    expect(store.size).toBe(0);
  });
});
