
'use client';

import React, { createContext, useContext, ReactNode } from 'react';
import type { AppSettings } from '@/lib/settings';
import { useStore } from '@/lib/global-store.tsx';

interface SettingsContextType {
  settings: AppSettings | null;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const useSettings = () => {
  const settings = useStore(state => state.settings);
  return { settings };
};
