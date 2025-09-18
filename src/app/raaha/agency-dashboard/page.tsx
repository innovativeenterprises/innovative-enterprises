

import AgencyDashboardClient from './client-page';
import { getRaahaData } from '@/lib/firestore';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Agency Dashboard | RAAHA",
  description: "Manage your domestic workforce agency. View client requests, manage your candidates, and update your agency settings.",
};

export default async function AgencyDashboardPage() {
    const { raahaAgencies, raahaWorkers, raahaRequests } = await getRaahaData();

    return <AgencyDashboardClient 
        initialAgencies={raahaAgencies}
        initialWorkers={raahaWorkers}
        initialRequests={raahaRequests}
    />;
}
