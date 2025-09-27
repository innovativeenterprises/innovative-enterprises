
'use server';

import { getStairspaceListings } from "@/lib/firestore";
import StairspaceDetailClientPage from "./client-page";
import type { Metadata } from 'next';

export async function generateStaticParams() {
    const listings = await getStairspaceListings();
    return listings.map((listing) => ({
        id: listing.id,
    }));
}

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const listings = await getStairspaceListings();
  const listing = listings.find(l => l.id === params.id);

  if (!listing) {
    return {
      title: 'Listing Not Found',
    };
  }

  return {
    title: `${listing.title} | StairSpace`,
    description: listing.description,
  };
}


export default async function StairspaceDetailPage({ params }: { params: { id: string } }) {
    const listings = await getStairspaceListings();
    const listing = listings.find(p => p.id === params.id);
    
    return <StairspaceDetailClientPage listing={listing} />;
}
