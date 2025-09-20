'use client';

import { useRef, type ReactNode, createContext } from 'react';
import { createAppStore, type StoreType, type AppState } from '@/lib/global-store';

export const StoreContext = createContext<StoreType | null>(null);

export const StoreProvider = ({
  children,
  initialData
}: {
  children: ReactNode;
  initialData: Partial<AppState>
}) => {
  const storeRef = useRef<StoreType>();
  if (!storeRef.current) {
    // Use the initialData from the server to hydrate the store
    storeRef.current = createAppStore(initialData);
  }
  
  return (
    <StoreContext.Provider value={storeRef.current}>{children}</StoreContext.Provider>
  );
}
