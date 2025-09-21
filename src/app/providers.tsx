
'use client';

import React from 'react';
import { ThemeProvider } from 'next-themes';
import { SettingsProvider } from '@/components/layout/settings-provider';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import ChatWidget from '@/components/chat/chat-widget';
import { Toaster } from '@/components/ui/toaster';
import type { AppSettings } from '@/lib/settings';
import { useSettings } from '@/components/layout/settings-provider';

// This new inner component can safely use the settings context
const AppLayout = ({ children }: { children: React.ReactNode }) => {
    const { settings } = useSettings();
    return (
        <div className="flex min-h-screen flex-col">
            <Header />
            <main className="flex-1">{children}</main>
            {settings.chatWidgetEnabled && <ChatWidget />}
            <Footer />
            <Toaster />
        </div>
    )
}

// This is the main provider component that sets up all the contexts
export function Providers({ 
    children, 
    initialSettings 
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
      <SettingsProvider initialSettings={initialSettings}>
        <AppLayout>{children}</AppLayout>
      </SettingsProvider>
    </ThemeProvider>
  );
}
