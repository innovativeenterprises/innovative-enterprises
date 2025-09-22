
'use client';

import { ThemeProvider } from 'next-themes';
import { Toaster } from '@/components/ui/toaster';
import { StoreProvider } from '@/lib/global-store.tsx';
import { type AppState } from '@/lib/initial-state';
import { getInitialState } from '@/lib/initial-state';

export function Providers({ children }: { children: React.ReactNode }) {
  // We call getInitialState() to ensure we have the complete, up-to-date initial state.
  const initialState = getInitialState();

  return (
    <StoreProvider initialState={initialState as AppState}>
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
