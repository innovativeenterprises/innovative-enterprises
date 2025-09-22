
'use client';

import React from 'react';
import { ThemeProvider } from 'next-themes';
import { SettingsProvider } from '@/components/layout/settings-provider';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import ChatWidget from '@/components/chat/chat-widget';
import { Toaster } from '@/components/ui/toaster';
import { StoreProvider } from '@/lib/global-store';
import type { AppState } from '@/lib/initial-state';

const AppLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="flex min-h-screen flex-col">
            <Header />
            <main className="flex-1">{children}</main>
            <ChatWidget />
            <Footer />
            <Toaster />
        </div>
    )
}

export function Providers({ 
    children, 
    initialAppState,
}: { 
    children: React.ReactNode,
    initialAppState: AppState,
}) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <StoreProvider initialState={initialAppState}>
        <SettingsProvider>
            <AppLayout>{children}</AppLayout>
        </SettingsProvider>
      </StoreProvider>
    </ThemeProvider>
  );
}
