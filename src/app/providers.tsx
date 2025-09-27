
'use client';

import { ThemeProvider } from 'next-themes';
import { Toaster } from '@/components/ui/toaster';
import { type ReactNode, useRef } from 'react';
import ChatWidget from '@/components/chat/chat-widget';
import MainLayout from './main-layout';
import { createAppStore, StoreContext, type StoreType } from '@/lib/global-store';
import type { AppState } from '@/lib/initial-state';

export function Providers({
  children,
  initialState,
}: {
  children: ReactNode;
  initialState: AppState;
}) {
  const storeRef = useRef<StoreType>();
  
  if (!storeRef.current) {
    storeRef.current = createAppStore(initialState);
  }

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
