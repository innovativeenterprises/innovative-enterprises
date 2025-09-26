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

  if (isLoading) {
    return <SplashScreen onFinished={() => setIsLoading(false)} />;
  }

  if (isAdminRoute || isAiPosRoute) {
    return <main>{children}</main>;
  }
  
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">{children}</main>
      <Footer />
    </div>
  );
}
