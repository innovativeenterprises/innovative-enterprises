
'use client';

import { ThemeProvider } from 'next-themes';
import { Toaster } from '@/components/ui/toaster';
import { type ReactNode } from 'react';
import ChatWidget from '@/components/chat-widget';
import { useGlobalStore } from '@/lib/global-store.tsx';
import { SplashScreen } from '@/components/splash-screen';
import MainLayout from './main-layout';

function AppContent({ children }: { children: React.ReactNode }) {
    const isClient = useGlobalStore(state => state.isClient);

    if (!isClient) {
        return <SplashScreen />;
    }

    return (
        <>
            <MainLayout>
                {children}
            </MainLayout>
            <Toaster />
            <ChatWidget />
        </>
    );
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
            <AppContent>
                {children}
            </AppContent>
        </ThemeProvider>
    );
}
