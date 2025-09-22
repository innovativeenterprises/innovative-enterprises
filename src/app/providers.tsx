
'use client';

import { ThemeProvider } from 'next-themes';
import { Toaster } from '@/components/ui/toaster';
import { type ReactNode } from 'react';
import ChatWidget from '@/components/chat-widget';
import { StoreProvider } from '@/lib/global-store';
import type { AppState } from '@/lib/global-store';
import { SettingsProvider } from '@/components/layout/settings-provider';


export function Providers({ children, initialState }: { children: ReactNode, initialState: AppState }) {
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
