import { useSyncExternalStore } from 'react';

type TunerState = {
  /** 当前在架频道锚点 id */
  active: string;
  /** 每次换台自增，驱动 120ms 雪花闪断 */
  flash: number;
};

let state: TunerState = { active: 'ch00', flash: 0 };
const listeners = new Set<() => void>();

function emit() {
  for (const l of listeners) l();
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function setActiveChannel(id: string) {
  if (state.active === id) return;
  state = { ...state, active: id };
  emit();
}

export function fireChannelFlash() {
  state = { ...state, flash: state.flash + 1 };
  emit();
}

export function useTuner() {
  return useSyncExternalStore(
    subscribe,
    () => state,
    () => state,
  );
}
