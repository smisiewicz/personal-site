'use client';

import { useEffect, useRef } from 'react';

import { experiences } from '@/data/experiences';
import { projects } from '@/data/projects';
import {
  addPing,
  createEngine,
  hitTest,
  isInteractive,
  setLayout,
  snapCamera,
  stepEngine,
  type HiveEngine,
} from '@/lib/hive/engine';
import { buildLayout } from '@/lib/hive/layout';
import { hasPanel } from '@/lib/hive/nav';
import { navigate, navigateStep, navigateUp } from '@/lib/hive/navigate';
import { drawScene } from '@/lib/hive/render/drawScene';
import { PORTRAIT_SRC } from '@/lib/hive/render/drawSection';
import { playSound } from '@/lib/sound';
import { getHiveState } from '@/stores/useHiveStore';

const ITEM_COUNTS = { experience: experiences.length, projects: projects.length };
const TAP_SLOP = 10;
const SWIPE_DISTANCE = 56;

function loadImages(engine: HiveEngine): void {
  [PORTRAIT_SRC, ...projects.map((project) => project.thumbnail)].forEach((src) => {
    const image = new Image();
    image.src = src;
    engine.images.set(src, image);
  });
}

function loadFonts(engine: HiveEngine): void {
  const styles = getComputedStyle(document.documentElement);
  const family = (name: string, fallback: string): string =>
    `${styles.getPropertyValue(name).trim() || fallback}, ${fallback}`;
  engine.fonts = {
    display: family('--font-orbitron', 'sans-serif'),
    mono: family('--font-share-tech-mono', 'monospace'),
    body: family('--font-exo', 'sans-serif'),
  };
  // Canvas text does not trigger font loading by itself; request the faces the renderer uses.
  const faces = [`700 20px ${engine.fonts.display}`, `600 20px ${engine.fonts.display}`, `20px ${engine.fonts.mono}`];
  faces.forEach((face) => {
    document.fonts.load(face).catch(() => undefined);
  });
}

/** Full-screen canvas that renders the hive and turns pointer input into navigation. */
export default function HiveCanvas(): React.JSX.Element {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return undefined;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const coarsePointer = window.matchMedia('(pointer: coarse)').matches;
    const isPortrait = (): boolean => window.innerWidth / window.innerHeight < 0.8;
    const engine = createEngine(buildLayout(isPortrait(), ITEM_COUNTS), reducedMotion, coarsePointer ? 5 : 11);
    loadImages(engine);
    loadFonts(engine);

    const resize = (): void => {
      engine.vw = window.innerWidth;
      engine.vh = window.innerHeight;
      engine.dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(engine.vw * engine.dpr);
      canvas.height = Math.round(engine.vh * engine.dpr);
      if (isPortrait() !== engine.layout.isPortrait) {
        setLayout(engine, buildLayout(isPortrait(), ITEM_COUNTS));
        snapCamera(engine, getHiveState().focus);
      }
    };
    resize();
    snapCamera(engine, getHiveState().focus);
    // Start slightly pulled back so the first frames ease into place.
    engine.pose.zoom *= 0.82;

    let frame = 0;
    let last = performance.now();
    let lastHoverId: string | null = null;
    const loop = (now: number): void => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      const { focus, booted } = getHiveState();
      stepEngine(engine, dt, focus, booted);
      drawScene(ctx, engine);

      const interactive = isInteractive(engine.hover, focus);
      canvas.style.cursor = interactive ? 'pointer' : 'default';
      const hoverId = interactive ? (engine.hover?.id ?? null) : null;
      if (hoverId !== null && hoverId !== lastHoverId) playSound('hover');
      lastHoverId = hoverId;

      frame = requestAnimationFrame(loop);
    };
    frame = requestAnimationFrame(loop);

    const setPointer = (event: PointerEvent): void => {
      engine.pointerSX = event.clientX;
      engine.pointerSY = event.clientY;
      engine.pointerX = (event.clientX / engine.vw) * 2 - 1;
      engine.pointerY = (event.clientY / engine.vh) * 2 - 1;
    };

    // Listened for on window so we can tell when the mouse moves off the canvas onto HUD elements.
    const handleMove = (event: PointerEvent): void => {
      if (event.pointerType !== 'mouse') return;
      setPointer(event);
      engine.pointerActive = event.target === canvas;
    };
    const handleLeave = (): void => {
      engine.pointerActive = false;
    };

    const activate = (event: PointerEvent): void => {
      const { focus } = getHiveState();
      if (hasPanel(focus)) return;
      const cell = hitTest(engine, focus, event.clientX, event.clientY);
      if (cell && isInteractive(cell, focus)) {
        addPing(engine, cell);
        navigate({ section: cell.section, item: cell.item });
      } else if (focus.section !== null && cell?.section !== focus.section) {
        // Clicking empty space around the current section backs out one level.
        navigateUp();
      }
    };

    let downX = 0;
    let downY = 0;
    const handleDown = (event: PointerEvent): void => {
      downX = event.clientX;
      downY = event.clientY;
    };
    const handleUp = (event: PointerEvent): void => {
      const dx = event.clientX - downX;
      const dy = event.clientY - downY;
      if (Math.hypot(dx, dy) <= TAP_SLOP) {
        activate(event);
      } else if (event.pointerType !== 'mouse' && Math.abs(dy) > SWIPE_DISTANCE && Math.abs(dy) > Math.abs(dx) * 1.5) {
        navigateStep(dy < 0 ? 1 : -1);
      }
    };

    window.addEventListener('resize', resize);
    window.addEventListener('pointermove', handleMove);
    document.documentElement.addEventListener('pointerleave', handleLeave);
    canvas.addEventListener('pointerdown', handleDown);
    canvas.addEventListener('pointerup', handleUp);

    return (): void => {
      cancelAnimationFrame(frame);
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', handleMove);
      document.documentElement.removeEventListener('pointerleave', handleLeave);
      canvas.removeEventListener('pointerdown', handleDown);
      canvas.removeEventListener('pointerup', handleUp);
    };
  }, []);

  return <canvas ref={canvasRef} aria-hidden="true" className="fixed inset-0 z-0 h-full w-full touch-none" />;
}
