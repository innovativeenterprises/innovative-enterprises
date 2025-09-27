
'use client';

import { ThemeProvider } from 'next-themes';
import { Toaster } from '@/components/ui/toaster';
import { type ReactNode } from 'react';
import ChatWidget from '@/components/chat-widget';
import { StoreProvider, useGlobalStore } from '@/lib/global-store.tsx';
import { SplashScreen } from '@/components/splash-screen';
import MainLayout from './main-layout';
import { usePathname } from 'next/navigation';

function AppContent({ children }: { children: ReactNode }) {
    const { isClient } = useGlobalStore(state => ({ isClient: state.isClient }));
    const pathname = usePathname();

    const isAdminRoute = pathname.startsWith('/admin');
    const isAiPosRoute = pathname.startsWith('/ai-pos');
    
    if (!isClient) {
        return <SplashScreen />;
    }

    if (isAdminRoute || isAiPosRoute) {
        return <main>{children}</main>;
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
