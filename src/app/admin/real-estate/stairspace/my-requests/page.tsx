
import StairspaceRequestsClientPage from './client-page';
import type { Metadata } from 'next';
import { initialStairspaceRequests } from '@/lib/stairspace-requests';

export const metadata: Metadata = {
    title: "My Booking Requests | StairSpace",
    description: "Track the status of your StairSpace booking requests.",
};

export default function MyStairspaceRequestsPage() {
    // Data is fetched on the server and passed to the client component.
    const requests = initialStairspaceRequests;
    return <StairspaceRequestsClientPage initialRequests={requests} />;
}
