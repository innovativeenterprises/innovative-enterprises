
'use client';

import { ThemeProvider } from 'next-themes';
import { Toaster } from '@/components/ui/toaster';
import { type ReactNode } from 'react';
import ChatWidget from '@/components/chat-widget';
import { StoreProvider } from '@/lib/global-store.tsx';
import type { AppState } from '@/lib/initial-state';
import { SettingsProvider } from '@/components/layout/settings-provider';

export function Providers({ children, initialState }: { children: ReactNode, initialState: AppState }) {
  if (!initialState) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <p>Loading application state...</p>
      </div>
    );
  }

  return (
    <StoreProvider initialState={initialState}>
      <SettingsProvider initialSettings={initialState.settings}>
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
      </SettingsProvider>
    </StoreProvider>
  );
}
