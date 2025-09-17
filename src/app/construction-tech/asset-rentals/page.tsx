
import { getAssets } from '@/lib/firestore';
import AssetRentalsClientPage from './client-page';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'InfraRent | On-demand IT Equipment Rentals',
    description: 'On-demand rental of IT equipment like servers, workstations, and networking gear for events and projects.'
}

export default async function AssetRentalsPage() {
    const assets = await getAssets();
    return <AssetRentalsClientPage initialAssets={assets} />;
}
