
'use client';

import AgencyDashboardClientPage from '@/components/agency-dashboard/client-page';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Admin - Beauty & Wellness Hub",
  description: "Manage your salon, staff, and client appointments.",
};


export default function AdminBeautyHubPage() {
    return <AgencyDashboardClientPage dashboardType="beauty" />;
}
