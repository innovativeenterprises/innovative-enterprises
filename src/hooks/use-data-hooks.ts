
'use client';

import { useState, useEffect, useContext } from 'react';
import { StoreContext } from '@/components/layout/global-store';
import type { AppState } from '@/lib/global-store';

type StoreUpdater<T> = (updater: (prev: T) => T) => void;

export const useSettingsData = () => {
  const store = useContext(StoreContext);
  if (!store) {
    throw new Error('useSettingsData must be used within a StoreProvider');
  }
  const [settings, setSettingsState] = useState(store.get().settings);
  const [isClient, setIsClient] = useState(store.get().isClient);

  useEffect(() => {
    const unsubscribe = store.subscribe(() => {
      const currentSettings = store.get().settings;
      const currentIsClient = store.get().isClient;
      setSettingsState(currentSettings);
      setIsClient(currentIsClient);
    });
    return unsubscribe;
  }, [store]);
  
  const setSettings: StoreUpdater<AppState['settings']> = (updater) => {
    store.set(s => ({ ...s, settings: updater(s.settings) }));
  };

  return { settings, setSettings, isClient };
};
