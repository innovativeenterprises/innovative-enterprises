'use server';

import StairspaceRequestsClientPage from "./client-page";
import { getStairspaceRequests } from "@/lib/firestore";
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "StairSpace Booking Requests",
  description: "View and manage all incoming booking requests for micro-retail spaces.",
};

export default async function StairspaceRequestsPage() {
    const initialRequests = await getStairspaceRequests();
    return <StairspaceRequestsClientPage initialRequests={initialRequests} />;
}
