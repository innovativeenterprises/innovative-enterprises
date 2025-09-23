
'use client';

import { ThemeProvider } from 'next-themes';
import { Toaster } from '@/components/ui/toaster';
import { type ReactNode } from 'react';
import ChatWidget from '@/components/chat-widget';
import { SettingsProvider } from '@/components/layout/settings-provider';
import type { AppSettings } from '@/lib/settings';
import { StoreProvider } from '@/lib/global-store';
import type { AppState } from '@/lib/initial-state';


export function Providers({ children, initialState }: { children: ReactNode, initialState: AppState | null }) {
  
  if (!initialState) {
    // This case should ideally not happen if getInitialState is robust.
    return (
        <div className="flex h-screen w-full items-center justify-center">
            <p>Error loading application state. Please try again later.</p>
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
