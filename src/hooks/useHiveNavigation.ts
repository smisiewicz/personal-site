'use client';

import { useEffect } from 'react';

import { initFirebase } from '@/lib/firebase';
import { hashToFocus, legacyPathToFocus, ROOT_FOCUS } from '@/lib/hive/nav';
import { navigate, navigateStep, navigateUp } from '@/lib/hive/navigate';
import { getHiveState } from '@/stores/useHiveStore';

const HIVE_WHEEL_THRESHOLD = 50;
/** Scrolling past the end of a panel must be clearly deliberate before it moves to the next cell. */
const PANEL_OVERSCROLL_THRESHOLD = 240;
const STEP_COOLDOWN_MS = 900;
const WHEEL_IDLE_RESET_MS = 220;

function isTyping(target: EventTarget | null): boolean {
  return target instanceof HTMLElement && target.closest('input, textarea, select, [contenteditable]') !== null;
}

function panelCanScroll(direction: 1 | -1): boolean {
  const scroller = document.querySelector<HTMLElement>('[data-panel-scroll]');
  if (!scroller) return false;
  if (direction > 0) return scroller.scrollTop + scroller.clientHeight < scroller.scrollHeight - 2;
  return scroller.scrollTop > 2;
}

/** Wires URL, keyboard and wheel input to hive navigation. Mount once at the app root. */
export function useHiveNavigation(): void {
  useEffect(() => {
    initFirebase();

    const legacy = legacyPathToFocus(window.location.pathname);
    if (legacy) window.history.replaceState(null, '', '/');
    navigate(legacy ?? hashToFocus(window.location.hash), 'replace', true);

    const handlePopState = (): void => {
      navigate(hashToFocus(window.location.hash), 'none');
    };

    const handleKey = (event: KeyboardEvent): void => {
      if (getHiveState().modalOpen || event.metaKey || event.ctrlKey || event.altKey) return;
      if (event.key === 'Escape') {
        navigateUp();
        return;
      }
      if (isTyping(event.target)) return;
      // Leave arrow keys to the panel while it still has content to scroll in that direction.
      if (event.key === 'ArrowDown' || event.key === 'PageDown') {
        if (!panelCanScroll(1)) navigateStep(1);
      } else if (event.key === 'ArrowUp' || event.key === 'PageUp') {
        if (!panelCanScroll(-1)) navigateStep(-1);
      } else if (event.key === 'ArrowRight') {
        navigateStep(1);
      } else if (event.key === 'ArrowLeft') {
        navigateStep(-1);
      } else if (event.key === 'Home') {
        navigate(ROOT_FOCUS);
      }
    };

    let accumulated = 0;
    let lastWheel = 0;
    let lockedUntil = 0;
    const handleWheel = (event: WheelEvent): void => {
      if (getHiveState().modalOpen || event.ctrlKey) return;
      const now = performance.now();
      const direction = event.deltaY > 0 ? 1 : -1;
      const inPanel = document.querySelector('[data-panel-scroll]') !== null;

      if (now - lastWheel > WHEEL_IDLE_RESET_MS) accumulated = 0;
      lastWheel = now;
      if (now < lockedUntil || isTyping(event.target) || panelCanScroll(direction)) {
        accumulated = 0;
        return;
      }

      accumulated += event.deltaY;
      const threshold = inPanel ? PANEL_OVERSCROLL_THRESHOLD : HIVE_WHEEL_THRESHOLD;
      if (Math.abs(accumulated) >= threshold) {
        accumulated = 0;
        lockedUntil = now + STEP_COOLDOWN_MS;
        navigateStep(direction);
      }
    };

    window.addEventListener('popstate', handlePopState);
    window.addEventListener('keydown', handleKey);
    window.addEventListener('wheel', handleWheel, { passive: true });
    return (): void => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('keydown', handleKey);
      window.removeEventListener('wheel', handleWheel);
    };
  }, []);
}
