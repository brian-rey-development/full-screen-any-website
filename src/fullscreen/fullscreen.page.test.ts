import { afterEach, describe, expect, it, vi } from "vitest";
import { togglePageFullscreen } from "./fullscreen.page";

function stubDocument(fullscreenElement: object | null, request = () => Promise.resolve()) {
  const fake = {
    fullscreenElement,
    exitFullscreen: vi.fn(() => Promise.resolve()),
    documentElement: { requestFullscreen: vi.fn(request) },
  };
  vi.stubGlobal("document", fake);
  return fake;
}

describe("togglePageFullscreen", () => {
  afterEach(() => vi.unstubAllGlobals());

  it("enters fullscreen when the page is not fullscreen", async () => {
    const fake = stubDocument(null);
    await togglePageFullscreen();
    expect(fake.documentElement.requestFullscreen).toHaveBeenCalled();
    expect(fake.exitFullscreen).not.toHaveBeenCalled();
  });

  it("exits fullscreen when the page is already fullscreen", async () => {
    const fake = stubDocument({});
    await togglePageFullscreen();
    expect(fake.exitFullscreen).toHaveBeenCalled();
    expect(fake.documentElement.requestFullscreen).not.toHaveBeenCalled();
  });

  it("surfaces a rejected request to the caller", async () => {
    stubDocument(null, () => Promise.reject(new TypeError("denied")));
    await expect(togglePageFullscreen()).rejects.toThrow("denied");
  });
});
