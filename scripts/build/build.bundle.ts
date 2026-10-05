import { build } from "esbuild";
import { fromRoot } from "../paths";

const ENTRY_POINTS = {
  background: fromRoot("src", "background", "background.entry.ts"),
  content: fromRoot("src", "content", "content.entry.ts"),
};

export async function bundleScripts(outDir: string): Promise<void> {
  await build({
    entryPoints: ENTRY_POINTS,
    outdir: outDir,
    bundle: true,
    format: "iife",
    target: "es2022",
    minify: true,
    legalComments: "none",
  });
}
