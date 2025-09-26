
'use server';

import type { Metadata } from 'next';
import AgencyDashboardClientPage from '@/components/agency-dashboard/client-page';

export const metadata: Metadata = {
  title: "Agency Dashboard | Beauty & Wellness Hub",
  description: "Manage your salon, staff, and client appointments.",
};


export default async function AgencyDashboardPage() {
    return <AgencyDashboardClientPage dashboardType="beauty" />;
}
