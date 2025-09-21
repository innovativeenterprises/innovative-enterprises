
'use server';

import MyStairspaceRequestsClientPage from './client-page';
import { getStairspaceRequests } from '@/lib/firestore';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: "My Booking Requests | StairSpace",
    description: "Track the status of your StairSpace booking requests.",
};

export default async function MyRequestsPage() {
    const requests = await getStairspaceRequests();
    return <MyStairspaceRequestsClientPage initialRequests={requests} />;
}
