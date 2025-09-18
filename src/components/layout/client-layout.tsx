
'use client';

import { Toaster } from '@/components/ui/toaster';
import ChatWidget from '@/components/chat-widget';
import { StoreProvider } from '@/components/layout/store-provider';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import type { AppState } from '@/lib/global-store';

export default function ClientLayout({
  children,
  initialData,
}: {
  children: React.ReactNode;
  initialData: Partial<AppState>;
}) {
  return (
    <StoreProvider initialData={initialData}>
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <Toaster />
        <ChatWidget />
      </div>
    </StoreProvider>
  );
}
