
'use client';

import { useState, useEffect } from 'react';
import type { AppState } from '@/lib/initial-state';

// A generic hook factory
const createDataHook = <K extends keyof AppState>(initialData: AppState[K]) => {
  return (initData?: AppState[K]) => {
    const [data, setData] = useState(initData ?? initialData);
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
      setIsClient(true);
      // If server-provided data is different, update state
      if (initData && JSON.stringify(initData) !== JSON.stringify(data)) {
        setData(initData);
      }
    }, [initData, data]);

    return { data, setData, isClient };
  };
};

export const useSettingsData = (initialData: AppState['settings'] | null = null) => {
    const [settings, setSettings] = useState(initialData);
    const [isClient, setIsClient] = useState(false);
    useEffect(() => { setIsClient(true); if(initialData) setSettings(initialData) }, [initialData]);
    return { settings, setSettings, isClient };
};
