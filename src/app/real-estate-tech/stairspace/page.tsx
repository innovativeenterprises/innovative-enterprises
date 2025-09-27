
'use server';

import StairspaceClientPage from './client-page';
import type { Metadata } from 'next';
import { getStairspaceListings } from '@/lib/firestore';

export const metadata: Metadata = {
    title: "StairSpace | Micro-Retail Revolution",
    description: "A marketplace connecting property owners with entrepreneurs looking for affordable, flexible, and high-visibility micro-retail and storage spots."
};

export default async function StairspacePage() {
    const listings = await getStairspaceListings();
    return <StairspaceClientPage initialListings={listings} />;
}
