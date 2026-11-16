import type { HiveEngine } from '../engine';
import { clamp, SQRT3 } from '../geometry';
import type { HiveCell } from '../layout';
import { cyan, ice } from '../palette';

import { bootReveal, drawText, glowStroke, isOnScreen, setLocal, setScreen, traceHex, type Ctx } from './primitives';

const MESH_RADIUS = 26;
const TRAIL_EDGES = 4;
let meshTile: HTMLCanvasElement | null = null;

/** Fine hex mesh tile for the far background layer. */
function getMeshTile(): HTMLCanvasElement {
  if (meshTile) return meshTile;
  const width = MESH_RADIUS * 3;
  const height = Math.round(MESH_RADIUS * SQRT3);
  const tile = document.createElement('canvas');
  tile.width = width * 2;
  tile.height = height * 2;
  const ctx = tile.getContext('2d');
  if (ctx) {
    // Height is rounded to whole pixels so the tile repeats seamlessly; stretch the drawing to match.
    ctx.scale(2, (2 * height) / (MESH_RADIUS * SQRT3));
    ctx.strokeStyle = cyan(0.5);
    ctx.lineWidth = 0.6;
    const h = MESH_RADIUS * SQRT3;
    const centres = [[0, 0], [width, 0], [0, h], [width, h], [width / 2, h / 2]];
    centres.forEach(([cx, cy]) => {
      ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        const angle = (Math.PI / 3) * i;
        const x = cx + Math.cos(angle) * MESH_RADIUS;
        const y = cy + Math.sin(angle) * MESH_RADIUS;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.stroke();
    });
  }
  meshTile = tile;
  return tile;
}

/** Far layer: moves and scales less than the hive, which is what sells the depth. */
export function drawBackdrop(ctx: Ctx, engine: HiveEngine): void {
  const pattern = ctx.createPattern(getMeshTile(), 'repeat');
  if (!pattern) return;
  const { pose, vw, vh } = engine;
  const scale = clamp(0.32 + Math.log2(1 + pose.zoom) * 0.42, 0.4, 1.9);
  pattern.setTransform(
    new DOMMatrix()
      .translate(vw / 2 - pose.x * scale * 0.22 - engine.ry * 260, vh / 2 - pose.y * scale * 0.22 + engine.rx * 260)
      .scale(scale),
  );
  setScreen(ctx, engine);
  ctx.globalAlpha = 0.2 * engine.boot;
  ctx.fillStyle = pattern;
  ctx.fillRect(0, 0, vw, vh);
  ctx.globalAlpha = 1;
}

function drawDoodad(ctx: Ctx, engine: HiveEngine, cell: HiveCell, alpha: number): void {
  const t = engine.time;
  const variant = cell.seed % 6;
  const spin = (cell.seed % 2 === 0 ? 1 : -1) * t * (0.15 + (cell.seed % 7) * 0.03);

  if (variant === 1) {
    ctx.lineWidth = 2;
    ctx.strokeStyle = cyan(alpha);
    [110, 136].forEach((radius, i) => {
      const start = spin * (i === 0 ? 1 : -1.6);
      ctx.beginPath();
      ctx.arc(0, 0, radius, start, start + 1.4 + i * 0.6);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(0, 0, radius, start + Math.PI, start + Math.PI + 0.5);
      ctx.stroke();
    });
  } else if (variant === 2) {
    const tick = Math.floor(t / 2.5);
    for (let row = 0; row < 4; row++) {
      const value = ((cell.seed + 1) * (row + 3) * 2654435761 + tick * 40503 * (row + 1)) >>> 0;
      const code = value.toString(16).toUpperCase().padStart(8, '0');
      drawText(ctx, `0x${code}`, -78, -36 + row * 24, {
        font: `16px ${engine.fonts.mono}`,
        color: cyan(alpha * (row === tick % 4 ? 1.6 : 0.8)),
        align: 'left',
        spacing: 1.5,
      });
    }
  } else if (variant === 3) {
    const active = Math.floor(t * 6 + cell.seed) % 36;
    for (let i = 0; i < 36; i++) {
      const angle = (i / 36) * Math.PI * 2;
      const inner = i % 3 === 0 ? 138 : 148;
      ctx.beginPath();
      ctx.moveTo(Math.cos(angle) * inner, Math.sin(angle) * inner);
      ctx.lineTo(Math.cos(angle) * 160, Math.sin(angle) * 160);
      ctx.lineWidth = 2;
      ctx.strokeStyle = i === active ? ice(Math.min(1, alpha * 4)) : cyan(alpha);
      ctx.stroke();
    }
  } else if (variant === 4) {
    ctx.lineWidth = 1.5;
    ctx.strokeStyle = cyan(alpha);
    ctx.beginPath();
    ctx.moveTo(-60, 0);
    ctx.lineTo(-18, 0);
    ctx.moveTo(18, 0);
    ctx.lineTo(60, 0);
    ctx.moveTo(0, -60);
    ctx.lineTo(0, -18);
    ctx.moveTo(0, 18);
    ctx.lineTo(0, 60);
    ctx.stroke();
    ctx.strokeRect(-6, -6, 12, 12);
    drawText(ctx, `${Math.round(cell.x)} : ${Math.round(cell.y)}`, 0, 92, {
      font: `15px ${engine.fonts.mono}`,
      color: cyan(alpha),
      spacing: 2,
    });
  } else if (variant === 5) {
    for (let bar = 0; bar < 9; bar++) {
      const level = 0.25 + 0.75 * Math.abs(Math.sin(t * 0.9 + bar * 0.8 + cell.seed));
      ctx.fillStyle = cyan(alpha * 0.9);
      ctx.fillRect(-88 + bar * 20, 50 - level * 100, 10, level * 100);
    }
  }
}

