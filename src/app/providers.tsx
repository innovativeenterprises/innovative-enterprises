
'use client';

import { ThemeProvider } from 'next-themes';
import { Toaster } from '@/components/ui/toaster';
import { type ReactNode } from 'react';
import ChatWidget from '@/components/chat-widget';
import { StoreProvider } from '@/lib/global-store.tsx';
import type { AppState } from './lib/initial-state';

export function Providers({
  children,
  initialState,
}: {
  children: ReactNode;
  initialState: Partial<AppState>;
}) {
  return (
    <StoreProvider initialState={initialState}>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        {children}
        <Toaster />
        <ChatWidget />
      </ThemeProvider>
    </StoreProvider>
  );
}
