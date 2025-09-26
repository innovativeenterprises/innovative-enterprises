
'use server';

import AgencyDashboardClientPage from '@/components/agency-dashboard/client-page';
import { getBeautyData } from '@/lib/firestore';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Agency Dashboard | Beauty & Wellness Hub",
  description: "Manage your salon, staff, and client appointments.",
};


export default async function AgencyDashboardPage() {
    await getBeautyData();
    return <AgencyDashboardClientPage dashboardType="beauty" />;
}
