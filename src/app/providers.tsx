
'use client';

import React, { ReactNode } from 'react';
import { ThemeProvider } from 'next-themes';
import { SettingsProvider } from '@/components/layout/settings-provider';
import { StoreProvider, type AppState } from '@/lib/global-store'; // Using the new simple provider
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import ChatWidget from '@/components/chat-widget';
import { Toaster } from '@/components/ui/toaster';

// This is a simple wrapper component to correctly structure providers
const AppLayout = ({ children }: { children: ReactNode }) => {
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
    children: ReactNode,
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
                <AppLayout>
                    {children}
                </AppLayout>
            </SettingsProvider>
        </StoreProvider>
    </ThemeProvider>
  );
}
