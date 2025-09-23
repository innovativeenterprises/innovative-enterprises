
'use client';

import { useState, useEffect } from 'react';
import type { AppState } from '@/lib/initial-state';
import { getEmptyState } from '@/lib/initial-state';

// A generic hook factory
const createDataHook = <K extends keyof AppState>(key: K, initialData: AppState[K] | null = null) => {
  return (initData?: AppState[K] | null) => {
    const [data, setData] = useState(initData ?? initialData ?? getEmptyState()[key]);
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
      setIsClient(true);
      if (initData && JSON.stringify(initData) !== JSON.stringify(data)) {
        setData(initData);
      }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [initData]);
    
    // Type assertion to ensure the correct type is returned
    return { data, setData, isClient } as { 
      data: AppState[K]; 
      setData: React.Dispatch<React.SetStateAction<AppState[K]>>;
      isClient: boolean;
    };
  };
};

// Create specific hooks for each part of the state
export const useSettingsData = createDataHook('settings');
export const useCartData = createDataHook('cart');
export const useProductsData = createDataHook('products');
export const useStoreProductsData = createDataHook('storeProducts');
export const useProvidersData = createDataHook('providers');
export const useOpportunitiesData = createDataHook('opportunities');
export const useServicesData = createDataHook('services');
export const useLeasesData = createDataHook('signedLeases');
export const useStairspaceRequestsData = createDataHook('stairspaceRequests');
export const useStairspaceListingsData = createDataHook('stairspaceListings');
export const useStaffData = (initialData?: Partial<{ leadership: AppState['leadership'], staff: AppState['staff'], agentCategories: AppState['agentCategories'] }>) => {
    const emptyState = getEmptyState();
    const [data, setData] = useState({
        leadership: initialData?.leadership ?? emptyState.leadership,
        staff: initialData?.staff ?? emptyState.staff,
        agentCategories: initialData?.agentCategories ?? emptyState.agentCategories,
    });
    const [isClient, setIsClient] = useState(false);
    useEffect(() => { setIsClient(true); }, []);
    return { ...data, setData, isClient };
};
export const useRaahaData = createDataHook('raahaAgencies'); // Example, you'd create for workers/requests too
export const useAgenciesData = createDataHook('raahaAgencies');
export const useWorkersData = createDataHook('raahaWorkers');
export const useRequestsData = createDataHook('raahaRequests');

export const useBeautyData = (initialData?: Partial<{ 
    centers: AppState['beautyCenters'], 
    services: AppState['beautyServices'], 
    specialists: AppState['beautySpecialists'], 
    appointments: AppState['beautyAppointments'] 
}>) => {
    const emptyState = getEmptyState();
    const [agencies, setAgencies] = useState(initialData?.centers ?? emptyState.beautyCenters);
    const [services, setServices] = useState(initialData?.services ?? emptyState.beautyServices);
    const [specialists, setSpecialists] = useState(initialData?.specialists ?? emptyState.beautySpecialists);
    const [appointments, setAppointments] = useState(initialData?.appointments ?? emptyState.beautyAppointments);
    const [isClient, setIsClient] = useState(false);
    useEffect(() => { setIsClient(true); }, []);

    return { 
        agencies, setAgencies, 
        services, setServices, 
        specialists, setSpecialists, 
        appointments, setAppointments, 
        isClient 
    };
};
export const useBeautySpecialistsData = createDataHook('beautySpecialists');
export const useCostSettingsData = createDataHook('costSettings');
export const useAssetsData = createDataHook('assets');
export const useUsedItemsData = createDataHook('usedItems');
export const useClientsData = createDataHook('clients');
export const useTestimonialsData = createDataHook('testimonials');
export const useGiftCardsData = createDataHook('giftCards');
export const useStudentsData = createDataHook('students');
export const useCommunitiesData = createDataHook('communities');
export const useCommunityEventsData = createDataHook('communityEvents');
export const useCommunityFinancesData = createDataHook('communityFinances');
export const useCommunityMembersData = createDataHook('communityMembers');
export const useAlumniJobsData = createDataHook('alumniJobs');
export const useRentalAgenciesData = createDataHook('rentalAgencies');
export const useCarsData = createDataHook('cars');
export const usePosProductsData = createDataHook('posProducts');
export const usePosData = (initialData?: Partial<{ dailySales: AppState['dailySales'] }>) => {
    const emptyState = getEmptyState();
    const [dailySales, setDailySales] = useState(initialData?.dailySales ?? emptyState.dailySales);
    const [isClient, setIsClient] = useState(false);
    useEffect(() => { setIsClient(true); }, []);
    return { dailySales, setDailySales, isClient };
};
export const useSaasProductsData = createDataHook('saasProducts');
export const useStockItemsData = createDataHook('stockItems');
export const usePricingData = createDataHook('pricing');
export const useStagesData = createDataHook('stages');
export const useApplicationsData = createDataHook('applications');
export const useBriefcaseData = (initialData?: AppState['briefcase']) => {
    const [data, setData] = useState(initialData ?? getEmptyState().briefcase);
    const [isClient, setIsClient] = useState(false);
    useEffect(() => { setIsClient(true); }, []);
    return { data, setData, isClient };
};
export const useInvestorsData = createDataHook('investors');
export const useKnowledgeBaseData = createDataHook('knowledgeBase');
export const useCfoData = createDataHook('cfoData');
export const usePropertiesData = createDataHook('properties');
export const useSolutionsData = createDataHook('solutions');
export const useIndustriesData = createDataHook('industries');
export const useAiToolsData = createDataHook('aiTools');
