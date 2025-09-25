
'use client';

import { ThemeProvider } from 'next-themes';
import { Toaster } from '@/components/ui/toaster';
import { type ReactNode, useRef } from 'react';
import ChatWidget from '@/components/chat-widget';
import { StoreProvider } from '@/lib/global-store';
import type { AppState } from '@/lib/initial-state';
import type { AppSettings } from '@/lib/settings';

export function Providers({
  children,
  initialSettings,
}: {
  children: ReactNode;
  initialState?: Partial<AppState>;
  initialSettings: AppSettings | null;
}) {

  return (
    <StoreProvider initialState={{ settings: initialSettings }}>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        {children}
        <Toaster />
        <ChatWidget />
      </ThemeProvider>
    </StoreProvider>
  );
}
