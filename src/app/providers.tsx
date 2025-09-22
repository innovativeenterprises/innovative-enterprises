
'use client';

import { ThemeProvider } from 'next-themes';
import { Toaster } from '@/components/ui/toaster';
import { StoreProvider } from '@/lib/global-store';
import { type AppState } from '@/lib/initial-state';
import { ReactNode } from 'react';

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
