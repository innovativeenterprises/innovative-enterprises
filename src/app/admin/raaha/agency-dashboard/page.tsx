
'use server';

import AgencyDashboardClientPage from '@/app/raaha/agency-dashboard/page';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: "Agency Dashboard | RAAHA",
    description: "Manage your domestic workforce agency. View client requests, manage your candidates, and update your agency settings.",
};

export default function AdminRaahaAgencyDashboardPage() {
    return <AgencyDashboardClientPage />;
}
