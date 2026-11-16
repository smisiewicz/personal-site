import { SECTIONS, type SectionMeta } from '@/lib/constants';
import type { SectionId } from '@/types';

import type { HiveEngine } from '../engine';
import type { HiveCell } from '../layout';
import { isHub, itemCount } from '../nav';
import { accent, cellFill, cyan, deep, ice } from '../palette';

import { drawCoreCell, drawItemCell } from './drawItems';
import {
  bootReveal,
  drawCover,
  drawText,
  glowStroke,
  isOnScreen,
  setLocal,
  setScreen,
  strokeChaser,
  traceHex,
  traceLocalHex,
  type Ctx,
} from './primitives';

export const PORTRAIT_SRC = '/assets/images/portrait.jpeg';

/** Vertical centre of the emblem drawn in the About and Contact cells, in cell-local units. */
const EMBLEM_Y = -52;

function drawOrbitArcs(ctx: Ctx, engine: HiveEngine, alpha: number): void {
  const t = engine.time;
  ctx.lineWidth = 2.5;
  ctx.strokeStyle = cyan(alpha * 0.7);
  [
    { radius: 146, speed: 0.4, sweep: 1.5 },
    { radius: 146, speed: 0.4, sweep: 0.5, offset: Math.PI },
    { radius: 160, speed: -0.25, sweep: 0.9, offset: 1 },
  ].forEach(({ radius, speed, sweep, offset = 0 }) => {
    ctx.beginPath();
    ctx.arc(0, EMBLEM_Y, radius, t * speed + offset, t * speed + offset + sweep);
    ctx.stroke();
  });
}

function drawAboutEmblem(ctx: Ctx, engine: HiveEngine, alpha: number): void {
  const size = 128;
  const image = engine.images.get(PORTRAIT_SRC);

  ctx.save();
  traceLocalHex(ctx, size, 'pointy', 0, EMBLEM_Y);
  ctx.clip();
  if (image) {
    ctx.globalAlpha = alpha * 0.92;
    drawCover(ctx, image, 0, EMBLEM_Y, size * 2, size * 2);
    ctx.globalAlpha = 1;
  }
  ctx.fillStyle = cyan(0.07);
  ctx.fillRect(-size, EMBLEM_Y - size, size * 2, size * 2);
  // Scan line sweeping down the portrait.
  const sweep = ((engine.time * 0.3) % 1) * size * 2 - size + EMBLEM_Y;
  ctx.fillStyle = ice(0.16 * alpha);
  ctx.fillRect(-size, sweep, size * 2, 3);
  ctx.restore();

  traceLocalHex(ctx, size, 'pointy', 0, EMBLEM_Y);
  ctx.lineWidth = 2;
  ctx.strokeStyle = cyan(alpha * 0.85);
  ctx.stroke();
  drawOrbitArcs(ctx, engine, alpha);
}

function drawContactEmblem(ctx: Ctx, engine: HiveEngine, alpha: number): void {
  // Broadcast rings expanding from a central node.
  for (let i = 0; i < 3; i++) {
    const phase = (engine.time * 0.28 + i / 3) % 1;
    ctx.beginPath();
    ctx.arc(0, EMBLEM_Y, 34 + phase * 100, 0, Math.PI * 2);
    ctx.lineWidth = 2;
    ctx.strokeStyle = cyan(alpha * (1 - phase) * 0.8);
    ctx.stroke();
  }
  traceLocalHex(ctx, 34, 'pointy', 0, EMBLEM_Y);
  ctx.fillStyle = deep(0.85);
  ctx.fill();
  ctx.lineWidth = 2;
  ctx.strokeStyle = ice(alpha * 0.9);
  ctx.stroke();
  drawText(ctx, '@', 0, EMBLEM_Y + 1, { font: `700 30px ${engine.fonts.display}`, color: ice(alpha) });
  drawOrbitArcs(ctx, engine, alpha);
}

function drawLabel(
  ctx: Ctx,
  engine: HiveEngine,
  meta: SectionMeta,
  tagline: string,
  y: number,
  alpha: number,
  scale: number,
): void {
  const { display, mono } = engine.fonts;
  drawText(ctx, `${meta.code} //`, 0, y - 40, { font: `20px ${mono}`, color: cyan(alpha * 0.9), spacing: 4 });
  drawText(ctx, meta.label.toUpperCase(), 0, y, { font: `700 40px ${display}`, color: ice(alpha), spacing: 6 });
  if (15 * scale >= 7) {
    drawText(ctx, tagline.toUpperCase(), 0, y + 37, { font: `15px ${mono}`, color: cyan(alpha * 0.8), spacing: 3 });
  }
}

