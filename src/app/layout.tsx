
'use client';

import { Inter } from 'next/font/google';
import './globals.css';
import { cn } from '@/lib/utils';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import { Toaster } from '@/components/ui/toaster';
import { useState, useEffect } from 'react';

const fontSans = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
});

// Note: Metadata export is not supported in client components, but can be handled
// in a parent server component layout or page if needed.
// For this fix, we focus on resolving the hydration error.

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <html lang="en">
      <body
        className={cn(
          'min-h-screen bg-background font-sans antialiased',
          fontSans.variable
        )}
      >
        {isClient ? (
          <>
            <Header />
            {children}
            <Footer />
            <Toaster />
          </>
        ) : null}
      </body>
    </html>
  );
}
