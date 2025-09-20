
'use server';

import AgencyDashboardClientPage from './client-page';
import { getBeautyData } from '@/lib/firestore';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Agency Dashboard | Beauty & Wellness Hub",
  description: "Manage your salon or spa. View client appointments, manage your staff, and update your service offerings.",
};

export default async function AgencyDashboardPage() {
    const { beautyCenters, beautyServices, beautyAppointments } = await getBeautyData();
    
    return <AgencyDashboardClientPage 
        initialAgencies={beautyCenters}
        initialServices={beautyServices}
        initialAppointments={beautyAppointments}
    />;
}
