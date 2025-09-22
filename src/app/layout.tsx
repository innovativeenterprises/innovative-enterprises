
'use server';

import { Inter } from 'next/font/google';
import '@/app/globals.css';
import { cn } from '@/lib/utils';
import type { Metadata } from 'next';
import { ThemeProvider } from 'next-themes';
import { Toaster } from '@/components/ui/toaster';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import ChatWidget from '@/components/chat-widget';
import { getSettings, getSolutions, getIndustries, getAiTools } from '@/lib/firestore';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://innovativeenterprises.tech'),
  title: {
    default: "INNOVATIVE ENTERPRISES - AI-Powered Business Platform",
    template: "%s | INNOVATIVE ENTERPRISES",
  },
  description: "An AI-powered business services platform for the Omani market that automates key operations, connects a network of service providers, and provides a suite of intelligent tools to enhance business productivity and digital transformation.",
  keywords: ["Oman", "SME", "AI", "business services", "Sanad Hub", "digital transformation", "automation", "e-commerce", "real estate tech"],
  openGraph: {
    title: "INNOVATIVE ENTERPRISES - AI-Powered Business Platform",
    description: "The digital operating system for SMEs in Oman. Automate, delegate, and grow with our integrated suite of AI tools and service marketplaces.",
    url: "https://innovativeenterprises.tech",
    siteName: "INNOVATIVE ENTERPRISES",
    images: [
      {
        url: "https://storage.googleapis.com/stella-images/studio-app-live/20240801-140026-646-logo.png",
        width: 1200,
        height: 630,
        alt: "INNOVATIVE ENTERPRISES Logo"
      }
    ],
    locale: "en_US",
    type: "website",
  },
   twitter: {
    card: "summary_large_image",
    title: "INNOVATIVE ENTERPRISES - AI-Powered Business Platform",
    description: "The digital operating system for SMEs in Oman. Automate, delegate, and grow with our integrated suite of AI tools and service marketplaces.",
    images: ["https://storage.googleapis.com/stella-images/studio-app-live/20240801-140026-646-logo.png"],
  },
  verification: {
    other: {
      "facebook-domain-verification": "7hbqn30n21c3su6iuyi0ndrbodkhgv",
    },
  },
}


export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [settings, solutions, industries, aiTools] = await Promise.all([
    getSettings(),
    getSolutions(),
    getIndustries(),
    getAiTools()
  ]);

  return (
    <html lang="en" suppressHydrationWarning>
      <head/>
      <body className={cn('min-h-screen bg-background font-sans antialiased', inter.variable)}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="flex min-h-screen flex-col">
            <Header 
              settings={settings} 
              solutions={solutions} 
              industries={industries}
              aiTools={aiTools}
            />
            <main className="flex-1">{children}</main>
            <Footer />
            <ChatWidget settings={settings} />
          </div>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
