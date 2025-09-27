
'use client';

import { ThemeProvider } from 'next-themes';
import { Toaster } from '@/components/ui/toaster';
import { type ReactNode, useState, useEffect } from 'react';
import ChatWidget from '@/components/chat-widget';
import { SplashScreen } from '@/components/splash-screen';
import MainLayout from './main-layout';
import { StoreProvider } from '@/hooks/use-data-hooks';

function AppContent({ children }: { children: ReactNode }) {
    const [showSplash, setShowSplash] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => setShowSplash(false), 1500); 
        return () => clearTimeout(timer);
    }, []);

    if (showSplash) {
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
