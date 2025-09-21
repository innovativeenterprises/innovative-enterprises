'use client';

import React from 'react';
import { useSettings } from './settings-provider';
import Header from './header';
import Footer from './footer';
import ChatWidget from '../chat-widget';

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { settings } = useSettings();

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
      {settings?.chatWidgetEnabled && <ChatWidget />}
    </div>
  );
}
