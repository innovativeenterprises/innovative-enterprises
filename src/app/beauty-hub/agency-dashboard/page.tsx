import AgencyDashboardClient from './client-page';
import { getBeautyData } from '@/lib/firestore';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Agency Dashboard | Beauty & Wellness Hub",
  description: "Manage your salon or spa. View appointments, manage services, and update your settings.",
};

export default async function AgencyDashboardPage() {
    const { beautyCenters, beautyServices, beautyAppointments } = await getBeautyData();

    return <AgencyDashboardClient 
        initialAgencies={beautyCenters}
        initialServices={beautyServices}
        initialAppointments={beautyAppointments}
    />;
}
