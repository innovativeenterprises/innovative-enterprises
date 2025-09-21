

'use client';

import { Toaster } from '@/components/ui/toaster';
import ChatWidget from '@/components/chat-widget';
import { ThemeProvider } from 'next-themes';
import Footer from './footer';
import Header from './header';
import type { Solution, Industry, AiTool } from '@/lib/nav-links';
import React from 'react';
import type { AppSettings } from '@/lib/settings';

export default function ClientLayout({
  children,
  solutions,
  industries,
  aiTools,
  settings,
}: {
  children: React.ReactNode;
  solutions: Solution[];
  industries: Industry[];
  aiTools: AiTool[];
  settings: AppSettings;
}) {

  return (
    <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
    >
        <div className="flex min-h-screen flex-col">
            <Header 
              solutions={solutions}
              industries={industries}
              aiTools={aiTools}
            />
            <main className="flex-1">{children}</main>
            <Footer />
            <Toaster />
            <ChatWidget settings={settings} />
        </div>
    </ThemeProvider>
  );
}
