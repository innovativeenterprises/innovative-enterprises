
'use server';

import AgencyDashboardClientPage from '@/app/beauty-hub/agency-dashboard/client-page';
import { getBeautyCenters, getBeautyServices, getBeautyAppointments } from '@/lib/firestore';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Admin - Beauty & Wellness Hub",
  description: "Manage your salon, staff, and client appointments.",
};


export default async function AdminBeautyHubPage() {
    const [agencies, services, appointments] = await Promise.all([
        getBeautyCenters(),
        getBeautyServices(),
        getBeautyAppointments()
    ]);

    return <AgencyDashboardClientPage 
        initialAgencies={agencies} 
        initialServices={services} 
        initialAppointments={appointments} 
    />;
}
