
'use server';

import AdminBeautyHubPage from '@/app/admin/beauty-hub/page';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Agency Dashboard | Beauty & Wellness Hub",
  description: "Manage your salon or spa. View client appointments, manage your staff, and update your service offerings.",
};

export default async function AgencyDashboardPage() {
    return <AdminBeautyHubPage />;
}
