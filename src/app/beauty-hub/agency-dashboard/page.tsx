
import AgencyDashboardClient from './client-page';
import { initialBeautyCenters } from '@/lib/beauty-centers';
import { initialBeautyServices } from '@/lib/beauty-services';
import { initialBeautyAppointments } from '@/lib/beauty-appointments';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Agency Dashboard | Beauty & Wellness Hub",
  description: "Manage your salon or spa. View appointments, manage services, and update your settings.",
};

export default async function AgencyDashboardPage() {
    // In a real app, these would be Firestore fetches.
    const agencies = initialBeautyCenters;
    const services = initialBeautyServices;
    const appointments = initialBeautyAppointments;

    return <AgencyDashboardClient 
        initialAgencies={agencies}
        initialServices={services}
        initialAppointments={appointments}
    />;
}
