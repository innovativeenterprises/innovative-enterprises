
'use client';

import { ThemeProvider } from 'next-themes';
import { Toaster } from '@/components/ui/toaster';
import { type ReactNode, useEffect, useState } from 'react';
import ChatWidget from '@/components/chat-widget';
import { StoreProvider, useGlobalStore } from '@/lib/global-store.tsx';
import { SplashScreen } from '@/components/splash-screen';
import MainLayout from './main-layout';

function AppContent({ children }: { children: ReactNode }) {
    const { isClient } = useGlobalStore(state => ({ isClient: state.isClient }));
    const [showSplash, setShowSplash] = useState(true);

    useEffect(() => {
        if (isClient) {
            const timer = setTimeout(() => setShowSplash(false), 2000); // Show splash for 2 seconds
            return () => clearTimeout(timer);
        }
    }, [isClient]);

    if (showSplash || !isClient) {
        return <SplashScreen />;
    }

    return <MainLayout>{children}</MainLayout>;
}

export function Providers({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <StoreProvider>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <AppContent>{children}</AppContent>
        <Toaster />
        <ChatWidget />
      </ThemeProvider>
    </StoreProvider>
  );
}
