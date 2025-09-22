
'use client';

import React from 'react';
import { ThemeProvider } from 'next-themes';
import { SettingsProvider } from '@/components/layout/settings-provider';
import type { AppSettings } from '@/lib/settings';

export function Providers({ 
    children, 
    settings,
}: { 
    children: React.ReactNode,
    settings: AppSettings,
}) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <SettingsProvider settings={settings}>
          {children}
      </SettingsProvider>
    </ThemeProvider>
  );
}
