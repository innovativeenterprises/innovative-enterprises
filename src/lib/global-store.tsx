'use client';

/**
 * @fileOverview A simple global state management store for the prototype.
 *
 * This avoids the need for a full state management library like Redux or Zustand
 * for this prototype application. It uses a simple listener pattern to update
 * components when the state changes.
 */
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import type { AppState } from './initial-state';

export type StoreType = {
  get: () => AppState;
  set: (updater: (state: AppState) => AppState) => void;
  subscribe: (listener: () => void) => () => void;
};

const StoreContext = createContext<StoreType | undefined>(undefined);

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider.');
  }
  return context;
};

export const StoreProvider = ({ children, initialAppState }: { children: ReactNode, initialAppState: AppState }) => {
    const [store] = useState(() => {
        let state = initialAppState;
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
    });

    return (
        <StoreContext.Provider value={store}>
            {children}
        </StoreContext.Provider>
    )
}

export const useGlobalStore = () => {
    const store = useStore();
    const [state, setState] = useState(store.get());
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
        const unsubscribe = store.subscribe(() => {
            setState(store.get());
        });
        return unsubscribe;
    }, [store]);

    return { state, store, isClient };
};
