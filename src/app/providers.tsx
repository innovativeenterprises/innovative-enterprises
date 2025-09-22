
'use client';

import { ThemeProvider } from 'next-themes';
import { Toaster } from '@/components/ui/toaster';
import { type ReactNode } from 'react';
import type { AppState } from '@/lib/initial-state';
import { StoreProvider } from '@/lib/global-store';

export function Providers({ children, initialState }: { children: ReactNode, initialState: AppState }) {
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
