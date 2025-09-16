
import { initialStairspaceRequests } from '@/lib/stairspace-requests';
import StairspaceRequestsClientPage from './client-page';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: "My Booking Requests | StairSpace",
    description: "Track the status of your StairSpace booking requests.",
};

export default function MyStairspaceRequestsPage() {
    return <StairspaceRequestsClientPage initialRequests={initialStairspaceRequests} />;
}
