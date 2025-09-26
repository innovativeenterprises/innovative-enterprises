
'use client';

import { ThemeProvider } from 'next-themes';
import { Toaster } from '@/components/ui/toaster';
import { type ReactNode, useEffect } from 'react';
import { SplashScreen } from '@/components/splash-screen';
import MainLayout from './main-layout';
import { useGlobalStore, useSetStore } from '@/lib/global-store.tsx';
import { getFirestoreData } from './lib/initial-state';


function AppContent({ children }: { children: React.ReactNode }) {
    const { isClient } = useGlobalStore(state => ({ isClient: state.isClient }));
    const set = useSetStore();

    useEffect(() => {
        if (!isClient) {
            getFirestoreData().then(data => {
                set(state => ({
                    ...state,
                    ...data,
                    isClient: true,
                }));
            }).catch(error => {
                console.error("Failed to load initial data:", error);
                set(state => ({ ...state, isClient: true })); // Still unblock UI
            });
        }
    }, [isClient, set]);

    if (!isClient) {
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
