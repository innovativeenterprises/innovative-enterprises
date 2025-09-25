
'use client';

import React, { createContext, useContext, ReactNode, useRef } from 'react';
import { useStore as useZustandStore } from 'zustand';
import { type StoreType } from './lib/global-store';
import type { AppState } from './lib/initial-state';

export const StoreContext = createContext<StoreType | null>(null);

export function StoreProvider({ children, store }: { children: ReactNode; store: StoreType }) {
    return (
        <StoreContext.Provider value={store}>
            {children}
        </StoreContext.Provider>
    );
};

export function useStore<T>(selector: (state: AppState) => T): T {
  const store = useContext(StoreContext)
  if (!store) {
    throw new Error('useStore must be used within a StoreProvider')
  }
  return useZustandStore(store, selector)
}

// Add a hook for setting state to avoid direct store manipulation in components
export function useSetStore() {
    const store = useContext(StoreContext);
    if (!store) {
        throw new Error('useSetStore must be used within a StoreProvider');
    }
    return store.setState;
}
