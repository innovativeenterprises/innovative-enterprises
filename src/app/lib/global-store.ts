
'use client';

import { createStore, useStore as useZustandStore } from 'zustand';
import React, { createContext, useContext, ReactNode, useRef } from 'react';
import type { AppState } from './initial-state';
import { getInitialState } from './initial-state';

export type AppStore = AppState;

export const createAppStore = (initState: Partial<AppState> = {}) => {
  return createStore<AppStore>()((set) => ({
    ...getInitialState(),
    ...initState,
    set: (fn) => set(fn),
  }));
};

export type StoreType = ReturnType<typeof createAppStore>;

export const StoreContext = createContext<StoreType | null>(null);

export function useStore<T>(selector: (state: AppStore) => T): T {
  const store = useContext(StoreContext);
  if (!store) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return useZustandStore(store, selector);
}
