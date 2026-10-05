import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { fromRoot } from "../paths";
import { encodePng } from "./icons.png";
import { rasterize } from "./icons.raster";

// eslint-disable-next-line no-magic-numbers -- sizes required by the browser manifest
const ICON_SIZES = [16, 32, 48, 128] as const;

const OUT_DIR = fromRoot("assets", "icons");

async function writeIcon(size: number): Promise<void> {
  await writeFile(join(OUT_DIR, `${size}.png`), encodePng(size, rasterize(size)));
}

await mkdir(OUT_DIR, { recursive: true });
await Promise.all(ICON_SIZES.map(writeIcon));
console.log(`wrote ${ICON_SIZES.length} icons to assets/icons`);
