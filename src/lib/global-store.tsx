
'use client';

import React, { createContext, useContext, ReactNode, useRef, useEffect } from 'react';
import { createStore, useStore as useZustandStore } from 'zustand';
import type { AppState } from './initial-state';
import { getInitialState, getFirestoreData } from './initial-state';

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

export function StoreProvider({ children }: { children: ReactNode; }) {
    const storeRef = useRef<StoreType>();

    if (!storeRef.current) {
        storeRef.current = createAppStore();
    }

    useEffect(() => {
        const store = storeRef.current!;
        const currentState = store.getState();
        
        if (!currentState.isClient) {
            getFirestoreData().then(data => {
                store.setState(state => ({
                    ...state,
                    ...data,
                    isClient: true,
                }));
            }).catch(error => {
                console.error("Failed to load initial data:", error);
                store.setState({ isClient: true }); // Still unblock UI
            });
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
    return store.getState().set;
}

// Global instance for read-only access if needed outside React components.
export const store = createAppStore();
