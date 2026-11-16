import type { Focus, SectionId } from '@/types';

import { createProjector, poseForFocus, type CameraPose, type Projector } from './camera';
import { approach, HEX_UNIT, pointInPolygon, type HexOrientation } from './geometry';
import type { HiveCell, HiveLayout } from './layout';
import { hasPanel, isHub } from './nav';

export interface Runner {
  from: number;
  to: number;
  /** Vertices already passed, most recent last — drawn as the fading light trail. */
  trail: number[];
  t: number;
  speed: number;
}

export interface Ping {
  x: number;
  y: number;
  radius: number;
  orientation: HexOrientation;
  age: number;
}

export interface HiveFonts {
  display: string;
  mono: string;
  body: string;
}

export interface HiveEngine {
  layout: HiveLayout;
  vw: number;
  vh: number;
  dpr: number;
  pose: CameraPose;
  rx: number;
  ry: number;
  /** Pointer position normalised to -1..1 from the screen centre. */
  pointerX: number;
  pointerY: number;
  pointerSX: number;
  pointerSY: number;
  pointerActive: boolean;
  hover: HiveCell | null;
  lifts: Map<string, number>;
  /** 0..1 per section: how far the camera has moved "into" that section. */
  open: Record<SectionId, number>;
  panelBlend: number;
  boot: number;
  time: number;
  runners: Runner[];
  pings: Ping[];
  images: Map<string, HTMLImageElement>;
  fonts: HiveFonts;
  reducedMotion: boolean;
  project: Projector;
}

/** Camera read-out shown in the HUD; written by the engine, polled by the status bar. */
export const hiveTelemetry = { x: 0, y: 0, zoom: 1 };

const RUNNER_TRAIL = 3;
const PING_LIFETIME = 0.7;

function spawnRunner(layout: HiveLayout): Runner {
  const { neighbours } = layout.graph;
  const from = Math.floor(Math.random() * neighbours.length);
  const options = neighbours[from];
  return {
    from,
    to: options[Math.floor(Math.random() * options.length)] ?? from,
    trail: [],
    t: Math.random(),
    speed: 1.4 + Math.random() * 1.6,
  };
}

export function createEngine(layout: HiveLayout, reducedMotion: boolean, runnerCount: number): HiveEngine {
  const pose: CameraPose = { x: 0, y: 0, zoom: 1 };
  return {
    layout,
    vw: 1,
    vh: 1,
    dpr: 1,
    pose,
    rx: 0,
    ry: 0,
    pointerX: 0,
    pointerY: 0,
    pointerSX: 0,
    pointerSY: 0,
    pointerActive: false,
    hover: null,
    lifts: new Map(),
    open: { about: 0, experience: 0, projects: 0, contact: 0 },
    panelBlend: 0,
    boot: 0,
    time: 0,
    runners: reducedMotion ? [] : Array.from({ length: runnerCount }, () => spawnRunner(layout)),
    pings: [],
    images: new Map(),
    fonts: { display: 'sans-serif', mono: 'monospace', body: 'sans-serif' },
    reducedMotion,
    project: createProjector(pose, 0, 0, 1, 1),
  };
}

/** Replaces the layout (orientation change) and re-seeds anything that referenced the old graph. */
export function setLayout(engine: HiveEngine, layout: HiveLayout): void {
  engine.layout = layout;
  engine.runners = engine.runners.map(() => spawnRunner(layout));
  engine.hover = null;
  engine.lifts.clear();
}

export function snapCamera(engine: HiveEngine, focus: Focus): void {
  engine.pose = poseForFocus(engine.layout, focus, engine.vw, engine.vh);
}

export function addPing(engine: HiveEngine, cell: HiveCell): void {
  if (engine.reducedMotion) return;
  engine.pings.push({ x: cell.x, y: cell.y, radius: cell.radius, orientation: cell.orientation, age: 0 });
}

/** Whether clicking this cell navigates somewhere given the current focus. */
export function isInteractive(cell: HiveCell | null, focus: Focus): boolean {
  if (cell === null || hasPanel(focus)) return false;
  if (cell.kind === 'item') return focus.section === cell.section;
  if (cell.kind === 'section') return focus.section !== cell.section;
  return false;
}

function cellContains(engine: HiveEngine, cell: HiveCell, sx: number, sy: number): boolean {
  const polygon = HEX_UNIT[cell.orientation].map((unit) =>
    engine.project(cell.x + unit.x * cell.radius, cell.y + unit.y * cell.radius),
  );
  return pointInPolygon(sx, sy, polygon);
}

