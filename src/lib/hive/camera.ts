import type { Focus } from '@/types';

import { SQRT3 } from './geometry';
import { BIG_SPACING, type HiveCell, type HiveLayout } from './layout';

export interface CameraPose {
  x: number;
  y: number;
  zoom: number;
}

export interface Projected {
  x: number;
  y: number;
  /** World-unit to screen-pixel scale at this point (zoom combined with perspective). */
  s: number;
}

export type Projector = (wx: number, wy: number, wz?: number) => Projected;

/** Vertical space reserved for the HUD bars so cells never sit underneath them. */
const HUD_RESERVED = 128;
const PERSPECTIVE = 1500;

export function focusedCell(layout: HiveLayout, focus: Focus): HiveCell | null {
  if (focus.section === null) return null;
  if (focus.item !== null && (focus.section === 'experience' || focus.section === 'projects')) {
    return layout.items[focus.section][focus.item] ?? layout.sections[focus.section];
  }
  return layout.sections[focus.section];
}

/** Resting camera for a focus: overview fits the cluster, hubs fit one cell, panels fly inside the cell. */
export function poseForFocus(layout: HiveLayout, focus: Focus, vw: number, vh: number): CameraPose {
  const availableHeight = Math.max(240, vh - HUD_RESERVED);
  const cell = focusedCell(layout, focus);

  if (cell === null) {
    const { minX, maxX, minY, maxY } = layout.bounds;
    return {
      x: (minX + maxX) / 2,
      y: (minY + maxY) / 2,
      zoom: Math.min(vw / ((maxX - minX) * 1.08), availableHeight / ((maxY - minY) * 1.05)),
    };
  }

  const isHubOverview = cell.kind === 'section' && (cell.section === 'experience' || cell.section === 'projects');
  if (isHubOverview) {
    return {
      x: cell.x,
      y: cell.y,
      zoom: Math.min(vw / (SQRT3 * BIG_SPACING * 1.04), availableHeight / (2 * BIG_SPACING * 1.02)),
    };
  }

  const width = cell.orientation === 'pointy' ? SQRT3 * cell.radius : 2 * cell.radius;
  const height = cell.orientation === 'pointy' ? 2 * cell.radius : SQRT3 * cell.radius;
  return { x: cell.x, y: cell.y, zoom: Math.max(vw / width, vh / height) * 1.2 };
}

/**
 * Projects hive-plane coordinates to the screen. The plane is tilted around the screen centre by
 * (rx, ry) and perspective-divided, which is what makes the grid feel like it sits in 3D space.
 */
export function createProjector(pose: CameraPose, rx: number, ry: number, vw: number, vh: number): Projector {
  const cosX = Math.cos(rx);
  const sinX = Math.sin(rx);
  const cosY = Math.cos(ry);
  const sinY = Math.sin(ry);
  const halfW = vw / 2;
  const halfH = vh / 2;

  return (wx: number, wy: number, wz = 0): Projected => {
    const x = (wx - pose.x) * pose.zoom;
    const y = (wy - pose.y) * pose.zoom;
    const z = wz * pose.zoom;
    const x1 = x * cosY + z * sinY;
    const z1 = -x * sinY + z * cosY;
    const y1 = y * cosX - z1 * sinX;
    const z2 = y * sinX + z1 * cosX;
    const scale = PERSPECTIVE / Math.max(200, PERSPECTIVE - z2);
    return { x: halfW + x1 * scale, y: halfH + y1 * scale, s: pose.zoom * scale };
  };
}
