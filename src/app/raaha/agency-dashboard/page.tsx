
'use server';

import type { Metadata } from 'next';
import AgencyDashboardClientPage from '@/components/agency-dashboard/client-page';

export const metadata: Metadata = {
  title: "Agency Dashboard | RAAHA",
  description: "Manage your domestic workforce agency. View client requests, manage your candidates, and update your agency settings.",
};

export default async function AgencyDashboardPage() {
    return <AgencyDashboardClientPage dashboardType="raaha" />;
}
