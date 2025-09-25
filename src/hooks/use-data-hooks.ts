
'use client';

import { useState, useEffect, useContext } from 'react';
import { StoreContext, type AppState } from '@/lib/global-store';

// A generic hook factory
const createDataHook = <K extends keyof AppState>(key: K) => {
  return (initialData?: AppState[K]) => {
    const store = useContext(StoreContext);
    if (!store) {
      throw new Error(`useDataHook for ${String(key)} must be used within a StoreProvider`);
    }
    
    const [data, setData] = useState(initialData ?? store.get()[key]);
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
        const handleStoreChange = () => {
            const newState = store.get()[key];
            setData(newState);
        };
        
        handleStoreChange();

        const unsubscribe = store.subscribe(handleStoreChange);
        return () => unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [store, key]);

    const setGlobalData = (updater: React.SetStateAction<AppState[K]>) => {
        store.set(s => {
            const newValue = typeof updater === 'function' 
                // @ts-ignore - TS can't infer the type of the updater function correctly
                ? updater(s[key]) 
                : updater;
            return { ...s, [key]: newValue };
        });
    }

    return { data, setData: setGlobalData, isClient } as { 
      data: AppState[K]; 
      setData: (updater: React.SetStateAction<AppState[K]>) => void;
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
    const store = useContext(StoreContext);
    if (!store) throw new Error('useStaffData must be used within a StoreProvider');

    const [data, setData] = useState({
        leadership: initialData?.leadership ?? store.get().leadership,
        staff: initialData?.staff ?? store.get().staff,
        agentCategories: initialData?.agentCategories ?? store.get().agentCategories,
    });
    const [isClient, setIsClient] = useState(false);
    
    useEffect(() => {
        setIsClient(true);
        const handleStoreChange = () => {
             const { leadership, staff, agentCategories } = store.get();
             setData({ leadership, staff, agentCategories });
        };
        handleStoreChange();
        const unsubscribe = store.subscribe(handleStoreChange);
        return () => unsubscribe();
    }, [store]);

    const setGlobalData = (updater: React.SetStateAction<typeof data>) => {
        const newValue = typeof updater === 'function' ? updater(data) : updater;
        store.set(s => ({ ...s, ...newValue }));
    };

    return { ...data, setData: setGlobalData, isClient };
};

export const useRaahaData = createDataHook('raahaAgencies'); // Example, can be more specific if needed
export const useAgenciesData = createDataHook('raahaAgencies');
export const useWorkersData = createDataHook('raahaWorkers');
export const useRequestsData = createDataHook('raahaRequests');
export const useBeautyCentersData = createDataHook('beautyCenters');
export const useBeautyServicesData = createDataHook('beautyServices');
export const useBeautySpecialistsData = createDataHook('beautySpecialists');
export const useBeautyAppointmentsData = createDataHook('beautyAppointments');
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
export const usePosData = createDataHook('dailySales');
export const useSaasProductsData = createDataHook('saasProducts');
export const useStockItemsData = createDataHook('stockItems');
export const usePricingData = createDataHook('pricing');
export const useStagesData = createDataHook('stages');
export const useApplicationsData = createDataHook('applications');
export const useBriefcaseData = createDataHook('briefcase');
export const useInvestorsData = createDataHook('investors');
export const useKnowledgeBaseData = createDataHook('knowledgeBase');
export const useCfoData = createDataHook('cfoData');
export const usePropertiesData = createDataHook('properties');
export const useSolutionsData = createDataHook('solutions');
export const useIndustriesData = createDataHook('industries');
export const useAiToolsData = createDataHook('aiTools');
