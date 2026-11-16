import type { HiveEngine } from '../engine';
import { deep } from '../palette';

import { drawBackdrop, drawDecoCell, drawPings, drawRunners } from './drawAmbient';
import { drawSectionCell } from './drawSection';
import { setScreen, type Ctx } from './primitives';

/** Draws one frame, back to front. */
export function drawScene(ctx: Ctx, engine: HiveEngine): void {
  setScreen(ctx, engine);
  ctx.clearRect(0, 0, engine.vw, engine.vh);

  drawBackdrop(ctx, engine);
  engine.layout.deco.forEach((cell) => drawDecoCell(ctx, engine, cell));
  drawRunners(ctx, engine);
  Object.values(engine.layout.sections).forEach((cell) => drawSectionCell(ctx, engine, cell));
  drawPings(ctx, engine);

  // Push the hive back while a content panel is open so text stays easy to read.
  if (engine.panelBlend > 0.01) {
    setScreen(ctx, engine);
    ctx.fillStyle = deep(0.55 * engine.panelBlend);
    ctx.fillRect(0, 0, engine.vw, engine.vh);
  }
}
