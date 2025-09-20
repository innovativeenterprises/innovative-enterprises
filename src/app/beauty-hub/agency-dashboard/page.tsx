'use client';

import AgencyDashboardClientPage from './client-page';
import { useBeautyData } from '@/hooks/use-global-store-data';

export default function AgencyDashboardPage() {
    const { agencies, services, appointments } = useBeautyData();
    
    return <AgencyDashboardClientPage 
        initialAgencies={agencies}
        initialServices={services}
        initialAppointments={appointments}
    />;
}
