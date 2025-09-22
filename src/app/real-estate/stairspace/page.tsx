
'use server';

import { getStairspaceRequests } from "@/lib/firestore";
import StairspaceRequestsClientPage from "@/app/admin/real-estate/stairspace/client-page";
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "StairSpace Booking Requests",
  description: "View and manage all incoming booking requests for micro-retail spaces.",
};

export default async function StairspaceRequestsPage() {
    const initialRequests = await getStairspaceRequests();
    return <StairspaceRequestsClientPage initialRequests={initialRequests} />
}
