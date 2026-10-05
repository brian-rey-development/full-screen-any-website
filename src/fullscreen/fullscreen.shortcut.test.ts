import { describe, expect, it } from "vitest";
import { isToggleShortcut } from "./fullscreen.shortcut";

const SHORTCUT = {
  code: "KeyF",
  altKey: true,
  shiftKey: true,
  ctrlKey: false,
  metaKey: false,
  repeat: false,
};

describe("isToggleShortcut", () => {
  it("matches Alt+Shift+F", () => {
    expect(isToggleShortcut(SHORTCUT)).toBe(true);
  });

  it.each([
    ["another key", { code: "KeyG" }],
    ["missing Alt", { altKey: false }],
    ["missing Shift", { shiftKey: false }],
    ["extra Ctrl", { ctrlKey: true }],
    ["extra Cmd", { metaKey: true }],
    ["auto-repeat", { repeat: true }],
  ])("ignores %s", (_label, override) => {
    expect(isToggleShortcut({ ...SHORTCUT, ...override })).toBe(false);
  });
});
