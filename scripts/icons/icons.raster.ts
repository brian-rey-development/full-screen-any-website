import { colorAt, TRANSPARENT, type Rgba } from "./icons.design";

const SUPERSAMPLE = 4;
const SAMPLES_PER_PIXEL = SUPERSAMPLE * SUPERSAMPLE;
const SAMPLE_OFFSET = 0.5;
const BYTES_PER_PIXEL = 4;
const FILTER_BYTES = 1;

function* subSamples(x: number, y: number, size: number): Generator<readonly [number, number]> {
  for (let row = 0; row < SUPERSAMPLE; row++) {
    for (let col = 0; col < SUPERSAMPLE; col++) {
      yield [
        (x + (col + SAMPLE_OFFSET) / SUPERSAMPLE) / size,
        (y + (row + SAMPLE_OFFSET) / SUPERSAMPLE) / size,
      ];
    }
  }
}

function averagePixel(x: number, y: number, size: number): Rgba {
  let red = 0;
  let green = 0;
  let blue = 0;
  let alpha = 0;
  for (const [u, v] of subSamples(x, y, size)) {
    const [r, g, b, a] = colorAt(u, v);
    red += r * a;
    green += g * a;
    blue += b * a;
    alpha += a;
  }
  if (alpha === 0) return TRANSPARENT;
  return [
    Math.round(red / alpha),
    Math.round(green / alpha),
    Math.round(blue / alpha),
    Math.round(alpha / SAMPLES_PER_PIXEL),
  ];
}

/** Anti-aliased RGBA scanlines, each prefixed with PNG filter type 0 (none). */
export function rasterize(size: number): Buffer {
  const stride = size * BYTES_PER_PIXEL + FILTER_BYTES;
  const scanlines = Buffer.alloc(stride * size);
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      scanlines.set(averagePixel(x, y, size), y * stride + FILTER_BYTES + x * BYTES_PER_PIXEL);
    }
  }
  return scanlines;
}
