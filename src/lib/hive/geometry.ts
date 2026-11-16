export const SQRT3 = Math.sqrt(3);

export type HexOrientation = 'pointy' | 'flat';

export interface Point {
  x: number;
  y: number;
}

function unitCorners(startDeg: number): ReadonlyArray<Point> {
  return Array.from({ length: 6 }, (_, i) => {
    const angle = ((startDeg + 60 * i) * Math.PI) / 180;
    return { x: Math.cos(angle), y: Math.sin(angle) };
  });
}

/** Unit-radius corner offsets, clockwise in screen space. */
export const HEX_UNIT: Record<HexOrientation, ReadonlyArray<Point>> = {
  pointy: unitCorners(-90),
  flat: unitCorners(0),
};

export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

export function smoothstep(edge0: number, edge1: number, x: number): number {
  const t = clamp((x - edge0) / (edge1 - edge0), 0, 1);
  return t * t * (3 - 2 * t);
}

/** Frame-rate independent exponential approach. */
export function approach(current: number, target: number, rate: number, dt: number): number {
  return current + (target - current) * (1 - Math.exp(-rate * dt));
}

export function pointInPolygon(px: number, py: number, polygon: ReadonlyArray<Point>): boolean {
  let inside = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const a = polygon[i];
    const b = polygon[j];
    if (a.y > py !== b.y > py && px < ((b.x - a.x) * (py - a.y)) / (b.y - a.y) + a.x) {
      inside = !inside;
    }
  }
  return inside;
}

/** Small deterministic hash so decorative cells look the same on every load. */
export function hash2(a: number, b: number): number {
  let h = (a * 374761393 + b * 668265263) | 0;
  h = (h ^ (h >>> 13)) * 1274126177;
  return ((h ^ (h >>> 16)) >>> 0) % 100000;
}