/** Hub cells show their item cells faintly at overview, with the title on a band across the middle. */
function drawHubBand(ctx: Ctx, cell: HiveCell, alpha: number): void {
  ctx.save();
  traceLocalHex(ctx, cell.radius - 3, cell.orientation);
  ctx.clip();
  ctx.fillStyle = deep(0.84 * alpha);
  ctx.fillRect(-cell.radius, -70, cell.radius * 2, 140);
  ctx.fillStyle = cyan(0.5 * alpha);
  ctx.fillRect(-cell.radius, -70, cell.radius * 2, 1.5);
  ctx.fillRect(-cell.radius, 68.5, cell.radius * 2, 1.5);
  ctx.restore();
}

export function drawSectionCell(ctx: Ctx, engine: HiveEngine, cell: HiveCell): void {
  const section = cell.section as SectionId;
  const meta = SECTIONS.find((entry) => entry.id === section);
  if (!meta) return;

  const open = engine.open[section];
  // While the camera is inside another section, neighbours recede so they don't compete with it.
  const recede = 1 - 0.9 * Math.max(0, Math.max(...Object.values(engine.open)) - open);
  const lift = (engine.lifts.get(cell.id) ?? 0) * (1 - open);
  const z = (lift * 30) / engine.pose.zoom;
  const scale = 1 + lift * 0.035;
  const centre = engine.project(cell.x, cell.y, z);
  const radiusPx = cell.radius * centre.s * scale;
  if (!isOnScreen(engine, centre, radiusPx)) return;

  const reveal = bootReveal(engine, cell);
  if (reveal <= 0) return;
  const content = Math.max(0, reveal * 2 - 1);
  const perimeter = radiusPx * 6;

  setScreen(ctx, engine);
  traceHex(ctx, engine, cell.x, cell.y, cell.radius * scale, cell.orientation, z);
  ctx.fillStyle = cellFill(0.38 + lift * 0.3);
  ctx.fill();
  if (lift > 0.02) {
    ctx.fillStyle = accent(lift * 0.05);
    ctx.fill();
  }
  if (reveal < 1) ctx.setLineDash([perimeter * reveal, perimeter]);
  glowStroke(ctx, (0.62 + lift * 0.38) * reveal * (0.45 + 0.55 * recede), 1.6 + lift * 1.6, lift);
  ctx.setLineDash([]);
  if (reveal >= 1 && !engine.reducedMotion) {
    strokeChaser(ctx, perimeter, engine.time * 0.09 + cell.seed * 0.25, 0.55 + lift * 0.45, 2, lift);
  }

  traceHex(ctx, engine, cell.x, cell.y, cell.radius * scale - 15, cell.orientation, z);
  ctx.setLineDash([5, 9]);
  ctx.lineDashOffset = engine.reducedMotion ? 0 : -engine.time * 16;
  ctx.lineWidth = 1;
  ctx.strokeStyle = cyan((0.2 + lift * 0.25) * content);
  ctx.stroke();
  ctx.setLineDash([]);

  if (lift > 0.02) {
    // Hover halo: a second outline just outside the cell.
    traceHex(ctx, engine, cell.x, cell.y, cell.radius * scale + 9, cell.orientation, z);
    ctx.lineWidth = 1;
    ctx.strokeStyle = accent(lift * 0.45);
    ctx.stroke();
  }

  const labelAlpha = (1 - open) * content * recede;

  if (isHub(section)) {
    engine.layout.items[section].forEach((item) => drawItemCell(ctx, engine, item, open, content * recede));
    engine.layout.cores
      .filter((core) => core.section === section)
      .forEach((core) => drawCoreCell(ctx, engine, core, open, content * recede));
    if (labelAlpha > 0.02) {
      setLocal(ctx, engine, centre, scale);
      drawHubBand(ctx, cell, labelAlpha);
      const count = String(itemCount(section)).padStart(2, '0');
      drawLabel(ctx, engine, meta, `${count} nodes // ${meta.tagline}`, 10, labelAlpha, centre.s);
    }
    return;
  }

  // About and Contact fade their emblem as the camera dives in and the panel takes over.
  const emblemAlpha = content * (1 - open * 0.75) * recede;
  setLocal(ctx, engine, centre, scale);
  if (section === 'about') drawAboutEmblem(ctx, engine, emblemAlpha);
  else drawContactEmblem(ctx, engine, emblemAlpha);
  if (labelAlpha > 0.02) drawLabel(ctx, engine, meta, meta.tagline, 164, labelAlpha, centre.s);
}
