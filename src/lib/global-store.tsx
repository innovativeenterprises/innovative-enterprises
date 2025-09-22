
'use client';

import React, { createContext, useContext, useState, ReactNode, useEffect, useRef } from 'react';
import type { AppState } from './initial-state';

export type StoreType = {
  state: AppState;
  setState: React.Dispatch<React.SetStateAction<AppState>>;
};

const StoreContext = createContext<StoreType | undefined>(undefined);

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider.');
  }
  return context;
};

export const StoreProvider = ({ children, initialState }: { children: ReactNode, initialState: AppState }) => {
    const [state, setState] = useState<AppState>({...initialState, isClient: false});

    useEffect(() => {
        setState(s => ({...s, isClient: true}));
    }, []);

    return (
        <StoreContext.Provider value={{ state, setState }}>
            {children}
        </StoreContext.Provider>
    );
};
