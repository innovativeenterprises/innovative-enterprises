
'use client';

import React from 'react';
import Header from './header';
import Footer from './footer';
import ChatWidget from '../chat-widget';
import { useSettings } from './settings-provider';
import { Toaster } from '@/components/ui/toaster';

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { settings } = useSettings();

  if (!settings) {
    // This can show a loader or a fallback while settings are hydrating on the client
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
