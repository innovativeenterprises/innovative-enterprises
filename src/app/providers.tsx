
'use client';

import { ThemeProvider } from 'next-themes';
import { Toaster } from '@/components/ui/toaster';
import { type ReactNode } from 'react';
import { SettingsProvider } from '@/components/layout/settings-provider';
import type { AppSettings } from '@/lib/settings';

export function Providers({ children, initialSettings }: { children: ReactNode, initialSettings: AppSettings }) {
  return (
    <SettingsProvider initialSettings={initialSettings}>
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
