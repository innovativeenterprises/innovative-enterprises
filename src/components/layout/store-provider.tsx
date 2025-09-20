
'use client';

import { useRef, type ReactNode, createContext } from 'react';
import { createAppStore, type StoreType } from '@/lib/global-store';

export const StoreContext = createContext<StoreType | null>(null);

export const StoreProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const storeRef = useRef<StoreType>();
  if (!storeRef.current) {
    storeRef.current = createAppStore();
  }
  
  return (
    <StoreContext.Provider value={storeRef.current}>{children}</StoreContext.Provider>
  );
}
