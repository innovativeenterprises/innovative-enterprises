
import StairspaceRequestsClientPage from './client-page';
import type { Metadata } from 'next';
import { initialStairspaceListings } from '@/lib/stairspace-listings';
import { initialStairspaceRequests } from '@/lib/stairspace-requests';

export const metadata: Metadata = {
    title: "StairSpace Booking Requests",
    description: "View and manage all incoming booking requests for micro-retail spaces.",
};

export default function StairspaceRequestsPage() {
    // Data is fetched on the server and passed to the client component.
    const listings = initialStairspaceListings;
    const requests = initialStairspaceRequests;
    return <StairspaceRequestsClientPage initialListings={listings} initialRequests={requests} />;
}
