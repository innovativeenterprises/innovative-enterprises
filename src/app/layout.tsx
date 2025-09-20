
'use client';

import { Inter } from 'next/font/google';
import '@/app/globals.css';
import { cn } from '@/lib/utils';
import type { Metadata } from 'next';
import ClientLayout from '@/components/layout/client-layout';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
});

// Metadata can be defined in a Server Component layout, but we'll manage it here for simplicity in the Client Layout structure.
// Note: In a production app with more complex needs, you might have a Server Component layout wrapping this.
// export const metadata: Metadata = {
//   metadataBase: new URL('https://innovativeenterprises.tech'),
//   title: {
//     default: "INNOVATIVE ENTERPRISES - AI-Powered Business Platform",
//     template: "%s | INNOVATIVE ENTERPRISES",
//   },
//   description: "An AI-powered business services platform for the Omani market that automates key operations, connects a network of service providers, and provides a suite of intelligent tools to enhance business productivity and digital transformation.",
//   keywords: ["Oman", "SME", "AI", "business services", "Sanad Hub", "digital transformation", "automation", "e-commerce", "real estate tech"],
//   openGraph: {
//     title: "INNOVATIVE ENTERPRISES - AI-Powered Business Platform",
//     description: "The digital operating system for SMEs in Oman. Automate, delegate, and grow with our integrated suite of AI tools and service marketplaces.",
//     url: "https://innovativeenterprises.tech",
//     siteName: "INNOVATIVE ENTERPRISES",
//     images: [
//       {
//         url: "https://storage.googleapis.com/stella-images/studio-app-live/20240801-140026-646-logo.png",
//         width: 1200,
//         height: 630,
//         alt: "INNOVATIVE ENTERPRISES Logo"
//       }
//     ],
//     locale: "en_US",
//     type: "website",
//   },
//    twitter: {
//     card: "summary_large_image",
//     title: "INNOVATIVE ENTERPRISES - AI-Powered Business Platform",
//     description: "The digital operating system for SMEs in Oman. Automate, delegate, and grow with our integrated suite of AI tools and service marketplaces.",
//     images: ["https://storage.googleapis.com/stella-images/studio-app-live/20240801-140026-646-logo.png"],
//   },
//   verification: {
//     other: {
//       "facebook-domain-verification": "7hbqn30n21c3su6iuyi0ndrbodkhgv",
//     },
//   },
// }


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Data fetching is removed from the root layout.
  // It will now happen in specific page-level Server Components.
  // The StoreProvider will be initialized with static initial data.
  return (
    <html lang="en" suppressHydrationWarning>
      <head/>
      <body className={cn('min-h-screen bg-background font-sans antialiased', inter.variable)}>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
