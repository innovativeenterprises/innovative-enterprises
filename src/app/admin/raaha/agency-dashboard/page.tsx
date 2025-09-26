
'use server';

import AgencyDashboardClientPage from '@/components/agency-dashboard/client-page';
import { getRaahaData } from '@/lib/firestore';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Agency Dashboard | RAAHA",
  description: "Manage your domestic workforce agency. View client requests, manage your candidates, and update your agency settings.",
};

export default async function AgencyDashboardPage() {
    // Pre-load data for the client component to use from the store
    await getRaahaData();
    return <AgencyDashboardClientPage dashboardType="raaha" />;
}
