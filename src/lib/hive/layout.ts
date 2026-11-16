import type { HubSectionId, SectionId } from '@/types';

import { hash2, HEX_UNIT, SQRT3, type HexOrientation, type Point } from './geometry';

/** Centre-to-centre spacing radius of the big (section-sized) grid. */
export const BIG_SPACING = 300;
/** Drawn radius is smaller than the spacing so light runners have a channel between cells. */
export const BIG_RADIUS = 290;

export type CellKind = 'section' | 'item' | 'core' | 'deco';

export interface HiveCell {
  id: string;
  kind: CellKind;
  x: number;
  y: number;
  radius: number;
  orientation: HexOrientation;
  section: SectionId | null;
  item: number | null;
  seed: number;
}

export interface EdgeGraph {
  vertices: ReadonlyArray<Point>;
  neighbours: ReadonlyArray<ReadonlyArray<number>>;
}

export interface HiveLayout {
  isPortrait: boolean;
  sections: Record<SectionId, HiveCell>;
  items: Record<HubSectionId, ReadonlyArray<HiveCell>>;
  cores: ReadonlyArray<HiveCell>;
  deco: ReadonlyArray<HiveCell>;
  bounds: { minX: number; maxX: number; minY: number; maxY: number };
  graph: EdgeGraph;
}

export interface ItemCounts {
  experience: number;
  projects: number;
}

type Axial = readonly [number, number];

const SECTION_ORDER: ReadonlyArray<SectionId> = ['about', 'experience', 'projects', 'contact'];

// Wide screens get a compact rhombus; tall screens get a vertical zig-zag so cells stay large.
const LANDSCAPE_AXIAL: ReadonlyArray<Axial> = [[0, 0], [1, 0], [-1, 1], [0, 1]];
const PORTRAIT_AXIAL: ReadonlyArray<Axial> = [[0, 0], [0, 1], [-1, 2], [-1, 3]];

const RING_STEPS: ReadonlyArray<Axial> = [[1, 0], [0, 1], [-1, 1], [-1, 0], [0, -1], [1, -1]];

function bigToPixel([q, r]: Axial): Point {
  return { x: SQRT3 * BIG_SPACING * (q + r / 2), y: 1.5 * BIG_SPACING * r };
}

/** Centre first, then rings clockwise from the top — a "flower" that tiles inside a parent hex. */
function flowerSlots(count: number): Axial[] {
  const slots: Axial[] = [[0, 0]];
  for (let ring = 1; slots.length < count; ring++) {
    let q = 0;
    let r = -ring;
    RING_STEPS.forEach(([dq, dr]) => {
      for (let i = 0; i < ring; i++) {
        slots.push([q, r]);
        q += dq;
        r += dr;
      }
    });
  }
  return slots.slice(0, count);
}

function ringsFor(count: number): number {
  let rings = 0;
  for (let capacity = 1; capacity < count; rings++) capacity += 6 * (rings + 1);
  return rings;
}

interface Flower {
  spacing: number;
  slots: Axial[];
}

function buildFlower(slotCount: number): Flower {
  const rings = Math.max(1, ringsFor(slotCount));
  // A flat-top flower of n rings is inscribed in a pointy parent of radius (1.73n + 1.16) * spacing.
  const spacing = BIG_RADIUS / (1.733 * rings + 1.25);
  return { spacing, slots: flowerSlots(slotCount) };
}

function flowerCell(parent: HiveCell, flower: Flower, slot: number): Pick<HiveCell, 'x' | 'y' | 'radius'> {
  const [q, r] = flower.slots[slot];
  return {
    x: parent.x + 1.5 * flower.spacing * q,
    y: parent.y + SQRT3 * flower.spacing * (r + q / 2),
    radius: flower.spacing * 0.92,
  };
}

