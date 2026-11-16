'use client';

import { useSyncExternalStore } from 'react';

import { ROOT_FOCUS } from '@/lib/hive/nav';
import type { Focus } from '@/types';

export interface HiveState {
  focus: Focus;
  /** False until the opening ignition is far enough along for the HUD and panels to appear. */
  booted: boolean;
  soundOn: boolean;
  /** A video or gallery modal is open, so hive navigation input must be ignored. */
  modalOpen: boolean;
}

type Listener = () => void;

let state: HiveState = { focus: ROOT_FOCUS, booted: false, soundOn: false, modalOpen: false };
const listeners = new Set<Listener>();

/** Synchronous read for code outside React: the canvas render loop and global input handlers. */
export function getHiveState(): HiveState {
  return state;
}

export function setHiveState(patch: Partial<HiveState>): void {
  state = { ...state, ...patch };
  listeners.forEach((listener) => listener());
}

function subscribe(listener: Listener): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function useHiveState<TSelected>(selector: (state: HiveState) => TSelected): TSelected {
  return useSyncExternalStore(
    subscribe,
    () => selector(state),
    () => selector(state),
  );
}
