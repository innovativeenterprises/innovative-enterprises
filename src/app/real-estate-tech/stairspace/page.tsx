
import { getStairspaceListings } from '@/lib/firestore';
import StairspacePageClient from './client-page';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "StairSpace: Your Micro-Retail Revolution",
  description: "A marketplace that connects property owners with entrepreneurs looking for affordable, flexible, and high-visibility micro-retail and storage spots.",
};

export default async function StairspacePage() {
    const stairspaceListings = await getStairspaceListings();

    return (
        <StairspacePageClient initialListings={stairspaceListings} />
    );
}
