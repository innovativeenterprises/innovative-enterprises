
'use client';

import AgencyDashboardClientPage from '@/components/agency-dashboard/client-page';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Admin - RAAHA Agency Dashboard",
  description: "Manage your domestic workforce agency. View client requests, manage your candidates, and update your agency settings.",
};

export default function AdminRaahaPage() {
    return <AgencyDashboardClientPage dashboardType="raaha" />;
}
