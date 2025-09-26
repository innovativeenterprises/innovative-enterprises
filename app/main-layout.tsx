
'use client';

import { useState } from 'react';
import { SplashScreen } from '@/components/splash-screen';
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

  // If it's an admin or AI POS route, we render it without the main public layout
  if (isAdminRoute || isAiPosRoute) {
    return <main>{children}</main>;
  }

  // For all public routes, render the children which now includes Header/Footer from the RootLayout
  return <>{children}</>;
}