export function hitTest(engine: HiveEngine, focus: Focus, sx: number, sy: number): HiveCell | null {
  const { layout } = engine;
  if (isHub(focus.section)) {
    const item = layout.items[focus.section].find((cell) => cellContains(engine, cell, sx, sy));
    if (item) return item;
  }
  const section = Object.values(layout.sections).find((cell) => cellContains(engine, cell, sx, sy));
  return section ?? layout.deco.find((cell) => cellContains(engine, cell, sx, sy)) ?? null;
}

function stepCamera(engine: HiveEngine, focus: Focus, dt: number): void {
  const panelOpen = hasPanel(focus);
  const target = poseForFocus(engine.layout, focus, engine.vw, engine.vh);

  // Hovering pulls the camera toward the cell and nudges the zoom: the "3D space adjustment".
  if (!panelOpen && engine.pointerActive && !engine.reducedMotion) {
    const hover = isInteractive(engine.hover, focus) ? engine.hover : null;
    if (hover) {
      target.x += (hover.x - target.x) * 0.12;
      target.y += (hover.y - target.y) * 0.12;
      target.zoom *= 1.045;
    }
    target.x += (engine.pointerX * 34) / target.zoom;
    target.y += (engine.pointerY * 22) / target.zoom;
  }

  if (engine.reducedMotion) {
    engine.pose = target;
    engine.rx = 0;
    engine.ry = 0;
    return;
  }

  // Zooming in: centre first, then dive. Zooming out: pull back first, then recentre.
  const zoomingIn = target.zoom > engine.pose.zoom;
  const positionRate = zoomingIn ? 8 : 4.2;
  const zoomRate = zoomingIn ? 4.2 : 6.5;
  engine.pose.x = approach(engine.pose.x, target.x, positionRate, dt);
  engine.pose.y = approach(engine.pose.y, target.y, positionRate, dt);
  engine.pose.zoom = Math.exp(approach(Math.log(engine.pose.zoom), Math.log(target.zoom), zoomRate, dt));

  const tiltScale = panelOpen ? 0.3 : 1;
  const idleX = Math.sin(engine.time * 0.31) * 0.018;
  const idleY = Math.cos(engine.time * 0.23) * 0.024;
  const targetRx = (engine.pointerActive ? -engine.pointerY * 0.085 : 0) + idleX;
  const targetRy = (engine.pointerActive ? engine.pointerX * 0.11 : 0) + idleY;
  engine.rx = approach(engine.rx, targetRx * tiltScale, 5, dt);
  engine.ry = approach(engine.ry, targetRy * tiltScale, 5, dt);
}

function stepRunners(engine: HiveEngine, dt: number): void {
  const { neighbours } = engine.layout.graph;
  engine.runners.forEach((runner) => {
    runner.t += runner.speed * dt;
    while (runner.t >= 1) {
      runner.t -= 1;
      runner.trail.push(runner.from);
      if (runner.trail.length > RUNNER_TRAIL) runner.trail.shift();
      const previous = runner.from;
      const options = neighbours[runner.to].filter((vertex) => vertex !== previous);
      runner.from = runner.to;
      runner.to = options[Math.floor(Math.random() * options.length)] ?? previous;
    }
  });
}

function stepLifts(engine: HiveEngine, dt: number): void {
  const hoverId = engine.pointerActive ? engine.hover?.id : undefined;
  if (hoverId !== undefined && !engine.lifts.has(hoverId)) engine.lifts.set(hoverId, 0);
  engine.lifts.forEach((value, id) => {
    const next = approach(value, id === hoverId ? 1 : 0, id === hoverId ? 12 : 6, dt);
    if (next < 0.004 && id !== hoverId) engine.lifts.delete(id);
    else engine.lifts.set(id, next);
  });
}

export function stepEngine(engine: HiveEngine, dt: number, focus: Focus, booted: boolean): void {
  engine.time += dt;
  engine.boot = Math.min(1, engine.boot + dt / (booted ? 0.6 : 2.4));

  stepCamera(engine, focus, dt);
  engine.project = createProjector(engine.pose, engine.rx, engine.ry, engine.vw, engine.vh);

  (Object.keys(engine.open) as SectionId[]).forEach((section) => {
    engine.open[section] = approach(engine.open[section], focus.section === section ? 1 : 0, 5, dt);
  });
  engine.panelBlend = approach(engine.panelBlend, hasPanel(focus) ? 1 : 0, 5, dt);

  engine.hover = engine.pointerActive ? hitTest(engine, focus, engine.pointerSX, engine.pointerSY) : null;
  stepLifts(engine, dt);
  stepRunners(engine, dt);

  engine.pings.forEach((ping) => {
    ping.age += dt / PING_LIFETIME;
  });
  engine.pings = engine.pings.filter((ping) => ping.age < 1);

  hiveTelemetry.x = engine.pose.x;
  hiveTelemetry.y = engine.pose.y;
  hiveTelemetry.zoom = engine.pose.zoom;
}
