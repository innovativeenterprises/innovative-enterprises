
'use server';

import AgencyDashboardClientPage from './client-page';
import { getBeautyData } from '@/lib/firestore';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Agency Dashboard | RAAHA",
  description: "Manage your domestic workforce agency. View client requests, manage your candidates, and update your agency settings.",
};

export default async function AgencyDashboardPage() {
    const { beautyCenters, beautyServices, beautyAppointments } = await getBeautyData();
    
    return <AgencyDashboardClientPage 
        initialAgencies={beautyCenters}
        initialServices={beautyServices}
        initialAppointments={beautyAppointments}
    />;
}
