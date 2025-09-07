

'use client';

import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster"
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import { Inter as FontSans } from 'next/font/google';
import { cn } from '@/lib/utils';
import React, { useState, useEffect } from 'react';

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
})

// Metadata is still supported in client components
export const metadata: Metadata = {
  title: 'INNOVATIVE ENTERPRISES',
  description: 'Leading Omani SME in emerging technology and digital transformation.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn("min-h-screen bg-background font-sans antialiased", fontSans.variable)}>
        {isClient ? (
          <>
            <Header />
            <main>{children}</main>
            <Footer />
            <Toaster />
          </>
        ) : (
          <div className="flex items-center justify-center h-screen">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
          </div>
        )}
      </body>
    </html>
  );
}
