
'use server';

import AgencyDashboardClientPage from './client-page';
import { getBeautyData } from '@/lib/firestore';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Admin - Beauty & Wellness Hub",
  description: "Manage your salon, staff, and client appointments.",
};


export default async function AdminBeautyHubPage() {
    const { beautyCenters, beautyServices, beautyAppointments } = await getBeautyData();

    return <AgencyDashboardClientPage 
        initialAgencies={beautyCenters} 
        initialServices={beautyServices} 
        initialAppointments={beautyAppointments} 
    />;
}
