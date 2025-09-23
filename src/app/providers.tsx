
'use client';

import { ThemeProvider } from 'next-themes';
import { Toaster } from '@/components/ui/toaster';
import { type ReactNode } from 'react';
import ChatWidget from '@/components/chat-widget';
import { StoreProvider } from '@/lib/global-store.tsx';
import type { AppState } from '@/lib/initial-state';
import { SettingsProvider } from '@/components/layout/settings-provider';

export function Providers({ children, initialState }: { children: ReactNode, initialState: AppState | null }) {
  // If initialState is null, it means there was an error fetching data on the server.
  // We can render a fallback UI here. In a real app, you might want to show a more user-friendly error page.
  if (!initialState) {
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
