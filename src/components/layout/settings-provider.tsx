
'use client';

import { useGlobalStore } from '@/lib/global-store.tsx';

export const useSettings = () => {
  const settings = useGlobalStore(state => state.settings);
  return { settings };
};
