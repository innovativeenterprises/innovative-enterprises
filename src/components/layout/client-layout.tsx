'use client';

import { Toaster } from '@/components/ui/toaster';
import ChatWidget from '@/components/chat-widget';
import { StoreProvider } from '@/components/layout/store-provider';
import type { AppState } from '@/lib/global-store';
import { ThemeProvider } from 'next-themes';
import Header from './header';
import Footer from './footer';
import { usePathname } from 'next/navigation';
import { initialState } from '@/lib/initial-state';

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isHomePage = pathname === '/';
  
  // The StoreProvider now initializes with the default initialState.
  // Pages that need server-side data will fetch it themselves.
  const initialData = initialState;

  return (
    <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
    >
        <StoreProvider initialData={initialData}>
        <div className="flex min-h-screen flex-col">
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
            <Toaster />
            <ChatWidget />
        </div>
        </StoreProvider>
    </ThemeProvider>
  );
}
