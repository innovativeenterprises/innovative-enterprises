
'use client';

import { createContext, useContext, ReactNode, useRef, useEffect } from 'react';
import { getInitialState, type AppState } from './initial-state';

// Define the store's API
export type StoreType = {
  get: () => AppState;
  set: (updater: (currentState: AppState) => AppState) => void;
  subscribe: (listener: () => void) => () => void;
};

// Create the context
export const StoreContext = createContext<StoreType | undefined>(undefined);

// Create the provider component
export const StoreProvider = ({ children, initialState }: { children: ReactNode, initialState: AppState }) => {
    const storeRef = useRef<StoreType>();

    if (!storeRef.current) {
        let state: AppState = { ...initialState, isClient: false }; // Start with isClient as false
        const listeners = new Set<() => void>();
        
        storeRef.current = {
            get: () => state,
            set: (updater) => {
                state = updater(state);
                listeners.forEach((l) => l());
            },
            subscribe: (listener) => {
                listeners.add(listener);
                return () => listeners.delete(listener);
            },
        };
    }
    
    // On the client, after the first render, we update the isClient flag.
    useEffect(() => {
        storeRef.current?.set(s => ({...s, isClient: true}));
    }, []);

    return (
        <StoreContext.Provider value={storeRef.current}>
            {children}
        </StoreContext.Provider>
    );
};
