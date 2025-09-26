'use client';

import { useState } from 'react';
import { SplashScreen } from '@/components/splash-screen';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import { usePathname } from 'next/navigation';

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isLoading, setIsLoading] = useState(true);
  const pathname = usePathname();
  const isAdminRoute = pathname.startsWith('/admin');
  const isAiPosRoute = pathname.startsWith('/ai-pos');

  const showHeaderFooter = !isAdminRoute && !isAiPosRoute;

  if (isLoading) {
    return <SplashScreen onFinished={() => setIsLoading(false)} />;
  }
  
  return (
    <div className="flex flex-col min-h-screen">
      {showHeaderFooter && <Header />}
      <main className="flex-grow">{children}</main>
      {showHeaderFooter && <Footer />}
    </div>
  );
}
