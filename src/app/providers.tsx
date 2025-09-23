
'use client';

import { ThemeProvider } from 'next-themes';
import { Toaster } from '@/components/ui/toaster';
import { type ReactNode } from 'react';
import ChatWidget from '@/components/chat-widget';
import { StoreProvider } from '@/lib/global-store';
import type { AppState } from './lib/initial-state';
import { SettingsProvider } from '@/components/layout/settings-provider';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';


export function Providers({ children, initialState }: { children: ReactNode, initialState: AppState | null }) {
  if (!initialState) {
    // This case should ideally not be hit if getInitialState is correct.
    // This is a fallback to prevent a hard crash.
    return (
      <html lang="en" suppressHydrationWarning>
        <head/>
        <body className='min-h-screen bg-background font-sans antialiased'>
          <div className="flex h-screen w-full items-center justify-center">
            <p>Loading application state...</p>
          </div>
        </body>
      </html>
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
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
          <Toaster />
          <ChatWidget />
        </ThemeProvider>
      </SettingsProvider>
    </StoreProvider>
  );
}