function buildGraph(cells: ReadonlyArray<HiveCell>): EdgeGraph {
  const vertices: Point[] = [];
  const neighbours: number[][] = [];
  const indexByKey = new Map<string, number>();
  const seenEdges = new Set<string>();

  const vertexIndex = (x: number, y: number): number => {
    const key = `${Math.round(x)}:${Math.round(y)}`;
    const existing = indexByKey.get(key);
    if (existing !== undefined) return existing;
    indexByKey.set(key, vertices.length);
    vertices.push({ x, y });
    neighbours.push([]);
    return vertices.length - 1;
  };

  cells.forEach((cell) => {
    const corners = HEX_UNIT.pointy.map((unit) =>
      vertexIndex(cell.x + unit.x * BIG_SPACING, cell.y + unit.y * BIG_SPACING),
    );
    corners.forEach((a, i) => {
      const b = corners[(i + 1) % 6];
      const key = a < b ? `${a}|${b}` : `${b}|${a}`;
      if (seenEdges.has(key)) return;
      seenEdges.add(key);
      neighbours[a].push(b);
      neighbours[b].push(a);
    });
  });

  return { vertices, neighbours };
}

export function buildLayout(isPortrait: boolean, counts: ItemCounts): HiveLayout {
  const axial = isPortrait ? PORTRAIT_AXIAL : LANDSCAPE_AXIAL;
  const taken = new Set(axial.map(([q, r]) => `${q}:${r}`));

  const sectionCells = SECTION_ORDER.map((section, i): HiveCell => ({
    id: section,
    kind: 'section',
    ...bigToPixel(axial[i]),
    radius: BIG_RADIUS,
    orientation: 'pointy',
    section,
    item: null,
    seed: i,
  }));
  const sections = Object.fromEntries(sectionCells.map((c) => [c.section, c])) as Record<SectionId, HiveCell>;

  const halfWidth = (SQRT3 / 2) * BIG_SPACING;
  const xs = sectionCells.map((c) => c.x);
  const ys = sectionCells.map((c) => c.y);
  const bounds = {
    minX: Math.min(...xs) - halfWidth,
    maxX: Math.max(...xs) + halfWidth,
    minY: Math.min(...ys) - BIG_SPACING,
    maxY: Math.max(...ys) + BIG_SPACING,
  };

  const deco: HiveCell[] = [];
  for (let r = -6; r <= 10; r++) {
    for (let q = -10; q <= 10; q++) {
      if (taken.has(`${q}:${r}`)) continue;
      const { x, y } = bigToPixel([q, r]);
      const inRange =
        x > bounds.minX - 1700 && x < bounds.maxX + 1700 && y > bounds.minY - 1250 && y < bounds.maxY + 1250;
      if (!inRange) continue;
      deco.push({
        id: `deco:${q}:${r}`,
        kind: 'deco',
        x,
        y,
        radius: BIG_RADIUS,
        orientation: 'pointy',
        section: null,
        item: null,
        seed: hash2(q, r),
      });
    }
  }

  const itemCell = (section: HubSectionId, flower: Flower, slot: number, item: number): HiveCell => ({
    id: `${section}:${item}`,
    kind: 'item',
    ...flowerCell(sections[section], flower, slot),
    orientation: 'flat',
    section,
    item,
    seed: item,
  });

  // Experience: the current role sits at the centre, earlier roles wind clockwise around it.
  const experienceFlower = buildFlower(counts.experience);
  const experienceItems = Array.from({ length: counts.experience }, (_, i) =>
    itemCell('experience', experienceFlower, i, i),
  );

  // Projects: a title core at the centre, projects on the rings around it.
  const projectsFlower = buildFlower(counts.projects + 1);
  const projectItems = Array.from({ length: counts.projects }, (_, i) =>
    itemCell('projects', projectsFlower, i + 1, i),
  );
  const cores: HiveCell[] = [
    {
      id: 'projects:core',
      kind: 'core',
      ...flowerCell(sections.projects, projectsFlower, 0),
      orientation: 'flat',
      section: 'projects',
      item: null,
      seed: 0,
    },
  ];

  return {
    isPortrait,
    sections,
    items: { experience: experienceItems, projects: projectItems },
    cores,
    deco,
    bounds,
    graph: buildGraph([...sectionCells, ...deco]),
  };
}
