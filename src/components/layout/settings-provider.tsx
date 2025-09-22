
'use client';

import React, { createContext, useContext, ReactNode } from 'react';
import type { AppSettings } from '@/lib/settings';

interface SettingsContextType {
  settings: AppSettings;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};

export const SettingsProvider = ({ children, settings }: { children: ReactNode, settings: AppSettings }) => {
    return (
        <SettingsContext.Provider value={{ settings }}>
            {children}
        </SettingsContext.Provider>
    );
};
