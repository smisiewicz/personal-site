import { trackEvent } from '@/lib/firebase';
import { playSound } from '@/lib/sound';
import { getHiveState, setHiveState } from '@/stores/useHiveStore';
import type { Focus, SectionId } from '@/types';

import { focusDepth, focusToHash, parentFocus, sameFocus, stepFocus } from './nav';

export type HistoryMode = 'push' | 'replace' | 'none';

let lastTrackedSection: SectionId | 'home' | null = null;

/** Same event names the multi-page site logged, so existing analytics reports keep working. */
function trackSection(focus: Focus): void {
  const section = focus.section === null || focus.section === 'about' ? 'home' : focus.section;
  if (section === lastTrackedSection) return;
  // The overview is part of "home"; moving between overview and About is not a new page view.
  if (focus.section === null && lastTrackedSection !== null) return;
  lastTrackedSection = section;
  trackEvent(`page_loaded_${section}`);
}

function writeHistory(focus: Focus, mode: HistoryMode): void {
  if (mode === 'none') return;
  const url = `${window.location.pathname}${window.location.search}${focusToHash(focus)}`;
  if (mode === 'push') window.history.pushState(null, '', url);
  else window.history.replaceState(null, '', url);
}

/** Single entry point for moving the camera: updates state, URL, analytics and audio together. */
export function navigate(next: Focus, mode: HistoryMode = 'push', silent = false): void {
  const current = getHiveState().focus;
  if (sameFocus(current, next)) {
    trackSection(next);
    return;
  }

  if (!silent) {
    const depthChange = focusDepth(next) - focusDepth(current);
    playSound(depthChange > 0 ? 'select' : depthChange < 0 ? 'back' : 'step');
  }

  setHiveState({ focus: next });
  writeHistory(next, mode);
  trackSection(next);
}

export function navigateUp(): void {
  navigate(parentFocus(getHiveState().focus));
}

export function navigateStep(direction: 1 | -1): void {
  const current = getHiveState().focus;
  navigate(stepFocus(current, direction), 'replace');
}
