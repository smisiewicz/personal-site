import type { Projected } from '../camera';
import type { HiveEngine } from '../engine';
import { clamp, HEX_UNIT, type HexOrientation } from '../geometry';
import type { HiveCell } from '../layout';
import { tone } from '../palette';

export type Ctx = CanvasRenderingContext2D;

/** Traces a hexagon on the tilted hive plane (each corner is projected individually). */
export function traceHex(
  ctx: Ctx,
  engine: HiveEngine,
  x: number,
  y: number,
  radius: number,
  orientation: HexOrientation,
  z = 0,
): void {
  const unit = HEX_UNIT[orientation];
  ctx.beginPath();
  for (let i = 0; i < 6; i++) {
    const p = engine.project(x + unit[i].x * radius, y + unit[i].y * radius, z);
    if (i === 0) ctx.moveTo(p.x, p.y);
    else ctx.lineTo(p.x, p.y);
  }
  ctx.closePath();
}

/** Traces a hexagon in the current (cell-local) transform. */
export function traceLocalHex(ctx: Ctx, radius: number, orientation: HexOrientation, cx = 0, cy = 0): void {
  const unit = HEX_UNIT[orientation];
  ctx.beginPath();
  for (let i = 0; i < 6; i++) {
    if (i === 0) ctx.moveTo(cx + unit[i].x * radius, cy + unit[i].y * radius);
    else ctx.lineTo(cx + unit[i].x * radius, cy + unit[i].y * radius);
  }
  ctx.closePath();
}

/** Cheap neon: a wide faint stroke under a thin bright one (canvas shadowBlur is too slow full-screen). */
export function glowStroke(ctx: Ctx, alpha: number, width: number, heat = 0): void {
  // A hot line keeps a cyan halo around its white core.
  ctx.lineJoin = 'round';
  if (heat > 0.02) {
    // Outermost bloom, only when hot: very wide and very faint so it reads as light, not as a border.
    ctx.lineWidth = width * 9;
    ctx.strokeStyle = tone(0, alpha * heat * 0.07);
    ctx.stroke();
  }
  ctx.lineWidth = width * 4.5;
  ctx.strokeStyle = tone(heat * 0.3, alpha * (0.14 + heat * 0.08));
  ctx.stroke();
  ctx.lineWidth = width;
  ctx.strokeStyle = tone(heat, alpha);
  ctx.stroke();
}

/** Switches to a transform where (0,0) is the cell centre and 1 unit is 1 world unit. */
export function setLocal(ctx: Ctx, engine: HiveEngine, centre: Projected, scale = 1): void {
  const s = engine.dpr * centre.s * scale;
  ctx.setTransform(s, 0, 0, s, engine.dpr * centre.x, engine.dpr * centre.y);
}

export function setScreen(ctx: Ctx, engine: HiveEngine): void {
  ctx.setTransform(engine.dpr, 0, 0, engine.dpr, 0, 0);
}

export function isOnScreen(engine: HiveEngine, centre: Projected, radiusPx: number): boolean {
  return (
    centre.x + radiusPx > 0 &&
    centre.x - radiusPx < engine.vw &&
    centre.y + radiusPx > 0 &&
    centre.y - radiusPx < engine.vh
  );
}

/** 0..1 draw-in progress for a cell during boot: cells nearer the hive centre appear first. */
export function bootReveal(engine: HiveEngine, cell: HiveCell): number {
  if (engine.boot >= 1) return 1;
  const { minX, maxX, minY, maxY } = engine.layout.bounds;
  const distance = Math.hypot(cell.x - (minX + maxX) / 2, cell.y - (minY + maxY) / 2);
  return clamp((engine.boot - Math.min(0.6, distance / 4200)) / 0.4, 0, 1);
}

interface TextStyle {
  font: string;
  color: string;
  /** Letter spacing in world units. */
  spacing?: number;
  align?: CanvasTextAlign;
}

export function drawText(ctx: Ctx, text: string, x: number, y: number, style: TextStyle): void {
  ctx.font = style.font;
  ctx.fillStyle = style.color;
  ctx.textAlign = style.align ?? 'center';
  ctx.textBaseline = 'middle';
  // letterSpacing is not in every TS DOM lib yet, and is simply ignored by browsers without it.
  (ctx as Ctx & { letterSpacing: string }).letterSpacing = `${style.spacing ?? 0}px`;
  ctx.fillText(text, x, y);
}

/** Greedy word wrap, truncated with an ellipsis at maxLines. */
export function wrapLines(ctx: Ctx, text: string, maxWidth: number, maxLines: number): string[] {
  const lines: string[] = [];
  let line = '';
  text.split(' ').forEach((word) => {
    const candidate = line ? `${line} ${word}` : word;
    if (line && ctx.measureText(candidate).width > maxWidth) {
      lines.push(line);
      line = word;
    } else {
      line = candidate;
    }
  });
  if (line) lines.push(line);
  if (lines.length <= maxLines) return lines;
  return [...lines.slice(0, maxLines - 1), `${lines[maxLines - 1]}…`];
}

/** Draws an image scaled to cover a box centred on (cx, cy). */
export function drawCover(ctx: Ctx, image: HTMLImageElement, cx: number, cy: number, w: number, h: number): void {
  if (!image.complete || image.naturalWidth === 0) return;
  const scale = Math.max(w / image.naturalWidth, h / image.naturalHeight);
  const dw = image.naturalWidth * scale;
  const dh = image.naturalHeight * scale;
  ctx.drawImage(image, cx - dw / 2, cy - dh / 2, dw, dh);
}

/** A bright dash that circles the path currently traced — the "light chasing the border" effect. */
export function strokeChaser(
  ctx: Ctx,
  perimeter: number,
  phase: number,
  alpha: number,
  width: number,
  heat = 0,
): void {
  ctx.setLineDash([perimeter * 0.08, perimeter * 0.92]);
  ctx.lineDashOffset = -phase * perimeter;
  ctx.lineWidth = width;
  ctx.strokeStyle = `rgba(${Math.round(218 + 37 * heat)}, ${Math.round(247 + 8 * heat)}, 255, ${alpha})`;
  ctx.stroke();
  ctx.setLineDash([]);
}
