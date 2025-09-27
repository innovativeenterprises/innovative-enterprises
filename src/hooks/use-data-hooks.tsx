
'use client';

import { useContext } from 'react';
import { useStore as useZustandStore } from 'zustand';
import type { AppState } from '@/lib/initial-state';
import { StoreContext } from '@/lib/global-store';

// This custom hook simplifies accessing the store and its setter.
function useStore<T>(selector: (state: AppState) => T): T {
  const store = useContext(StoreContext);
  if (!store) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return useZustandStore(store, selector);
}

// This custom hook simplifies accessing the `set` function of the store.
function useSetStore() {
    const store = useContext(StoreContext);
    if (!store) {
        throw new Error('useSetStore must be used within a StoreProvider');
    }
    return store.getState().set;
}

const createDataHook = <K extends keyof AppState>(key: K) => {
  return (initialData?: AppState[K]) => {
    const data = useStore((state) => state[key]);
    const set = useSetStore();
    
    // The useEffect was removed as it's not the correct pattern for initializing store data.
    // The store is now initialized in the Providers component.

    const setData = (updater: (prev: AppState[K]) => AppState[K]) => {
      set((state) => ({ ...state, [key]: updater(state[key]) }));
    };
    const isClient = useStore((state) => state.isClient);
    return { data: data as AppState[K], setData, isClient };
  };
};

export const useCartData = createDataHook('cart');
export const useStairspaceRequestsData = createDataHook('stairspaceRequests');
export const useRequestsData = createDataHook('raahaRequests');
export const useProductsData = createDataHook('products');
export const useStoreProductsData = createDataHook('storeProducts');
export const useProvidersData = createDataHook('providers');
export const useOpportunitiesData = createDataHook('opportunities');
export const useServicesData = createDataHook('services');
export const useCfoData = createDataHook('cfoData');
export const useAssetsData = createDataHook('assets');
export const usePropertiesData = createDataHook('properties');
export const useStairspaceListingsData = createDataHook('stairspaceListings');
export const useLeasesData = createDataHook('signedLeases');
export const useStockItemsData = createDataHook('stockItems');
export const useGiftCardsData = createDataHook('giftCards');
export const useStudentsData = createDataHook('students');
export const useCommunitiesData = createDataHook('communities');
export const useCommunityEventsData = createDataHook('communityEvents');
export const useCommunityFinancesData = createDataHook('communityFinances');
export const useMembersData = createDataHook('communityMembers');
export const useAlumniJobsData = createDataHook('alumniJobs');
export const useCarsData = createDataHook('cars');
export const useRentalAgenciesData = createDataHook('rentalAgencies');
export const usePosProductsData = createDataHook('posProducts');
export const useBriefcaseData = createDataHook('briefcase');
export const useKnowledgeBaseData = createDataHook('knowledgeBase');
export const useClientsData = createDataHook('clients');
export const useTestimonialsData = createDataHook('testimonials');
export const useStagesData = createDataHook('stages');
export const useAgenciesData = createDataHook('raahaAgencies');
export const useWorkersData = createDataHook('raahaWorkers');
export const useBeautyCentersData = createDataHook('beautyCenters');
export const useBeautySpecialistsData = createDataHook('beautySpecialists');
export const useBeautyServicesData = createDataHook('beautyServices');
export const useBeautyAppointmentsData = createDataHook('beautyAppointments');
export const useUsedItemsData = createDataHook('usedItems');
export const useSettingsData = createDataHook('settings');
export const useCostSettingsData = createDataHook('costSettings');
export const usePricingData = createDataHook('pricing');
export const useApplicationsData = createDataHook('applications');
export const useAiToolsData = createDataHook('aiTools');
export const useSolutionsData = createDataHook('solutions');
export const useIndustriesData = createDataHook('industries');
export const useDailySalesData = createDataHook('dailySales');
export const useUserDocumentsData = createDataHook('userDocuments');
export const useSaaSProductsData = createDataHook('saasProducts');

export const useStaffData = () => {
    const leadership = useStore((state) => state.leadership);
    const staff = useStore((state) => state.staff);
    const agentCategories = useStore((state) => state.agentCategories);
    const isClient = useStore((state) => state.isClient);
    return { leadership, staff, agentCategories, isClient };
};

export { useStore as useGlobalStore, useSetStore };
