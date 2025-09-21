
'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import type { AppSettings } from '@/lib/settings';

interface SettingsContextType {
  settings: AppSettings;
  setSettings: React.Dispatch<React.SetStateAction<AppSettings>>;
}

export const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};

// The Provider component itself is no longer needed here, 
// as the logic will be moved to ClientLayout to ensure correct initialization.
// We will just export the context.
