
'use client';

import type { Metadata } from 'next';
import AgencyDashboardClientPage from '@/components/agency-dashboard/client-page';

export const metadata: Metadata = {
  title: "Agency Dashboard | Beauty & Wellness Hub",
  description: "Manage your salon, staff, and client appointments.",
};


export default function AgencyDashboardPage() {
    return <AgencyDashboardClientPage dashboardType="beauty" />;
}
