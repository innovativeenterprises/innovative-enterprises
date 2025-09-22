
'use client';

import React, { createContext, useContext, ReactNode, useEffect } from 'react';
import type { AppSettings } from '@/lib/settings';
import { useStore } from '@/hooks/use-data-hooks';
import { Skeleton } from '../ui/skeleton';

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

export const SettingsProvider = ({ children, initialSettings }: { children: ReactNode, initialSettings: AppSettings }) => {
    const { state, setState, isClient } = useStore();

    useEffect(() => {
        if(isClient && !state.settings) {
            setState(s => ({...s, settings: initialSettings}));
        }
    }, [isClient, state.settings, setState, initialSettings]);


    if (!isClient || !state.settings) {
        return <div className="h-screen w-full flex items-center justify-center"><Skeleton className="h-full w-full" /></div>;
    }

    return (
        <SettingsContext.Provider value={{ settings: state.settings }}>
            {children}
        </SettingsContext.Provider>
    );
};
