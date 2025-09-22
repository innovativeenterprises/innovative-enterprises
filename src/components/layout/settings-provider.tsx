
'use client';

import React, { createContext, useContext, ReactNode } from 'react';
import type { AppSettings } from '@/lib/settings';
import { useSettingsData } from '@/hooks/use-data-hooks';

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

export const SettingsProvider = ({ children }: { children: ReactNode }) => {
    // This now correctly uses the data hook which safely gets data from the global store.
    const { settings, isClient } = useSettingsData();

    if (!isClient || !settings) {
        // Render nothing or a loading skeleton on the server or before hydration
        return null; 
    }

    return (
        <SettingsContext.Provider value={{ settings }}>
            {children}
        </SettingsContext.Provider>
    );
};
