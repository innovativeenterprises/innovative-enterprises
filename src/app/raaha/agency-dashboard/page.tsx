

'use client';

import AgencyDashboardClient from './client-page';
import { initialAgencies } from '@/lib/raaha-agencies';
import { initialWorkers } from '@/lib/raaha-workers';
import { initialRequests } from '@/lib/raaha-requests';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Agency Dashboard | RAAHA",
  description: "Manage your domestic workforce agency. View client requests, manage your candidates, and update your agency settings.",
};

export default function AgencyDashboardPage() {
    const agencies = initialAgencies;
    const workers = initialWorkers;
    const requests = initialRequests;

    return <AgencyDashboardClient 
        initialAgencies={agencies}
        initialWorkers={workers}
        initialRequests={requests}
    />;
}
