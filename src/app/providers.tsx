
'use client';

import React from 'react';
import { ThemeProvider } from 'next-themes';
import { SettingsProvider } from '@/components/layout/settings-provider';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import ChatWidget from '@/components/chat-widget';
import { Toaster } from '@/components/ui/toaster';
import { useSettings } from '@/components/layout/settings-provider';
import type { AppSettings } from '@/lib/settings';

// Inner component that can safely use the settings context
function MainLayout({ children }: { children: React.ReactNode }) {
  const { settings } = useSettings();

  if (!settings) {
    return (
      <div className="flex min-h-screen flex-col">
        <main className="flex-1">{children}</main>
        <Toaster />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">{children}</main>
      {settings.chatWidgetEnabled && <ChatWidget />}
      <Footer />
      <Toaster />
    </div>
  );
}


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
        <MainLayout>{children}</MainLayout>
      </SettingsProvider>
    </ThemeProvider>
  );
}
