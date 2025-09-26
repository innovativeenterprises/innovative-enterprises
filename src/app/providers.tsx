
'use client';

import { ThemeProvider } from 'next-themes';
import { Toaster } from '@/components/ui/toaster';
import { type ReactNode } from 'react';
import ChatWidget from '@/components/chat-widget';
import { StoreProvider, useGlobalStore } from '@/lib/global-store.tsx';
import { SplashScreen } from '@/components/splash-screen';

const AppContent = ({ children }: { children: ReactNode }) => {
    const isClient = useGlobalStore(state => state.isClient);

    if (!isClient) {
        return <SplashScreen />;
    }

    return <>{children}</>;
};

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
