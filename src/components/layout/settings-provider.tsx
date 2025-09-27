
'use client';

import { useGlobalStore } from '@/hooks/use-data-hooks';

export const useSettings = () => {
  const settings = useGlobalStore(state => state.settings);
  return { settings };
};
