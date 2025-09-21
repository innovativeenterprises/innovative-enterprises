
'use client';

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { ThemeProvider } from 'next-themes';
import { SettingsProvider, useSettings } from '@/components/layout/settings-provider';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import ChatWidget from '@/components/chat/chat-widget';
import { Toaster } from '@/components/ui/toaster';
import { StoreProvider } from '@/lib/global-store.tsx';
import type { AppState } from '@/lib/initial-state';
import type { AppSettings } from '@/lib/settings';

const AppLayout = ({ children }: { children: React.ReactNode }) => {
    const { settings } = useSettings();
    return (
        <div className="flex min-h-screen flex-col">
            <Header />
            <main className="flex-1">{children}</main>
            {settings?.chatWidgetEnabled && <ChatWidget />}
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
    <StoreProvider initialAppState={initialAppState}>
        <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
        >
        <SettingsProvider initialSettings={initialAppState.settings}>
            <AppLayout>{children}</AppLayout>
        </SettingsProvider>
        </ThemeProvider>
    </StoreProvider>
  );
}
