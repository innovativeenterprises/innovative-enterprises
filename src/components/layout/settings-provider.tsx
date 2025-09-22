
'use client';

import React, { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import type { AppSettings } from '@/lib/settings';

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

export const SettingsProvider = ({ children, initialSettings }: { children: ReactNode, initialSettings: AppSettings | null }) => {
    return (
        <SettingsContext.Provider value={{ settings: initialSettings }}>
            {children}
        </SettingsContext.Provider>
    );
};
