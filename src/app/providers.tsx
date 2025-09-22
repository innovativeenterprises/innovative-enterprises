
'use client';

import React from 'react';
import { ThemeProvider } from 'next-themes';
import { SettingsProvider } from '@/components/layout/settings-provider';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import ChatWidget from '@/components/chat-widget';
import { Toaster } from '@/components/ui/toaster';
import { StoreProvider } from '@/lib/global-store';
import type { AppSettings } from '@/lib/settings';

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
    initialSettings,
}: { 
    children: React.ReactNode,
    initialSettings: AppSettings,
}) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <StoreProvider initialState={{ settings: initialSettings }}>
        <SettingsProvider>
            <AppLayout>{children}</AppLayout>
        </SettingsProvider>
      </StoreProvider>
    </ThemeProvider>
  );
}
