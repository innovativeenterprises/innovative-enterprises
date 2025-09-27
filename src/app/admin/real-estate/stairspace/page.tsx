

'use client';

import StairspaceRequestsClientPage from "./client-page";
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "StairSpace Booking Requests",
  description: "View and manage all incoming booking requests for micro-retail spaces.",
};

export default function StairspaceRequestsPage() {
    return <StairspaceRequestsClientPage />;
}
