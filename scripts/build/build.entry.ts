import { cp, mkdir, rm } from "node:fs/promises";
import { join } from "node:path";
import { fromRoot } from "../paths";
import { bundleScripts } from "./build.bundle";
import { readJson, writeManifest } from "./build.manifest";
import { BUILD_TARGETS, type BuildTarget } from "./build.targets";

async function buildTarget(target: BuildTarget, version: string): Promise<void> {
  const outDir = fromRoot("dist", target);
  await rm(outDir, { recursive: true, force: true });
  await mkdir(outDir, { recursive: true });
  await Promise.all([
    bundleScripts(outDir),
    cp(fromRoot("assets", "icons"), join(outDir, "icons"), { recursive: true }),
    writeManifest(outDir, target, version),
  ]);
  console.log(`built dist/${target}`);
}

async function main(): Promise<void> {
  const { version } = await readJson<{ version: string }>(fromRoot("package.json"));
  await Promise.all(BUILD_TARGETS.map((target) => buildTarget(target, version)));
}

await main();
