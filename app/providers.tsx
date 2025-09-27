
'use client';

import { ThemeProvider } from 'next-themes';
import { Toaster } from '@/components/ui/toaster';
import { type ReactNode, useEffect, useState } from 'react';
import ChatWidget from '@/components/chat-widget';
import { SplashScreen } from '@/components/splash-screen';
import MainLayout from './main-layout';
import { StoreProvider } from '@/lib/global-store';


export function Providers({
  children,
}: {
  children: ReactNode;
}) {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <StoreProvider onHydrated={() => setIsLoading(false)}>
      {isLoading ? (
        <SplashScreen />
      ) : (
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <MainLayout>{children}</MainLayout>
          <Toaster />
          <ChatWidget />
        </ThemeProvider>
      )}
    </StoreProvider>
  );
}
