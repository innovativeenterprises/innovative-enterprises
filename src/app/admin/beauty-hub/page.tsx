
'use client';

import AgencyDashboardClientPage from '@/app/beauty-hub/agency-dashboard/client-page';
import { useBeautyData } from '@/hooks/use-global-store-data';

export default function AdminBeautyHubPage() {
    const { agencies, services, appointments, isClient } = useBeautyData();

    if (!isClient) {
        return <div>Loading...</div>; // Or a skeleton loader
    }
    
    return <AgencyDashboardClientPage 
        initialAgencies={agencies}
        initialServices={services}
        initialAppointments={appointments}
    />;
}
