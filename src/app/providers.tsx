
'use client';

import React from 'react';
import { ThemeProvider } from 'next-themes';
import { SettingsProvider } from '@/components/layout/settings-provider';
import ClientLayout from '@/components/layout/client-layout';
import type { AppSettings } from '@/lib/settings';

export function Providers({ 
    children, 
    initialSettings 
}: { 
    children: React.ReactNode,
    initialSettings: AppSettings,
}) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <SettingsProvider initialSettings={initialSettings}>
        <ClientLayout>{children}</ClientLayout>
      </SettingsProvider>
    </ThemeProvider>
  );
}
