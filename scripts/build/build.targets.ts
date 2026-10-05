export const BUILD_TARGETS = ["chrome", "firefox"] as const;

export type BuildTarget = (typeof BUILD_TARGETS)[number];
