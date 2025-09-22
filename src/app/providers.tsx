'use client';

import React from 'react';
import { ThemeProvider } from 'next-themes';
import { SettingsProvider } from '@/components/layout/settings-provider';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import ChatWidget from '@/components/chat-widget';
import { Toaster } from '@/components/ui/toaster';
import { StoreProvider } from '@/lib/global-store';
import type { AppState } from '@/lib/global-store';

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
    initialState,
}: { 
    children: React.ReactNode,
    initialState: AppState,
}) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <StoreProvider initialState={initialState}>
        <SettingsProvider>
            <AppLayout>{children}</AppLayout>
        </SettingsProvider>
      </StoreProvider>
    </ThemeProvider>
  );
}