
'use client';

import { ThemeProvider } from 'next-themes';
import { Toaster } from '@/components/ui/toaster';
import { StoreProvider, type AppState } from '@/lib/global-store';

export function Providers({ children, initialState }: { children: React.ReactNode, initialState: AppState }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <StoreProvider initialState={initialState}>
        {children}
        <Toaster />
      </StoreProvider>
    </ThemeProvider>
  );
}
