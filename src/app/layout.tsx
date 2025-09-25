
import { Inter } from 'next/font/google';
import '@/app/globals.css';
import { cn } from '@/lib/utils';
import type { Metadata } from 'next';
import { Providers } from '@/app/providers';
import { getProducts, getServices, getProviders, getOpportunities, getClients, getTestimonials, getPricing, getPosProducts, getDailySales, getStages, getAssets, getInvestors, getProperties, getStairspaceListings, getStairspaceRequests, getLeases, getStockItems, getGiftCards, getStudents, getCommunities, getCommunityEvents, getCommunityFinances, getCommunityMembers, getAlumniJobs, getRentalAgencies, getCars, getCostSettings, getBeautyCenters, getBeautyServices, getBeautySpecialists, getBeautyAppointments, getUsedItems, getSettings, getKnowledgeBase, getApplications, getBriefcase, getSolutions, getIndustries, getAiTools, getSaasProducts, getCfoData, getStaffData, getRaahaData, getBeautyData } from '@/lib/firestore';
import type { AppState } from '@/lib/initial-state';

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
      settings, products, storeProducts, providers, opportunities, services, signedLeases,
      stairspaceRequests, stairspaceListings, staffData, raahaData, beautyData,
      costSettings, assets, usedItems, clients, testimonials, giftCards, students,
      communities, communityEvents, communityFinances, communityMembers, alumniJobs,
      rentalAgencies, cars, posProducts, dailySales, saasProducts, stockItems,
      pricing, stages, applications, briefcase, investors, knowledgeBase, cfoData,
      properties, solutions, industries, aiTools
  ] = await Promise.all([
      getSettings(), getProducts(), getStoreProducts(), getProviders(), getOpportunities(),
      getServices(), getLeases(), getStairspaceRequests(), getStairspaceListings(),
      getStaffData(), getRaahaData(), getBeautyData(), getCostSettings(), getAssets(),
      getUsedItems(), getClients(), getTestimonials(), getGiftCards(), getStudents(),
      getCommunities(), getCommunityEvents(), getCommunityFinances(), getCommunityMembers(),
      getAlumniJobs(), getRentalAgencies(), getCars(), getPosProducts(), getDailySales(),
      getSaasProducts(), getStockItems(), getPricing(), getStages(), getApplications(),
      getBriefcase(), getInvestors(), getKnowledgeBase(), getCfoData(), getProperties(),
      getSolutions(), getIndustries(), getAiTools()
  ]);

  const initialState: Partial<AppState> | null = settings ? {
      settings, products, storeProducts, providers, opportunities, services, signedLeases,
      stairspaceRequests, stairspaceListings, leadership: staffData.leadership, 
      staff: staffData.staff, agentCategories: staffData.agentCategories,
      raahaAgencies: raahaData.raahaAgencies, raahaWorkers: raahaData.raahaWorkers,
      raahaRequests: raahaData.raahaRequests, beautyCenters: beautyData.beautyCenters,
      beautyServices: beautyData.beautyServices, beautySpecialists: beautyData.beautySpecialists,
      beautyAppointments: beautyData.beautyAppointments, costSettings, assets,
      usedItems, clients, testimonials, giftCards, students, communities,
      communityEvents, communityFinances, communityMembers, alumniJobs,
      rentalAgencies, cars, posProducts, dailySales, saasProducts, stockItems,
      pricing, stages, applications, briefcase, investors, knowledgeBase, cfoData,
      properties, solutions, industries, aiTools
  } : null;

  return (
    <html lang="en" suppressHydrationWarning>
      <head/>
      <body className={cn('min-h-screen bg-background font-sans antialiased', inter.variable)}>
        <Providers initialState={initialState}>
          {children}
        </Providers>
      </body>
    </html>
  );
}
