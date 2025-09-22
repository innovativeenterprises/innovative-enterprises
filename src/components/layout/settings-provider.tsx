'use client';

import React, { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import type { AppSettings } from '@/lib/settings';
import { initialSettings } from '@/lib/settings';

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

export const SettingsProvider = ({ children, initialSettings: serverSettings }: { children: ReactNode, initialSettings: AppSettings }) => {
    const [settings, setSettings] = useState(serverSettings || initialSettings);
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    if (!isClient) {
        // On the server and during the first client render, use the initial settings
        return (
             <SettingsContext.Provider value={{ settings: serverSettings }}>
                {children}
            </SettingsContext.Provider>
        )
    }

    return (
        <SettingsContext.Provider value={{ settings }}>
            {children}
        </SettingsContext.Provider>
    );
};
