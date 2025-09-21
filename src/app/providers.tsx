
'use client';

import { ThemeProvider } from 'next-themes';
import { SettingsProvider } from '@/components/layout/settings-provider';
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
            {children}
        </SettingsProvider>
    </ThemeProvider>
  );
}
