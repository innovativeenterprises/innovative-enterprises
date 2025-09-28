

'use client';

import { ThemeProvider } from 'next-themes';
import { Toaster } from '@/components/ui/toaster';
import { type ReactNode, useRef, useEffect } from 'react';
import ChatWidget from '@/components/chat-widget';
import MainLayout from './main-layout';
import { createAppStore, StoreContext, type StoreType } from '@/lib/global-store';
import type { AppState } from '@/lib/initial-state';


export function Providers({
  children,
  initialState,
}: {
  children: ReactNode;
  initialState: Partial<AppState>;
}) {
  const storeRef = useRef<StoreType>();
  if (!storeRef.current) {
    storeRef.current = createAppStore(initialState);
  }

  // Set the isClient flag to true once the component mounts on the client
  useEffect(() => {
    storeRef.current?.getState().set(state => ({ ...state, isClient: true }));
  }, []);

  return (
    <StoreContext.Provider value={storeRef.current}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <MainLayout>{children}</MainLayout>
          <Toaster />
          <ChatWidget />
        </ThemeProvider>
    </StoreContext.Provider>
  );
}
