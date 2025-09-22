'use client';

import React, { ReactNode } from 'react';
import { ThemeProvider } from 'next-themes';
import { Toaster } from '@/components/ui/toaster';
import { SettingsProvider } from '@/components/layout/settings-provider';
import type { AppSettings } from '@/lib/settings';

export function Providers({ 
    children,
    initialSettings
}: { 
    children: ReactNode,
    initialSettings: AppSettings
}) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
        <SettingsProvider initialSettings={initialSettings}>
            {children}
            <Toaster />
        </SettingsProvider>
    </ThemeProvider>
  );
}
