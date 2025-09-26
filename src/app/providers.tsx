
'use client';

import { ThemeProvider } from 'next-themes';
import { Toaster } from '@/components/ui/toaster';
import { type ReactNode, useState, useEffect } from 'react';
import { SplashScreen } from '@/components/splash-screen';
import MainLayout from './main-layout';
import { useGlobalStore } from '@/lib/global-store.tsx';

function AppContent({ children }: { children: ReactNode }) {
    const { isClient } = useGlobalStore(state => ({ isClient: state.isClient }));
    
    // This state now correctly triggers re-render after hydration
    const [showSplash, setShowSplash] = useState(!isClient);
    
    useEffect(() => {
        if (isClient) {
            const timer = setTimeout(() => setShowSplash(false), 500); // Simulate loading
            return () => clearTimeout(timer);
        }
    }, [isClient]);

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
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <AppContent>{children}</AppContent>
        <Toaster />
      </ThemeProvider>
  );
}
