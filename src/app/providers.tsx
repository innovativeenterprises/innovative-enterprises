
'use client';

import { ThemeProvider } from 'next-themes';
import { Toaster } from '@/components/ui/toaster';
import { StoreProvider } from '@/lib/global-store.tsx';
import { type AppState } from '@/lib/initial-state';
import { getInitialState } from '@/lib/initial-state';
import { ReactNode } from 'react';

export function Providers({ children }: { children: ReactNode }) {
  const initialState = getInitialState();
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
      </ThemeProvider>
    </StoreProvider>
  );
}
