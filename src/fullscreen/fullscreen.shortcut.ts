const TOGGLE_KEY_CODE = "KeyF";

type ShortcutEvent = Pick<
  KeyboardEvent,
  "code" | "altKey" | "shiftKey" | "ctrlKey" | "metaKey" | "repeat"
>;

/** Matches by physical key, so Option+Shift+F on macOS works despite typing "Ï". */
export const isToggleShortcut = (event: ShortcutEvent): boolean =>
  event.code === TOGGLE_KEY_CODE &&
  event.altKey &&
  event.shiftKey &&
  !event.ctrlKey &&
  !event.metaKey &&
  !event.repeat;
