
'use client';

import { Toaster } from '@/components/ui/toaster';
import ChatWidget from '@/components/chat-widget';
import { StoreProvider } from '@/components/layout/store-provider';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import type { AppState } from '@/lib/global-store';
import { ThemeProvider } from 'next-themes';

export default function ClientLayout({
  children,
  initialData,
}: {
  children: React.ReactNode;
  initialData: Partial<AppState>;
}) {
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
