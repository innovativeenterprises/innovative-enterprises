
import { Inter } from 'next/font/google';
import '@/app/globals.css';
import { cn } from '@/lib/utils';
import type { Metadata } from 'next';
import ClientLayout from '@/components/layout/client-layout';
import { getServices, getProducts, getStoreProducts, getStaffData, getClients, getTestimonials, getSettings, getSolutions, getIndustries, getAiTools, getOpportunities, getProviders, getLeases, getStairspaceRequests, getStairspaceListings, getRaahaAgencies, getRaahaWorkers, getRaahaRequests, getBeautyCenters, getBeautyServices, getBeautySpecialists, getBeautyAppointments, getCostSettings, getAssets, getUsedItems, getCars, getRentalAgencies, getGiftCards, getStudents, getCommunities, getCommunityEvents, getCommunityFinances, getCommunityMembers, getAlumniJobs, getBriefcase, getPricing, getInvestors, getKnowledgeBase, getCfoData, getProperties, getStockItems, getApplications, getStages } from '@/lib/firestore';

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
  // Data is fetched in specific server components that need it, 
  // or provided to the global store for client-side state.
  const initialData = {
    services: await getServices(),
    products: await getProducts(),
    storeProducts: await getStoreProducts(),
    ...await getStaffData(),
    clients: await getClients(),
    testimonials: await getTestimonials(),
    settings: await getSettings(),
    solutions: await getSolutions(),
    industries: await getIndustries(),
    aiTools: await getAiTools(),
    opportunities: await getOpportunities(),
    providers: await getProviders(),
    signedLeases: await getLeases(),
    stairspaceRequests: await getStairspaceRequests(),
    stairspaceListings: await getStairspaceListings(),
    raahaAgencies: (await getRaahaData()).raahaAgencies,
    raahaWorkers: (await getRaahaData()).raahaWorkers,
    raahaRequests: (await getRaahaData()).raahaRequests,
    beautyCenters: (await getBeautyData()).beautyCenters,
    beautyServices: (await getBeautyData()).beautyServices,
    beautySpecialists: [],
    beautyAppointments: (await getBeautyData()).beautyAppointments,
    costSettings: await getCostSettings(),
    assets: await getAssets(),
    usedItems: await getUsedItems(),
    cars: await getCars(),
    rentalAgencies: await getRentalAgencies(),
    giftCards: await getGiftCards(),
    students: await getStudents(),
    communities: await getCommunities(),
    communityEvents: await getCommunityEvents(),
    communityFinances: await getCommunityFinances(),
    communityMembers: await getCommunityMembers(),
    alumniJobs: await getAlumniJobs(),
    briefcase: await getBriefcase(),
    pricing: await getPricing(),
    investors: await getInvestors(),
    knowledgeBase: await getKnowledgeBase(),
    cfoData: await getDoc('cfo/dashboard'),
    properties: await getProperties(),
    stockItems: await getStockItems(),
    applications: await getApplications(),
    stages: await getStages(),
  };

  return (
    <html lang="en" suppressHydrationWarning>
      <head/>
      <body className={cn('min-h-screen bg-background font-sans antialiased', inter.variable)}>
        <ClientLayout initialData={initialData as any}>{children}</ClientLayout>
      </body>
    </html>
  );
}

async function getDoc<T>(docPath: string): Promise<T> {
    const snapshot = await admin.firestore().doc(docPath).get();
    return snapshot.data() as T;
}
import * as admin from 'firebase-admin';
if (!admin.apps.length) {
    admin.initializeApp();
}
