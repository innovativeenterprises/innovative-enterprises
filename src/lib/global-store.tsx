
'use client';

import React, { createContext, useContext, ReactNode, useRef, useEffect } from 'react';
import { createStore, useStore as useZustandStore } from 'zustand';
import type { AppState } from './initial-state';
import { getInitialState } from './initial-state';

export type AppStore = AppState & {
  set: (updater: (state: AppState) => Partial<AppState>) => void;
};

export const createAppStore = (initState: Partial<AppState> = {}) => {
  const initialState = { ...getInitialState(), ...initState };
  return createStore<AppStore>((set) => ({
    ...initialState,
    set: (updater) => set(updater),
  }));
};

export type StoreType = ReturnType<typeof createAppStore>;

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

export function useGlobalStore<T>(selector: (state: AppState) => T): T {
  const store = useContext(StoreContext)
  if (!store) {
    throw new Error('useGlobalStore must be used within a StoreProvider')
  }
  return useZustandStore(store, selector)
}

export function useSetStore() {
    const store = useContext(StoreContext);
    if (!store) {
        throw new Error('useSetStore must be used within a StoreProvider');
    }
    return store.setState;
}

// Global instance for read-only access if needed outside React components.
export const store = createAppStore();