export function drawDecoCell(ctx: Ctx, engine: HiveEngine, cell: HiveCell): void {
  const lift = engine.lifts.get(cell.id) ?? 0;
  const centre = engine.project(cell.x, cell.y);
  const radiusPx = cell.radius * centre.s;
  if (!isOnScreen(engine, centre, radiusPx)) return;

  const reveal = bootReveal(engine, cell);
  if (reveal <= 0) return;
  const base = 0.1 + ((cell.seed % 10) / 10) * 0.12;

  setScreen(ctx, engine);
  traceHex(ctx, engine, cell.x, cell.y, cell.radius, cell.orientation);
  if (lift > 0.01) {
    ctx.fillStyle = cyan(0.045 * lift);
    ctx.fill();
  }
  if (reveal < 1) ctx.setLineDash([radiusPx * 6 * reveal, radiusPx * 6]);
  glowStroke(ctx, (base + lift * 0.45) * reveal, 1);
  ctx.setLineDash([]);

  if (radiusPx > 70 && reveal >= 1) {
    setLocal(ctx, engine, centre);
    drawDoodad(ctx, engine, cell, base * 1.15 + lift * 0.3);
  }
}

/** Light runners racing along the channels between cells, each dragging a fading trail. */
export function drawRunners(ctx: Ctx, engine: HiveEngine): void {
  if (engine.boot < 1) return;
  const { vertices } = engine.layout.graph;
  setScreen(ctx, engine);
  ctx.lineCap = 'round';
  const width = clamp(engine.pose.zoom * 2.2, 1.2, 3.5);

  engine.runners.forEach((runner) => {
    const from = vertices[runner.from];
    const to = vertices[runner.to];
    const head = engine.project(from.x + (to.x - from.x) * runner.t, from.y + (to.y - from.y) * runner.t);
    const path = [...runner.trail.map((index) => vertices[index]), from].map((v) => engine.project(v.x, v.y));
    path.push(head);

    for (let i = path.length - 1; i > 0; i--) {
      // Distance behind the head in edge lengths; reaches zero exactly when the vertex leaves the trail.
      const fade = 1 - (path.length - 1 - i + runner.t) / TRAIL_EDGES;
      if (fade <= 0) continue;
      ctx.beginPath();
      ctx.moveTo(path[i].x, path[i].y);
      ctx.lineTo(path[i - 1].x, path[i - 1].y);
      ctx.lineWidth = width * 3.5;
      ctx.strokeStyle = cyan(0.1 * fade);
      ctx.stroke();
      ctx.lineWidth = width;
      ctx.strokeStyle = cyan(0.75 * fade);
      ctx.stroke();
    }

    ctx.beginPath();
    ctx.arc(head.x, head.y, width * 1.3, 0, Math.PI * 2);
    ctx.fillStyle = ice(0.95);
    ctx.fill();
  });
  ctx.lineCap = 'butt';
}

export function drawPings(ctx: Ctx, engine: HiveEngine): void {
  setScreen(ctx, engine);
  engine.pings.forEach((ping) => {
    const ease = 1 - (1 - ping.age) ** 3;
    traceHex(ctx, engine, ping.x, ping.y, ping.radius * (1 + ease * 0.35), ping.orientation);
    glowStroke(ctx, (1 - ping.age) * 0.9, 2, 1);
  });
}
