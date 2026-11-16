'use client';

import { useEffect, useRef } from 'react';

import { hiveTelemetry } from '@/lib/hive/engine';
import { hasPanel } from '@/lib/hive/nav';
import { useHiveState } from '@/stores/useHiveStore';

function signed(value: number): string {
  const rounded = Math.round(value);
  return `${rounded < 0 ? '-' : '+'}${String(Math.abs(rounded)).padStart(4, '0')}`;
}

export function Copyright({ className = '' }: { className?: string }): React.JSX.Element {
  return (
    <p className={`font-mono text-[11px] tracking-[0.08em] text-hive-muted ${className}`}>
      © {new Date().getFullYear()} Sebastian Misiewicz
    </p>
  );
}

/** Desktop footer strip: input hint, live camera read-out, copyright. */
export default function HudStatusBar(): React.JSX.Element {
  const focus = useHiveState((state) => state.focus);
  const readoutRef = useRef<HTMLSpanElement>(null);

  // Written straight to the DOM a few times a second; routing camera telemetry through React state
  // would re-render the HUD on every frame.
  useEffect(() => {
    const timer = window.setInterval(() => {
      if (!readoutRef.current) return;
      const { x, y, zoom } = hiveTelemetry;
      readoutRef.current.textContent = `CAM X${signed(x)} Y${signed(y)} Z${zoom.toFixed(2)}`;
    }, 120);
    return (): void => window.clearInterval(timer);
  }, []);

  let hint = 'Scroll or select a cell to engage';
  if (hasPanel(focus)) hint = 'Esc to return · scroll past the end for the next cell';
  else if (focus.section !== null) hint = 'Select a node · Esc to return';

  return (
    <footer className="hud-bar-bottom fixed inset-x-0 bottom-0 z-30 flex h-14 items-end justify-between gap-6 px-7 pb-3 max-lg:hidden">
      <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-hive-muted">
        <span aria-hidden="true" className="hud-blink mr-2 text-hive-cyan">
          ▮
        </span>
        {hint}
      </p>
      <span ref={readoutRef} aria-hidden="true" className="font-mono text-[11px] tracking-[0.22em] text-hive-muted" />
      <Copyright />
    </footer>
  );
}
