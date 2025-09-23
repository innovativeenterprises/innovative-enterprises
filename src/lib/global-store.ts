
'use client';

/**
 * @fileOverview A simple global state management store for the prototype.
 *
 * This avoids the need for a full state management library like Redux or Zustand
 * for this prototype application. It uses a simple listener pattern to update
 * components when the state changes.
 */
import type { AppState } from './initial-state';

// This is a placeholder for the actual store. The real store is created in StoreProvider.
export const store = {
    get: () => ({} as AppState),
    set: (updater: (currentState: AppState) => AppState) => {},
    subscribe: (listener: () => void) => () => {},
};
