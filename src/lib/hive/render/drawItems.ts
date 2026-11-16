import { experiences } from '@/data/experiences';
import { projects } from '@/data/projects';

import type { HiveEngine } from '../engine';
import type { HiveCell } from '../layout';
import { shortCompany, yearRange } from '../nav';
import { accent, cellFill, cyan, deep, ice } from '../palette';

import {
  drawCover,
  drawText,
  glowStroke,
  isOnScreen,
  setLocal,
  setScreen,
  strokeChaser,
  traceHex,
  traceLocalHex,
  wrapLines,
  type Ctx,
} from './primitives';

function pad(value: number): string {
  return String(value + 1).padStart(2, '0');
}

function drawExperienceLabel(ctx: Ctx, engine: HiveEngine, cell: HiveCell, alpha: number, scale: number): void {
  const entry = experiences[cell.item ?? 0];
  if (!entry) return;
  const r = cell.radius;
  const { display, mono, body } = engine.fonts;

  drawText(ctx, `E.${pad(cell.item ?? 0)}`, 0, -r * 0.56, {
    font: `${r * 0.1}px ${mono}`,
    color: cyan(alpha * 0.75),
    spacing: r * 0.02,
  });

  const company = shortCompany(entry.company).toUpperCase();
  let size = r * 0.21;
  ctx.font = `700 ${size}px ${display}`;
  size *= Math.min(1, (r * 1.5) / ctx.measureText(company).width);
  drawText(ctx, company, 0, -r * 0.16, { font: `700 ${size}px ${display}`, color: ice(alpha) });

  // The role line is only legible once the cell is reasonably large on screen.
  if (r * 0.105 * scale >= 8) {
    ctx.font = `500 ${r * 0.105}px ${body}`;
    wrapLines(ctx, entry.title, r * 1.45, 2).forEach((line, i) => {
      drawText(ctx, line, 0, r * 0.1 + i * r * 0.13, { font: `500 ${r * 0.105}px ${body}`, color: cyan(alpha * 0.9) });
    });
  }

  drawText(ctx, yearRange(entry.date), 0, r * 0.56, {
    font: `${r * 0.12}px ${mono}`,
    color: ice(alpha * 0.8),
    spacing: r * 0.015,
  });
}

function drawProjectLabel(ctx: Ctx, engine: HiveEngine, cell: HiveCell, alpha: number): void {
  const entry = projects[cell.item ?? 0];
  if (!entry) return;
  const r = cell.radius;
  const { display, mono } = engine.fonts;

  drawText(ctx, `P.${pad(cell.item ?? 0)}`, 0, -r * 0.58, {
    font: `${r * 0.1}px ${mono}`,
    color: ice(alpha * 0.85),
    spacing: r * 0.02,
  });

  // Play triangle for video demos, stacked frames for image galleries.
  ctx.strokeStyle = ice(alpha * 0.9);
  ctx.lineWidth = r * 0.02;
  ctx.beginPath();
  ctx.arc(0, -r * 0.2, r * 0.19, 0, Math.PI * 2);
  ctx.stroke();
  ctx.fillStyle = ice(alpha * 0.9);
  if (entry.videoUrl) {
    ctx.beginPath();
    ctx.moveTo(-r * 0.06, -r * 0.29);
    ctx.lineTo(r * 0.1, -r * 0.2);
    ctx.lineTo(-r * 0.06, -r * 0.11);
    ctx.closePath();
    ctx.fill();
  } else {
    ctx.strokeRect(-r * 0.1, -r * 0.27, r * 0.15, r * 0.11);
    ctx.fillRect(-r * 0.04, -r * 0.22, r * 0.15, r * 0.11);
  }

  ctx.font = `600 ${r * 0.135}px ${display}`;
  wrapLines(ctx, entry.title.toUpperCase(), r * 1.4, 3).forEach((line, i) => {
    drawText(ctx, line, 0, r * 0.16 + i * r * 0.165, { font: `600 ${r * 0.135}px ${display}`, color: ice(alpha) });
  });
}

