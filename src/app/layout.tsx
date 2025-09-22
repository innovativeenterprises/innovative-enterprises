
import { Inter } from 'next/font/google';
import '@/app/globals.css';
import { cn } from '@/lib/utils';
import type { Metadata } from 'next';
import { Providers } from '@/app/providers';
import { getProducts, getServices, getClients, getTestimonials, getAiTools, getSettings, getStoreProducts, getProviders, getOpportunities, getStages, getCostSettings, getRaahaData, getLeases, getStairspaceListings, getStairspaceRequests, getBeautyData, getAssets, getUsedItems, getGiftCards, getStudents, getCommunities, getCommunityEvents, getCommunityFinances, getCommunityMembers, getAlumniJobs, getRentalAgencies, getCars, getPosProducts, getDailySales, getSaasProducts, getStockItems, getPricing, getApplications, getBriefcase, getInvestors, getKnowledgeBase, getCfoData, getProperties, getSolutions, getIndustries, getStaffData } from '@/lib/firestore';
import { initialBriefcase } from '@/lib/briefcase';

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
  const [
    products,
    storeProducts,
    services,
    providers,
    opportunities,
    clients,
    testimonials,
    pricing,
    posProducts,
    dailySales,
    stages,
    assets,
    investors,
    properties,
    stairspaceListings,
    stairspaceRequests,
    signedLeases,
    stockItems,
    giftCards,
    students,
    communities,
    communityEvents,
    communityFinances,
    communityMembers,
    alumniJobs,
    rentalAgencies,
    cars,
    costSettings,
    raahaData,
    beautyData,
    usedItems,
    settings,
    knowledgeBase,
    applications,
    briefcase,
    solutions,
    industries,
    aiTools,
    saasProducts,
    cfoData,
    staffData,
  ] = await Promise.all([
    getProducts(),
    getStoreProducts(),
    getServices(),
    getProviders(),
    getOpportunities(),
    getClients(),
    getTestimonials(),
    getPricing(),
    getPosProducts(),
    getDailySales(),
    getStages(),
    getAssets(),
    getInvestors(),
    getProperties(),
    getStairspaceListings(),
    getStairspaceRequests(),
    getLeases(),
    getStockItems(),
    getGiftCards(),
    getStudents(),
    getCommunities(),
    getCommunityEvents(),
    getCommunityFinances(),
    getCommunityMembers(),
    getAlumniJobs(),
    getRentalAgencies(),
    getCars(),
    getCostSettings(),
    getRaahaData(),
    getBeautyData(),
    getUsedItems(),
    getSettings(),
    getKnowledgeBase(),
    getApplications(),
    getBriefcase(),
    getSolutions(),
    getIndustries(),
    getAiTools(),
    getSaasProducts(),
    getCfoData(),
    getStaffData(),
  ]);

  const initialAppState = {
    settings,
    products,
    storeProducts,
    services,
    providers,
    opportunities,
    clients,
    testimonials,
    pricing,
    posProducts,
    dailySales,
    stages,
    assets,
    investors,
    properties,
    stairspaceListings,
    stairspaceRequests,
    signedLeases,
    stockItems,
    giftCards,
    students,
    communities,
    communityEvents,
    communityFinances,
    communityMembers,
    alumniJobs,
    rentalAgencies,
    cars,
    costSettings,
    raahaAgencies: raahaData.raahaAgencies,
    raahaWorkers: raahaData.raahaWorkers,
    raahaRequests: raahaData.raahaRequests,
    beautyCenters: beautyData.beautyCenters,
    beautyServices: beautyData.beautyServices,
    beautySpecialists: beautyData.beautySpecialists,
    beautyAppointments: beautyData.beautyAppointments,
    usedItems,
    knowledgeBase,
    applications,
    briefcase: briefcase || initialBriefcase,
    solutions,
    industries,
    aiTools,
    saasProducts,
    cfoData,
    leadership: staffData.leadership,
    staff: staffData.staff,
    agentCategories: staffData.agentCategories,
    cart: [],
  };

  return (
    <html lang="en" suppressHydrationWarning>
      <head/>
      <body className={cn('min-h-screen bg-background font-sans antialiased', inter.variable)}>
        <Providers initialAppState={initialAppState}>
          {children}
        </Providers>
      </body>
    </html>
  );
}