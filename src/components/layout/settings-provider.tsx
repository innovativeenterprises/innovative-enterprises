
'use client';

import React, { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import type { AppSettings } from '@/lib/settings';
import { initialSettings } from '@/lib/settings';

interface SettingsContextType {
  settings: AppSettings | null;
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
    const [settings, setSettings] = useState<AppSettings | null>(null);

    useEffect(() => {
        // In a real app, this might fetch settings. For now, we use initial.
        setSettings(initialSettings);
    }, []);

    return (
        <SettingsContext.Provider value={{ settings }}>
            {children}
        </SettingsContext.Provider>
    );
};