/** One job or project cell inside a hub section. `open` is how far the camera is into that hub. */
export function drawItemCell(ctx: Ctx, engine: HiveEngine, cell: HiveCell, open: number, reveal: number): void {
  const lift = (engine.lifts.get(cell.id) ?? 0) * open;
  const z = (lift * 34) / engine.pose.zoom;
  const scale = 1 + lift * 0.05;
  const centre = engine.project(cell.x, cell.y, z);
  const radiusPx = cell.radius * centre.s * scale;
  if (!isOnScreen(engine, centre, radiusPx)) return;

  const isProject = cell.section === 'projects';
  const image = isProject ? engine.images.get(projects[cell.item ?? 0]?.thumbnail ?? '') : undefined;

  setScreen(ctx, engine);
  traceHex(ctx, engine, cell.x, cell.y, cell.radius * scale, cell.orientation, z);
  ctx.fillStyle = cellFill(0.55 + lift * 0.25);
  ctx.fill();
  if (lift > 0.02 && !image) {
    ctx.fillStyle = accent(lift * 0.06);
    ctx.fill();
  }

  if (image) {
    setLocal(ctx, engine, centre, scale);
    ctx.save();
    traceLocalHex(ctx, cell.radius - 1, cell.orientation);
    ctx.clip();
    ctx.globalAlpha = (0.22 + open * 0.38 + lift * 0.4) * reveal;
    drawCover(ctx, image, 0, 0, cell.radius * 2, cell.radius * 1.74);
    ctx.globalAlpha = 1;
    ctx.fillStyle = deep(0.62 - lift * 0.27);
    ctx.fillRect(-cell.radius, -cell.radius, cell.radius * 2, cell.radius * 2);
    ctx.restore();
    setScreen(ctx, engine);
    traceHex(ctx, engine, cell.x, cell.y, cell.radius * scale, cell.orientation, z);
  }

  glowStroke(ctx, (0.26 + open * 0.4 + lift * 0.34) * reveal, 1 + open * 0.5 + lift * 1.3, lift);
  if (lift > 0.02) strokeChaser(ctx, radiusPx * 6, engine.time * 0.6, lift, 2, 1);

  // Once this cell's panel is open the camera is inside it; a screen-filling label would only distract.
  const labelAlpha = open * reveal * (1 - engine.panelBlend);
  if (labelAlpha > 0.02 && radiusPx > 34) {
    setLocal(ctx, engine, centre, scale);
    if (isProject) drawProjectLabel(ctx, engine, cell, labelAlpha);
    else drawExperienceLabel(ctx, engine, cell, labelAlpha, centre.s * scale);
  }
}

/** The non-interactive title cell at the centre of the projects flower. */
export function drawCoreCell(ctx: Ctx, engine: HiveEngine, cell: HiveCell, open: number, reveal: number): void {
  const centre = engine.project(cell.x, cell.y);
  const radiusPx = cell.radius * centre.s;
  if (!isOnScreen(engine, centre, radiusPx)) return;
  const r = cell.radius;

  setScreen(ctx, engine);
  traceHex(ctx, engine, cell.x, cell.y, r, cell.orientation);
  ctx.fillStyle = deep(0.6);
  ctx.fill();
  glowStroke(ctx, (0.2 + open * 0.3) * reveal, 1);

  setLocal(ctx, engine, centre);
  ctx.lineWidth = r * 0.02;
  ctx.strokeStyle = cyan((0.25 + open * 0.35) * reveal);
  const spin = engine.time * 0.5;
  [0, 2.1, 4.2].forEach((offset) => {
    ctx.beginPath();
    ctx.arc(0, 0, r * 0.66, spin + offset, spin + offset + 1.3);
    ctx.stroke();
  });

  if (open * reveal > 0.02 && radiusPx > 34) {
    const { display, mono } = engine.fonts;
    drawText(ctx, String(projects.length).padStart(2, '0'), 0, -r * 0.12, {
      font: `700 ${r * 0.36}px ${display}`,
      color: ice(open * reveal),
    });
    drawText(ctx, 'MODULES', 0, r * 0.2, {
      font: `${r * 0.12}px ${mono}`,
      color: cyan(open * reveal),
      spacing: r * 0.03,
    });
  }
}
