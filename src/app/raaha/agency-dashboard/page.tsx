

'use client';

import AgencyDashboardClientPage from '@/components/agency-dashboard/client-page';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: "Agency Dashboard | RAAHA",
    description: "Manage your domestic workforce agency. View client requests, manage your candidates, and update your agency settings.",
};

export default function AdminRaahaAgencyDashboardPage() {
    return <AgencyDashboardClientPage dashboardType="raaha" />;
}
