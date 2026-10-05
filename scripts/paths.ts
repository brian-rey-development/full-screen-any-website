import { join, resolve } from "node:path";

const ROOT = resolve(import.meta.dirname, "..");

export const fromRoot = (...segments: string[]): string => join(ROOT, ...segments);
