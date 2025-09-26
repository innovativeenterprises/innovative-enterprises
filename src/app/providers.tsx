
'use client';

import { ThemeProvider } from 'next-themes';
import { Toaster } from '@/components/ui/toaster';
import { type ReactNode, useEffect, useState } from 'react';
import { SplashScreen } from '@/components/splash-screen';
import MainLayout from './main-layout';
import { useGlobalStore, useSetStore, StoreProvider } from '@/lib/global-store.tsx';
import { getFirestoreData } from './lib/initial-state';

function AppContent({ children }: { children: ReactNode }) {
    const { isClient } = useGlobalStore(state => ({ isClient: state.isClient }));
    const set = useSetStore();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!isClient) {
             getFirestoreData().then(data => {
                set(state => ({
                    ...state,
                    ...data,
                }));
             }).catch(error => {
                 console.error("Failed to load initial data:", error);
             }).finally(() => {
                 set({ isClient: true });
                 setIsLoading(false);
             });
        } else {
            setIsLoading(false);
        }
    }, [isClient, set]);

    if (isLoading) {
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
      </ThemeProvider>
    </StoreProvider>
  );
}
