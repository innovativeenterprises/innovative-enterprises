
'use client';

import { useRef, type ReactNode } from 'react';
import { StoreContext, type StoreType } from '@/hooks/use-global-store-data';
import { store } from '@/lib/global-store';

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
