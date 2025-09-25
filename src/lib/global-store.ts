
'use client';

import { createStore } from 'zustand';
import { type AppState, getInitialState } from './initial-state';

/**
 * @fileOverview A global state management store for the prototype using Zustand.
 *
 * This avoids the need for prop drilling and provides a simple, modern
 * state management solution.
 */

export type AppStore = AppState & {
  set: (updater: (state: AppState) => AppState) => void;
};

export type StoreType = ReturnType<typeof createAppStore>;

export const createAppStore = (initState: Partial<AppState> = {}) => {
  const initialState = { ...getInitialState(), ...initState };
  return createStore<AppStore>((set) => ({
    ...initialState,
    // The 'set' function is provided by Zustand and allows components to update the state.
    // We are exposing it here to be used in custom hooks.
    set: (updater) => set(updater),
  }));
};

// Global instance that can be imported by server components or utilities if needed.
// Note: This instance is for read-only purposes on the server.
export const store = createAppStore();
