
'use client';

import { ThemeProvider } from 'next-themes';
import { Toaster } from '@/components/ui/toaster';
import { type ReactNode, useEffect, useState } from 'react';
import ChatWidget from '@/components/chat-widget';
import { StoreProvider } from '@/lib/global-store';
import type { AppState } from '@/lib/initial-state';
import { getEmptyState } from '@/lib/initial-state';

export function Providers({ children, initialState }: { children: ReactNode, initialState: Partial<AppState> | null }) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);
  
  if (!initialState) {
    initialState = getEmptyState();
  }
  
  return (
    <StoreProvider initialState={initialState}>
        <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
        >
        {children}
        <Toaster />
        {isClient && <ChatWidget />}
        </ThemeProvider>
    </StoreProvider>
  );
}
