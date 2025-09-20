

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

import { initialState as initialData, type AppState as FullAppState } from './initial-state';

export type AppState = FullAppState;
export type CartItem = FullAppState['cart'][0];

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

// We export a function to get the store, so it can be initialized with server data.
export const getStore = (initialData: Partial<AppState>) => createAppStore(initialData);

// A default store for use in client-only scenarios if needed
export const store = createAppStore(initialState);
