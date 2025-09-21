
'use server';

import type { Metadata } from 'next';
import { getProperties, getStairspaceListings } from '@/lib/firestore';
import AdminRealEstateClientPage from './client-page';

export const metadata: Metadata = {
    title: "Real Estate Management",
    description: "Manage property listings and utilize real estate AI tools."
};

export default async function AdminRealEstatePage() {
    const [initialProperties, initialStairspaceListings] = await Promise.all([
        getProperties(),
        getStairspaceListings(),
    ]);

    return (
        <AdminRealEstateClientPage
            initialProperties={initialProperties}
            initialStairspaceListings={initialStairspaceListings}
        />
    )
}

