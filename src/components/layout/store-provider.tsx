'use client';

import { useRef, type ReactNode, createContext } from 'react';
import { type StoreType } from '@/hooks/use-global-store-data';
import { store } from '@/lib/global-store';

export const StoreContext = createContext<StoreType>(store);

export const StoreProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const storeRef = useRef<StoreType>(store);
  
  return (
    <StoreContext.Provider value={storeRef.current}>{children}</StoreContext.Provider>
  );
}