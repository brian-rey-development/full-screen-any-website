import { readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { fromRoot } from "../paths";
import type { BuildTarget } from "./build.targets";

type Manifest = Record<string, unknown>;

const JSON_INDENT = 2;

export async function readJson<T>(path: string): Promise<T> {
  return JSON.parse(await readFile(path, "utf8")) as T;
}

async function composeManifest(target: BuildTarget, version: string): Promise<Manifest> {
  const base = await readJson<Manifest>(fromRoot("manifest", "base.json"));
  const overrides = await readJson<Manifest>(fromRoot("manifest", `${target}.json`));
  return { ...base, ...overrides, version };
}

export async function writeManifest(
  outDir: string,
  target: BuildTarget,
  version: string,
): Promise<void> {
  const manifest = await composeManifest(target, version);
  await writeFile(
    join(outDir, "manifest.json"),
    `${JSON.stringify(manifest, null, JSON_INDENT)}\n`,
  );
}
