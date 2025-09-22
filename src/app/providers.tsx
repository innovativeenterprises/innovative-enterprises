
'use client';

import { ThemeProvider } from 'next-themes';
import { Toaster } from '@/components/ui/toaster';
import { type ReactNode } from 'react';
import { SettingsProvider } from '@/components/layout/settings-provider';

export function Providers({ children }: { children: ReactNode }) {
  return (
    <SettingsProvider>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        {children}
        <Toaster />
      </ThemeProvider>
    </SettingsProvider>
  );
}
