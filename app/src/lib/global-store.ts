
'use client';

import { createStore, useStore as useZustandStore } from 'zustand';
import React, { createContext, useContext, ReactNode, useRef } from 'react';
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
