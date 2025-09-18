
'use client';

import { Toaster } from '@/components/ui/toaster';
import ChatWidget from '@/components/chat-widget';
import { StoreProvider } from '@/components/layout/store-provider';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import type { AppState } from '@/lib/global-store';
import { ThemeProvider } from 'next-themes';
import { usePathname } from 'next/navigation';

export default function ClientLayout({
  children,
  initialData,
}: {
  children: React.ReactNode;
  initialData: Partial<AppState>;
}) {
  const pathname = usePathname();
  const isHomePage = pathname === '/';

  return (
    <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
    >
        <StoreProvider initialData={initialData}>
        <div className="flex min-h-screen flex-col">
            {!isHomePage && <Header />}
            <main className="flex-1">{children}</main>
            {!isHomePage && <Footer />}
            <Toaster />
            <ChatWidget />
        </div>
        </StoreProvider>
    </ThemeProvider>
  );
}
