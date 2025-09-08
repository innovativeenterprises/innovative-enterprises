
'use client';

import * as React from 'react';
import { Inter } from 'next/font/google';
import './globals.css';
import { cn } from '@/lib/utils';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import { Toaster } from '@/components/ui/toaster';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isClient, setIsClient] = React.useState(false);

  React.useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <html lang="en">
      <head>
        <title>Innovative Enterprises - AI-Powered Business Platform</title>
        <meta
          name="description"
          content="An AI-powered business services platform for the Omani market that automates key operations and enhances business productivity."
        />
      </head>
      <body className={cn('min-h-screen bg-background font-sans antialiased', inter.variable)}>
        {isClient ? (
          <>
            <Header />
            <main>{children}</main>
            <Footer />
            <Toaster />
          </>
        ) : <main>{children}</main>}
      </body>
    </html>
