
'use server';

import type { Metadata } from 'next';
import AdminRealEstateClientPage from './client-page';

export const metadata: Metadata = {
    title: "Real Estate Management",
    description: "Manage property listings and utilize real estate AI tools."
};

export default async function AdminRealEstatePage() {
    // Client-side fetching is now used in the child components,
    // so no need to pre-fetch data here.
    return (
        <AdminRealEstateClientPage />
    )
}
