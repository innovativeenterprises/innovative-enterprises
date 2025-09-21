
'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import type { AppSettings } from '@/lib/settings';

interface SettingsContextType {
  settings: AppSettings;
  setSettings: React.Dispatch<React.SetStateAction<AppSettings>>;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};

export const SettingsProvider = ({ 
    children, 
    initialSettings 
}: { 
    children: ReactNode;
    initialSettings: AppSettings;
}) => {
    const [settings, setSettings] = useState<AppSettings>(initialSettings);

    return (
        <SettingsContext.Provider value={{ settings, setSettings }}>
            {children}
        </SettingsContext.Provider>
    );
};
