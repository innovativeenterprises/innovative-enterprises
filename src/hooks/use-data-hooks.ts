
'use client';

import { useState, useEffect } from 'react';
import type { AppState } from '@/app/lib/initial-state';

// A generic hook factory
const createDataHook = <K extends keyof AppState>(dataKey: K, initialData: AppState[K]) => {
  return (initData?: AppState[K]) => {
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

export const useBriefcaseData = createDataHook<'briefcase'>('briefcase', null);
export const useLeasesData = createDataHook<'signedLeases'>('signedLeases', []);
export const useStairspaceRequestsData = createDataHook<'stairspaceRequests'>('stairspaceRequests', []);
export const useStairspaceListingsData = createDataHook<'stairspaceListings'>('stairspaceListings', []);

export const useRaahaData = () => {
    const [agencies, setAgencies] = useState<AppState['raahaAgencies']>([]);
    const [workers, setWorkers] = useState<AppState['raahaWorkers']>([]);
    const [requests, setRequests] = useState<AppState['raahaRequests']>([]);
    const [isClient, setIsClient] = useState(false);
    useEffect(() => { setIsClient(true) }, []);
    return { agencies, setAgencies, workers, setWorkers, requests, setRequests, isClient };
};

export const useBeautySpecialistsData = createDataHook<'beautySpecialists'>('beautySpecialists', []);
export const useAssetsData = createDataHook<'assets'>('assets', []);
export const useUsedItemsData = createDataHook<'usedItems'>('usedItems', []);
export const useGiftCardsData = createDataHook<'giftCards'>('giftCards', []);
export const useStudentsData = createDataHook<'students'>('students', []);
export const useMembersData = createDataHook<'communityMembers'>('communityMembers', []);
export const useEventsData = createDataHook<'communityEvents'>('communityEvents', []);
export const useFinancesData = createDataHook<'communityFinances'>('communityFinances', []);
export const useCommunitiesData = createDataHook<'communities'>('communities', []);
export const useAlumniJobsData = createDataHook<'alumniJobs'>('alumniJobs', []);
export const useCarsData = createDataHook<'cars'>('cars', []);
export const useRentalAgenciesData = createDataHook<'rentalAgencies'>('rentalAgencies', []);
export const useStockItemsData = createDataHook<'stockItems'>('stockItems', []);
export const useOpportunitiesData = createDataHook<'opportunities'>('opportunities', []);
export const useProvidersData = createDataHook<'providers'>('providers', []);
export const useProductsData = createDataHook<'products'>('products', []);
export const useServicesData = createDataHook<'services'>('services', []);
export const useStaffData = () => {
    const [leadership, setLeadership] = useState<AppState['leadership']>([]);
    const [staff, setStaff] = useState<AppState['staff']>([]);
    const [agentCategories, setAgentCategories] = useState<AppState['agentCategories']>([]);
    const [isClient, setIsClient] = useState(false);
    useEffect(() => { setIsClient(true) }, []);
    return { leadership, setLeadership, staff, setStaff, agentCategories, setAgentCategories, isClient };
};
export const useCartData = createDataHook<'cart'>('cart', []);
export const usePosProductsData = createDataHook<'posProducts'>('posProducts', []);
export const useDailySalesData = createDataHook<'dailySales'>('dailySales', []);
export const useSaaSProductsData = createDataHook<'saasProducts'>('saasProducts', []);
