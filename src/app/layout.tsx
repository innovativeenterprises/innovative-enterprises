import { Inter } from 'next/font/google';
import '@/app/globals.css';
import { cn } from '@/lib/utils';
import type { Metadata } from 'next';
import ClientLayout from '@/components/layout/client-layout';
import { getServices, getProducts, getStoreProducts, getStaffData, getClients, getTestimonials, getSettings, getSolutions, getIndustries, getAiTools, getOpportunities, getProviders, getLeases, getStairspaceRequests, getStairspaceListings, getRaahaAgencies, getRaahaWorkers, getRaahaRequests, getBeautyCenters, getBeautyServices, getBeautySpecialists, getBeautyAppointments, getCostSettings, getAssets, getUsedItems, getCars, getRentalAgencies, getGiftCards, getStudents, getCommunities, getCommunityEvents, getCommunityFinances, getCommunityMembers, getAlumniJobs, getBriefcase, getPricing, getInvestors, getKnowledgeBase, getCfoData, getProperties, getStockItems, getApplications } from '@/lib/firestore';

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
  // Fetch all initial data here in the root layout
  const [
    services, 
    products, 
    storeProducts,
    staffData, 
    clients, 
    testimonials, 
    settings, 
    solutions, 
    industries, 
    aiTools,
    opportunities,
    providers,
    leases,
    stairspaceRequests,
    stairspaceListings,
    raahaAgencies,
    raahaWorkers,
    raahaRequests,
    beautyCenters,
    beautyServices,
    beautySpecialists,
    beautyAppointments,
    costSettings,
    assets,
    usedItems,
    cars,
    rentalAgencies,
    giftCards,
    students,
    communities,
    communityEvents,
    communityFinances,
    communityMembers,
    alumniJobs,
    briefcase,
    pricing,
    investors,
    knowledgeBase,
    cfoData,
    properties,
    stockItems,
    applications,
  ] = await Promise.all([
    getServices(),
    getProducts(),
    getStoreProducts(),
    getStaffData(),
    getClients(),
    getTestimonials(),
    getSettings(),
    getSolutions(),
    getIndustries(),
    getAiTools(),
    getOpportunities(),
    getProviders(),
    getLeases(),
    getStairspaceRequests(),
    getStairspaceListings(),
    getRaahaAgencies(),
    getRaahaWorkers(),
    getRaahaRequests(),
    getBeautyCenters(),
    getBeautyServices(),
    getCollection('beautySpecialists'),
    getBeautyAppointments(),
    getCostSettings(),
    getAssets(),
    getUsedItems(),
    getCars(),
    getRentalAgencies(),
    getGiftCards(),
    getStudents(),
    getCommunities(),
    getCommunityEvents(),
    getCommunityFinances(),
    getCommunityMembers(),
    getAlumniJobs(),
    getBriefcase(),
    getPricing(),
    getInvestors(),
    getKnowledgeBase(),
    getCfoData(),
    getProperties(),
    getStockItems(),
    getApplications(),
  ]);

  const initialData = {
    services,
    products,
    storeProducts,
    leadership: staffData.leadership,
    staff: staffData.staff,
    agentCategories: staffData.agentCategories,
    clients,
    testimonials,
    settings,
    solutions,
    industries,
    aiTools,
    opportunities,
    providers,
    signedLeases: leases,
    stairspaceRequests,
    stairspaceListings,
    raahaAgencies,
    raahaWorkers,
    raahaRequests,
    beautyCenters,
    beautyServices,
    beautySpecialists,
    beautyAppointments,
    costSettings,
    assets,
    usedItems,
    cars,
    rentalAgencies,
    giftCards,
    students,
    communities,
    communityEvents,
    communityFinances,
    communityMembers,
    alumniJobs,
    briefcase,
    pricing,
    investors,
    knowledgeBase,
    cfoData,
    properties,
    stockItems,
    applications,
  };


  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn('min-h-screen bg-background font-sans antialiased', inter.variable)}>
        <ClientLayout initialData={initialData as any}>{children}</ClientLayout>
      </body>
    </html>
  );
}

// Helper function to get collection data (to avoid repeating code)
async function getCollection(name: string) {
    // In a real app, this would fetch from Firestore.
    // For this prototype, we'll return an empty array to avoid breaking the layout.
    // The actual data is provided via initial-state.ts for the client store.
    return [];
}
