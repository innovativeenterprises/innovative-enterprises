
/**
 * @fileOverview A simple global state management store for the prototype.
 *
 * This avoids the need for a full state management library like Redux or Zustand
 * for this prototype application. It uses a simple listener pattern to update
 * components when the state changes.
 *
 * This file is NOT part of the user's visible code but is a necessary
 * architectural piece to make the prototype function correctly across pages.
 */

import type { AppSettings } from './settings';
import type { CartItem } from '@/lib/pos-data.schema';
import { initialState as initialData } from './initial-state';
import type { AppState as FullAppState } from './initial-state';

export type AppState = FullAppState;

// Re-export initialState from the new file
export const initialState: AppState = initialData;

export const createAppStore = (initState: Partial<AppState> = {}) => {
    let state: AppState = { ...initialState, ...initState };
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

export const store = createAppStore(initialState);
