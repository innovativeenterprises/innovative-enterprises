'use client';

import { ThemeProvider } from 'next-themes';
import { Toaster } from '@/components/ui/toaster';
import { type ReactNode, useEffect, useState } from 'react';
import { SplashScreen } from '@/components/splash-screen';
import MainLayout from './main-layout';
import { StoreProvider, useGlobalStore } from '@/lib/global-store.tsx';


function AppContent({ children }: { children: ReactNode }) {
    const { isClient } = useGlobalStore(state => ({ isClient: state.isClient }));
    const [showSplash, setShowSplash] = useState(true);
    
    useEffect(() => {
        if (isClient) {
            // Use a timeout to ensure the splash screen is visible for a moment
            const timer = setTimeout(() => setShowSplash(false), 500);
            return () => clearTimeout(timer);
        }
    }, [isClient]);

    if (showSplash) {
        return <SplashScreen onFinished={() => {}} />;
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
      </ThemeProvider>
    </StoreProvider>
  );
}
