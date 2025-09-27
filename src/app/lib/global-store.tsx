
'use client';

import React, { createContext, useContext, ReactNode, useRef } from 'react';
import { createStore, useStore as useZustandStore } from 'zustand';
import type { AppState } from './initial-state';
import { getInitialState } from './initial-state';

export type AppStore = AppState & {
  set: (updater: (state: AppState) => Partial<AppState>) => void;
};

export type StoreType = ReturnType<typeof createAppStore>;

export const createAppStore = (initState: Partial<AppState> = {}) => {
  const initialState = { ...getInitialState(), ...initState };
  return createStore<AppStore>()((set) => ({
    ...initialState,
    set: (updater) => set(updater),
  }));
};

export const StoreContext = createContext<StoreType | null>(null);

export function StoreProvider({ children, store }: { children: ReactNode; store: StoreType }) {
    return (
        <StoreContext.Provider value={store}>
            {children}
        </StoreContext.Provider>
    );
};

export function useGlobalStore<T>(selector: (state: AppState) => T): T {
  const store = useContext(StoreContext)
  if (!store) {
    throw new Error('useGlobalStore must be used within a StoreProvider')
  }
  return useZustandStore(store, selector)
}

// Add a hook for setting state to avoid direct store manipulation in components
export function useSetStore() {
    const store = useContext(StoreContext);
    if (!store) {
        throw new Error('useSetStore must be used within a StoreProvider');
    }
    return store.getState().set;
}

// Global instance for read-only access if needed outside React components.
export const store = createAppStore();
