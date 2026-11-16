import type { HiveEngine } from '../engine';
import { clamp, smoothstep } from '../geometry';
import { cyan, ice, tone } from '../palette';

import { distanceFromCentre, ignitionFront, setScreen, type Ctx } from './primitives';

/** World distance behind the wavefront over which a traced line cools and fades. */
const WAKE = 950;

/**
 * Opening animation: light starts at the centre of the hive and races outward along the channels
 * between cells, white-hot at the leading edge and cooling behind it.
 */
export function drawIgnition(ctx: Ctx, engine: HiveEngine): void {
  if (engine.boot >= 1) return;
  const { vertices, edges } = engine.layout.graph;
  const front = ignitionFront(engine);
  const fadeOut = 1 - smoothstep(0.72, 1, engine.boot);
  const width = clamp(engine.pose.zoom * 2.4, 1.2, 3.5);

  setScreen(ctx, engine);
  ctx.lineCap = 'round';

  edges.forEach(([ia, ib]) => {
    let near = vertices[ia];
    let far = vertices[ib];
    let nearDistance = distanceFromCentre(engine, near.x, near.y);
    let farDistance = distanceFromCentre(engine, far.x, far.y);
    if (nearDistance > farDistance) {
      [near, far] = [far, near];
      [nearDistance, farDistance] = [farDistance, nearDistance];
    }
    if (front <= nearDistance) return;

    const span = Math.max(1, farDistance - nearDistance);
    const travelled = clamp((front - nearDistance) / span, 0, 1);
    const glow = (1 - clamp((front - farDistance) / WAKE, 0, 1)) * fadeOut;
    if (glow <= 0.01) return;

    const start = engine.project(near.x, near.y);
    const head = engine.project(near.x + (far.x - near.x) * travelled, near.y + (far.y - near.y) * travelled);
    ctx.beginPath();
    ctx.moveTo(start.x, start.y);
    ctx.lineTo(head.x, head.y);
    ctx.lineWidth = width * 4;
    ctx.strokeStyle = cyan(0.13 * glow);
    ctx.stroke();
    ctx.lineWidth = width;
    ctx.strokeStyle = tone(glow * glow, 0.9 * glow);
    ctx.stroke();

    if (travelled < 1) {
      ctx.beginPath();
      ctx.arc(head.x, head.y, width * 1.5, 0, Math.PI * 2);
      ctx.fillStyle = ice(fadeOut);
      ctx.fill();
    }
  });
  ctx.lineCap = 'butt';

  // The single point of light everything starts from.
  const spark = 1 - clamp(engine.boot / 0.22, 0, 1);
  if (spark > 0) {
    const { minX, maxX, minY, maxY } = engine.layout.bounds;
    const centre = engine.project((minX + maxX) / 2, (minY + maxY) / 2);
    const radius = 30 + engine.boot * 520;
    const gradient = ctx.createRadialGradient(centre.x, centre.y, 0, centre.x, centre.y, radius);
    gradient.addColorStop(0, ice(spark));
    gradient.addColorStop(0.25, cyan(0.5 * spark));
    gradient.addColorStop(1, cyan(0));
    ctx.fillStyle = gradient;
    ctx.fillRect(centre.x - radius, centre.y - radius, radius * 2, radius * 2);
  }
}
