
'use client';

/**
 * @fileOverview A simple global state management store for the prototype.
 *
 * This avoids the need for a full state management library like Redux or Zustand
 * for this prototype application. It uses a simple listener pattern to update
 * components when the state changes.
 */
import { getInitialState, type AppState } from './initial-state';

export const createAppStore = (initState: Partial<AppState> = {}) => {
    const initialState = getInitialState();
    let state: AppState = { ...initialState, ...initState, isClient: false };
    const listeners = new Set<() => void>();

    return {
        get: (): AppState => state,
        set: (updater: (currentState: AppState) => AppState) => {
            state = updater(state);
            listeners.forEach((listener) => listener());
        },
        subscribe: (listener: () => void) => {
            listeners.add(listener);
            return () => listeners.delete(listener);
        },
    };
}

export type StoreType = ReturnType<typeof createAppStore>;

export let store: StoreType;

// This function allows re-initializing the store, useful for tests or HMR
export function initializeStore(initialState?: Partial<AppState>) {
  store = createAppStore(initialState);
  return store;
}

// Initialize the store by default
initializeStore();
