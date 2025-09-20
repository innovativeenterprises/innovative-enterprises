
'use client';

import { Toaster } from '@/components/ui/toaster';
import ChatWidget from '@/components/chat-widget';
import { StoreProvider } from '@/components/layout/store-provider';
import type { AppState } from '@/lib/global-store';
import { initialState } from '@/lib/global-store';
import { ThemeProvider } from 'next-themes';
import Header from './header';
import Footer from './footer';

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  // The initialData prop is removed. The store now initializes with the static default state.
  // Page-specific data is fetched by Server Components and passed down as props.
  return (
    <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
    >
        <StoreProvider initialData={initialState}>
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
