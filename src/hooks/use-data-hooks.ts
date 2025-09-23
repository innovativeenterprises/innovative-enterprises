
'use client';

import { useState, useEffect, useContext } from 'react';
import { StoreContext } from '@/lib/global-store';
import type { AppState } from '@/lib/initial-state';

// A generic hook factory
const createDataHook = <K extends keyof AppState>(key: K) => {
  return (initialData?: AppState[K]) => {
    const store = useContext(StoreContext);
    if (!store) {
      throw new Error('useDataHook must be used within a StoreProvider');
    }
    
    const [data, setData] = useState(initialData ?? store.get()[key]);
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
        const handleStoreChange = () => {
            const newState = store.get()[key];
            // Simple check to avoid unnecessary re-renders
            if (JSON.stringify(data) !== JSON.stringify(newState)) {
                setData(newState);
            }
        };
        
        // Initial sync
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

export const useRaahaData = createDataHook('raahaAgencies');
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
export const usePosData = (initialData?: Partial<{ dailySales: AppState['dailySales'] }>) => {
    const store = useContext(StoreContext);
    if (!store) throw new Error('usePosData must be used within a StoreProvider');

    const [dailySales, setDailySales] = useState(initialData?.dailySales ?? store.get().dailySales);
    const [isClient, setIsClient] = useState(false);
    useEffect(() => {
        setIsClient(true);
        const handleStoreChange = () => {
            setDailySales(store.get().dailySales);
        };
        handleStoreChange();
        const unsubscribe = store.subscribe(handleStoreChange);
        return () => unsubscribe();
    }, [store]);

    const setGlobalDailySales = (updater: React.SetStateAction<AppState['dailySales']>) => {
        store.set(s => ({ ...s, dailySales: typeof updater === 'function' ? updater(s.dailySales) : updater }));
    };

    return { dailySales, setDailySales: setGlobalDailySales, isClient };
};

export const useSaasProductsData = createDataHook('saasProducts');
export const useStockItemsData = createDataHook('stockItems');
export const usePricingData = createDataHook('pricing');
export const useStagesData = createDataHook('stages');
export const useApplicationsData = createDataHook('applications');
export const useBriefcaseData = (initialData?: AppState['briefcase']) => {
    const store = useContext(StoreContext);
    if (!store) throw new Error('useBriefcaseData must be used within a StoreProvider');
    
    const [data, setData] = useState(initialData ?? store.get().briefcase);
    const [isClient, setIsClient] = useState(false);
    
    useEffect(() => {
        setIsClient(true);
        const handleStoreChange = () => {
            const newState = store.get().briefcase;
            if (JSON.stringify(data) !== JSON.stringify(newState)) {
                setData(newState);
            }
        };
        handleStoreChange();
        const unsubscribe = store.subscribe(handleStoreChange);
        return () => unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [store]);

    const setGlobalData = (updater: React.SetStateAction<AppState['briefcase']>) => {
         store.set(s => ({ ...s, briefcase: typeof updater === 'function' ? updater(s.briefcase) : updater }));
    };

    return { data, setData: setGlobalData, isClient };
};

export const useInvestorsData = createDataHook('investors');
export const useKnowledgeBaseData = createDataHook('knowledgeBase');
export const useCfoData = (initialData?: AppState['cfoData']) => {
    const store = useContext(StoreContext);
    if (!store) throw new Error('useCfoData must be used within a StoreProvider');

    const [data, setData] = useState(initialData ?? store.get().cfoData);
    const [isClient, setIsClient] = useState(false);
    
    useEffect(() => {
        setIsClient(true);
        const handleStoreChange = () => {
            const newState = store.get().cfoData;
            if (JSON.stringify(data) !== JSON.stringify(newState)) {
                setData(newState);
            }
        };
        handleStoreChange();
        const unsubscribe = store.subscribe(handleStoreChange);
        return () => unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [store]);

    const setGlobalData = (updater: React.SetStateAction<AppState['cfoData']>) => {
        store.set(s => ({ ...s, cfoData: typeof updater === 'function' ? updater(s.cfoData) : updater }));
    };
    
    return { data, setData: setGlobalData, isClient };
};

export const usePropertiesData = createDataHook('properties');
export const useSolutionsData = createDataHook('solutions');
export const useIndustriesData = createDataHook('industries');
export const useAiToolsData = createDataHook('aiTools');
