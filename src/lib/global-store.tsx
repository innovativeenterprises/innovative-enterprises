
'use client';

import React, { createContext, useContext, ReactNode, useRef, useEffect } from 'react';
import { useStore as useZustandStore } from 'zustand';
import { type StoreType, createAppStore } from './global-store';
import type { AppState } from './initial-state';
import { getEmptyState } from './initial-state';

export const StoreContext = createContext<StoreType | null>(null);

export function StoreProvider({ children, initialState }: { children: ReactNode; initialState: Partial<AppState> }) {
    const storeRef = useRef<StoreType>();

    if (!storeRef.current) {
        storeRef.current = createAppStore(initialState);
    }
    
     useEffect(() => {
        if (storeRef.current) {
            storeRef.current.setState({ isClient: true });
        }
    }, []);

    return (
        <StoreContext.Provider value={storeRef.current}>
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
