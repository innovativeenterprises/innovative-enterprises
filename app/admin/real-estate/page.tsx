
import type { Metadata } from 'next';
import { getProperties, getStairspaceListings } from '@/lib/firestore';
import AdminRealEstateClientPage from './client-page';

export const metadata: Metadata = {
    title: "Real Estate Management",
    description: "Manage property listings and utilize real estate AI tools."
};

export default async function AdminRealEstatePage() {
    // Data is fetched here to ensure it's available for the initial state of the global store,
    // but we no longer need to pass it down as props.
    await Promise.all([
        getProperties(),
        getStairspaceListings(),
    ]);

    return (
        <AdminRealEstateClientPage />
    )
}
