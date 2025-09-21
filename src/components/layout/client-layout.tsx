
'use client';

import { Toaster } from '@/components/ui/toaster';
import ChatWidget from '@/components/chat-widget';
import Footer from './footer';
import Header from './header';
import React from 'react';
import { useSettings } from './settings-provider';

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { settings } = useSettings();

  if (!settings) {
    // This can happen briefly on initial load or if the provider is missing.
    // Render a minimal layout or a loader.
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <Toaster />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <Toaster />
        {settings.chatWidgetEnabled && <ChatWidget />}
    </div>
  );
}
