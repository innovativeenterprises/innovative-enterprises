
'use server';

import AgencyDashboardClientPage from './client-page';
import { getRaahaAgencies, getRaahaWorkers, getRaahaRequests } from '@/lib/firestore';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Agency Dashboard | RAAHA",
  description: "Manage your domestic workforce agency. View client requests, manage your candidates, and update your agency settings.",
};

export default async function AgencyDashboardPage() {
    const [agencies, workers, requests] = await Promise.all([
      getRaahaAgencies(),
      getRaahaWorkers(),
      getRaahaRequests(),
    ]);
    return <AgencyDashboardClientPage 
        initialAgencies={agencies} 
        initialRequests={requests} 
        initialWorkers={workers} 
    />;
}
