
import StairspaceRequestsClientPage from './client-page';
import type { Metadata } from 'next';
import { getStairspaceListings, getStairspaceRequests } from '@/lib/firestore';

export const metadata: Metadata = {
    title: "StairSpace Booking Requests",
    description: "View and manage all incoming booking requests for micro-retail spaces.",
};

export default async function StairspaceRequestsPage() {
    const [listings, requests] = await Promise.all([
        getStairspaceListings(),
        getStairspaceRequests()
    ]);
    return <StairspaceRequestsClientPage initialListings={listings} initialRequests={requests} />;
}
