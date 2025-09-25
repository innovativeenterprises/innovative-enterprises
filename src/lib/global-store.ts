
'use client';

import React, { createContext, useContext } from 'react';
import { createStore, useStore as useZustandStore } from 'zustand';
import { type AppState, getInitialState } from './initial-state';

/**
 * @fileOverview A global state management store for the prototype using Zustand.
 *
 * This avoids the need for prop drilling and provides a simple, modern
 * state management solution.
 */

export type AppStore = AppState;

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

export const AppContext = createContext<StoreType | null>(null);

// This is the hook that components will use to access the store.
export function useStore<T>(selector: (state: AppStore) => T): T {
  const store = React.useContext(AppContext);
  if (!store) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return useZustandStore(store, selector);
}

// Global instance that can be imported by server components or utilities if needed.
// Note: This instance is for read-only purposes on the server.
export const store = createAppStore();
