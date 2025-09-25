
'use server';

import AgencyDashboardClientPage from '@/app/admin/beauty-hub/agency-dashboard/client-page';
import { getRaahaData } from '@/lib/firestore';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Admin - RAAHA Agency Dashboard",
  description: "Manage your domestic workforce agency. View client requests, manage your candidates, and update your agency settings.",
};

export default async function AdminRaahaPage() {
    const { raahaAgencies, raahaWorkers, raahaRequests } = await getRaahaData();
    return <AgencyDashboardClientPage 
        initialAgencies={raahaAgencies} 
        initialRequests={raahaRequests} 
        initialWorkers={raahaWorkers} 
        dashboardType="raaha"
    />;
}
