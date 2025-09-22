
'use client';

import React, { createContext, useContext, useState, ReactNode, useEffect, useRef } from 'react';
import { initialState, type AppState } from './initial-state';

export type StoreType = {
  state: AppState;
  setState: React.Dispatch<React.SetStateAction<AppState>>;
  isClient: boolean;
};

const StoreContext = createContext<StoreType | undefined>(undefined);

export function useStore() {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider.');
  }
  return context;
};

export const StoreProvider = ({ children }: { children: ReactNode }) => {
    const [state, setState] = useState<AppState>({ ...initialState, isClient: false });
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
        setState(s => ({...s, isClient: true}));
    }, []);

    return (
        <StoreContext.Provider value={{ state, setState, isClient }}>
            {children}
        </StoreContext.Provider>
    );
};
