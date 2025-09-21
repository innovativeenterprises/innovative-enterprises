
'use client';

import { Toaster } from '@/components/ui/toaster';
import ChatWidget from '@/components/chat-widget';
import Footer from './footer';
import Header from './header';
import type { Solution, Industry, AiTool } from '@/lib/nav-links';
import React from 'react';
import { useSettings } from './settings-provider';

export default function ClientLayout({
  children,
  solutions,
  industries,
  aiTools,
}: {
  children: React.ReactNode;
  solutions: Solution[];
  industries: Industry[];
  aiTools: AiTool[];
}) {
  const { settings } = useSettings();

  return (
    <div className="flex min-h-screen flex-col">
        <Header 
          solutions={solutions}
          industries={industries}
          aiTools={aiTools}
        />
        <main className="flex-1">{children}</main>
        <Footer />
        <Toaster />
        {settings.chatWidgetEnabled && <ChatWidget />}
    </div>
  );
}
