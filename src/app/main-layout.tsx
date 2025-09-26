
'use client';

import { useState, useEffect } from 'react';
import { SplashScreen } from '@/components/splash-screen';
import { usePathname } from 'next/navigation';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isLoading, setIsLoading] = useState(true);
  const pathname = usePathname();
  const isAdminRoute = pathname.startsWith('/admin');
  const isAiPosRoute = pathname.startsWith('/ai-pos');
  
  useEffect(() => {
    // Simulate initial load, then hide splash screen.
    const timer = setTimeout(() => {
        setIsLoading(false);
    }, 2500);
    return () => clearTimeout(timer);
  }, []);


  if (isLoading) {
    return <SplashScreen onFinished={() => setIsLoading(false)} />;
  }

  // If it's an admin or AI POS route, we render it without the main public layout
  if (isAdminRoute || isAiPosRoute) {
    return <main>{children}</main>;
  }

  // For all public routes, render the children which now includes Header/Footer from the RootLayout
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">{children}</main>
      <Footer />
    </div>
  );
}
