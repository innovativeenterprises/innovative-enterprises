
'use client';

import { useState, useEffect } from 'react';
import { store } from '@/app/lib/global-store.tsx';
import type { AppState } from '@/app/lib/global-store.tsx';

// A generic hook factory
const createDataHook = <T,>(dataKey: keyof AppState, initialData: T) => {
  return (initData?: T) => {
    const [data, setData] = useState(initData ?? initialData);
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
      setIsClient(true);
      // If server-provided data is different, update state
      if (initData && JSON.stringify(initData) !== JSON.stringify(data)) {
        setData(initData);
      }
    }, [initData, data]);

    return { data, setData, isClient };
  };
};

export const useSettingsData = (initialData: AppState['settings'] | null = null) => {
    const [settings, setSettings] = useState(initialData);
    const [isClient, setIsClient] = useState(false);
    useEffect(() => { setIsClient(true); if(initialData) setSettings(initialData) }, [initialData]);
    return { settings, setSettings, isClient };
};

export const useBriefcaseData = createDataHook<AppState['briefcase']>('briefcase', null);
export const useLeasesData = createDataHook<AppState['signedLeases']>('signedLeases', []);
export const useStairspaceRequestsData = createDataHook<AppState['stairspaceRequests']>('stairspaceRequests', []);
export const useStairspaceListingsData = createDataHook<AppState['stairspaceListings']>('stairspaceListings', []);
export const useAgenciesData = createDataHook<AppState['raahaAgencies']>('raahaAgencies', []);
export const useWorkersData = createDataHook<AppState['raahaWorkers']>('raahaWorkers', []);
export const useRequestsData = createDataHook<AppState['raahaRequests']>('raahaRequests', []);
export const useBeautyData = () => {
    const [agencies, setAgencies] = useState<AppState['beautyCenters']>([]);
    const [services, setServices] = useState<AppState['beautyServices']>([]);
    const [appointments, setAppointments] = useState<AppState['beautyAppointments']>([]);
    const [isClient, setIsClient] = useState(false);
    useEffect(() => { setIsClient(true) }, []);
    return { agencies, setAgencies, services, setServices, appointments, setAppointments, isClient };
};
export const useBeautySpecialistsData = createDataHook<AppState['beautySpecialists']>('beautySpecialists', []);
export const useAssetsData = createDataHook<AppState['assets']>('assets', []);
export const useUsedItemsData = createDataHook<AppState['usedItems']>('usedItems', []);
export const useGiftCardsData = createDataHook<AppState['giftCards']>('giftCards', []);
export const useStudentsData = createDataHook<AppState['students']>('students', []);
export const useMembersData = createDataHook<AppState['communityMembers']>('communityMembers', []);
export const useEventsData = createDataHook<AppState['communityEvents']>('communityEvents', []);
export const useFinancesData = createDataHook<AppState['communityFinances']>('communityFinances', []);
export const useCommunitiesData = createDataHook<AppState['communities']>('communities', []);
export const useAlumniJobsData = createDataHook<AppState['alumniJobs']>('alumniJobs', []);
export const useCarsData = createDataHook<AppState['cars']>('cars', []);
export const useRentalAgenciesData = createDataHook<AppState['rentalAgencies']>('rentalAgencies', []);
export const useStockItemsData = createDataHook<AppState['stockItems']>('stockItems', []);
export const useOpportunitiesData = createDataHook<AppState['opportunities']>('opportunities', []);
