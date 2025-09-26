'use client';

import { useState } from 'react';
import { SplashScreen } from '@/components/splash-screen';
import { usePathname } from 'next/navigation';

export default function MainLayout({
  children,
  header,
  footer,
}: {
  children: React.ReactNode;
  header: React.ReactNode;
  footer: React.ReactNode;
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
      {header}
      <main className="flex-grow">{children}</main>
      {footer}
    </div>
  );
}
