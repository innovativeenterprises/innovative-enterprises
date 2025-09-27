
'use server';

import MyRequestsClientPage from './client-page';
import type { Metadata } from 'next';
import { getStairspaceRequests } from '@/lib/firestore';

export const metadata: Metadata = {
  title: "My Booking Requests | StairSpace",
  description: "Track the status of your StairSpace booking requests.",
};


export default async function MyRequestsPage() {
    const requests = await getStairspaceRequests();
    return <MyRequestsClientPage initialRequests={requests} />;
}
