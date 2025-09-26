
'use client';

import { usePathname } from 'next/navigation';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import ChatWidget from '@/components/chat-widget';

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAdminRoute = pathname.startsWith('/admin');
  const isAiPosRoute = pathname.startsWith('/ai-pos');

  // If it's an admin or AI POS route, render it without the main public layout
  if (isAdminRoute || isAiPosRoute) {
    return <main>{children}</main>;
  }

  // For all public routes, render with Header and Footer
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">{children}</main>
      <Footer />
      <ChatWidget />
    </div>
  );
}
