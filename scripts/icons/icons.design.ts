export type Rgba = readonly [number, number, number, number];

const OPAQUE = 255;
// eslint-disable-next-line no-magic-numbers -- brand color #2563eb
const BLUE: Rgba = [37, 99, 235, OPAQUE];
const WHITE: Rgba = [OPAQUE, OPAQUE, OPAQUE, OPAQUE];
export const TRANSPARENT: Rgba = [0, 0, 0, 0];

const CENTER = 0.5;
const CORNER_RADIUS = 0.22;
const BRACKET = { margin: 0.24, length: 0.2, thickness: 0.075 } as const;

const insideRoundedSquare = (u: number, v: number): boolean => {
  const inner = CENTER - CORNER_RADIUS;
  const dx = Math.max(Math.abs(u - CENTER) - inner, 0);
  const dy = Math.max(Math.abs(v - CENTER) - inner, 0);
  return dx * dx + dy * dy <= CORNER_RADIUS * CORNER_RADIUS;
};

const insideBracket = (u: number, v: number): boolean => {
  const x = Math.min(u, 1 - u);
  const y = Math.min(v, 1 - v);
  const { margin, length, thickness } = BRACKET;
  const horizontal = y >= margin && y <= margin + thickness && x >= margin && x <= margin + length;
  const vertical = x >= margin && x <= margin + thickness && y >= margin && y <= margin + length;
  return horizontal || vertical;
};

/** Color of the icon at normalized coordinates (u, v), both in [0, 1]. */
export const colorAt = (u: number, v: number): Rgba => {
  if (!insideRoundedSquare(u, v)) return TRANSPARENT;
  return insideBracket(u, v) ? WHITE : BLUE;
};
