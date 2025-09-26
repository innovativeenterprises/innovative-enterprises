
'use client';

import { ThemeProvider } from 'next-themes';
import { Toaster } from '@/components/ui/toaster';
import { type ReactNode } from 'react';
import ChatWidget from '@/components/chat-widget';
import { StoreProvider, useGlobalStore } from '@/lib/global-store.tsx';
import { SplashScreen } from '@/components/splash-screen';
import MainLayout from './main-layout';

export function Providers({
  children,
}: {
  children: ReactNode;
}) {
    const isClient = useGlobalStore(state => state.isClient);

    if (!isClient) {
        return <SplashScreen />;
    }
  
    return (
        <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
        >
            {children}
            <Toaster />
            <ChatWidget />
        </ThemeProvider>
  );
}
