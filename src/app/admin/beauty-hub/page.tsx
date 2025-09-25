
'use server';

import AgencyDashboardClientPage from '@/app/raaha/agency-dashboard/client-page';
import { getBeautyData } from '@/lib/firestore';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Admin - Beauty & Wellness Hub",
  description: "Manage your salon, staff, and client appointments.",
};


export default async function AdminBeautyHubPage() {
    const { beautyCenters, beautyServices, beautyAppointments, beautySpecialists } = await getBeautyData();
    return <AgencyDashboardClientPage 
        initialAgencies={beautyCenters} 
        initialServices={beautyServices} 
        initialAppointments={beautyAppointments}
        initialSpecialists={beautySpecialists}
        dashboardType="beauty"
    />;
}
