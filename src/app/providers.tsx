
'use client';

import { ThemeProvider } from 'next-themes';
import { Toaster } from '@/components/ui/toaster';
import { type ReactNode, useRef, useEffect, useState } from 'react';
import ChatWidget from '@/components/chat-widget';
import { StoreProvider, createAppStore, useGlobalStore } from '@/lib/global-store.tsx';
import { SplashScreen } from '@/components/splash-screen';
import MainLayout from './main-layout';
import type { AppState } from '@/lib/initial-state';
import { getFirestoreData } from '@/lib/initial-state';

function AppContent({ children }: { children: ReactNode }) {
    const isClient = useGlobalStore(state => state.isClient);
    const [showSplash, setShowSplash] = useState(!isClient);

    useEffect(() => {
        if (isClient) {
            const timer = setTimeout(() => setShowSplash(false), 2000); 
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
  initialState,
}: {
  children: ReactNode;
  initialState?: Partial<AppState>;
}) {
  const storeRef = useRef<ReturnType<typeof createAppStore>>();
  if (!storeRef.current) {
    storeRef.current = createAppStore(initialState);
  }

  useEffect(() => {
    const store = storeRef.current!;
    if (!store.getState().isClient) {
      getFirestoreData().then(data => {
        store.setState(state => ({
          ...state,
          ...data,
          isClient: true,
        }));
      }).catch(error => {
        console.error("Failed to load initial data:", error);
        store.setState(state => ({ ...state, isClient: true }));
      });
    }
  }, []);

  return (
    <StoreProvider store={storeRef.current}>
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
