
'use client';

import { useContext, useEffect } from 'react';
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

const useCreateDataHook = <K extends keyof AppState>(key: K) => {
  return (initialData?: AppState[K]) => {
    const data = useStore((state) => state[key]);
    const set = useSetStore();

    useEffect(() => {
        if (initialData) {
            set((state) => ({ ...state, [key]: initialData }));
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const setData = (updater: (prev: AppState[K]) => AppState[K]) => {
      set((state) => ({ ...state, [key]: updater(state[key]) }));
    };
    const isClient = useStore((state) => state.isClient);
    return { data: data as AppState[K], setData, isClient };
  };
};

export const useCartData = useCreateDataHook('cart');
export const useStairspaceRequestsData = useCreateDataHook('stairspaceRequests');
export const useRequestsData = useCreateDataHook('raahaRequests');
export const useProductsData = useCreateDataHook('products');
export const useStoreProductsData = useCreateDataHook('storeProducts');
export const useProvidersData = useCreateDataHook('providers');
export const useOpportunitiesData = useCreateDataHook('opportunities');
export const useServicesData = useCreateDataHook('services');
export const useCfoData = useCreateDataHook('cfoData');
export const useAssetsData = useCreateDataHook('assets');
export const usePropertiesData = useCreateDataHook('properties');
export const useStairspaceListingsData = useCreateDataHook('stairspaceListings');
export const useLeasesData = useCreateDataHook('signedLeases');
export const useStockItemsData = useCreateDataHook('stockItems');
export const useGiftCardsData = useCreateDataHook('giftCards');
export const useStudentsData = useCreateDataHook('students');
export const useCommunitiesData = useCreateDataHook('communities');
export const useCommunityEventsData = useCreateDataHook('communityEvents');
export const useCommunityFinancesData = useCreateDataHook('communityFinances');
export const useMembersData = useCreateDataHook('communityMembers');
export const useAlumniJobsData = useCreateDataHook('alumniJobs');
export const useCarsData = useCreateDataHook('cars');
export const useRentalAgenciesData = useCreateDataHook('rentalAgencies');
export const usePosProductsData = useCreateDataHook('posProducts');
export const useBriefcaseData = useCreateDataHook('briefcase');
export const useKnowledgeBaseData = useCreateDataHook('knowledgeBase');
export const useClientsData = useCreateDataHook('clients');
export const useTestimonialsData = useCreateDataHook('testimonials');
export const useStagesData = useCreateDataHook('stages');
export const useAgenciesData = useCreateDataHook('raahaAgencies');
export const useWorkersData = useCreateDataHook('raahaWorkers');
export const useBeautyCentersData = useCreateDataHook('beautyCenters');
export const useBeautySpecialistsData = useCreateDataHook('beautySpecialists');
export const useBeautyServicesData = useCreateDataHook('beautyServices');
export const useBeautyAppointmentsData = useCreateDataHook('beautyAppointments');
export const useUsedItemsData = useCreateDataHook('usedItems');
export const useSettingsData = useCreateDataHook('settings');
export const useCostSettingsData = useCreateDataHook('costSettings');
export const usePricingData = useCreateDataHook('pricing');
export const useApplicationsData = useCreateDataHook('applications');
export const useAiToolsData = useCreateDataHook('aiTools');
export const useSolutionsData = useCreateDataHook('solutions');
export const useIndustriesData = useCreateDataHook('industries');
export const useDailySalesData = useCreateDataHook('dailySales');
export const useUserDocumentsData = useCreateDataHook('userDocuments');
export const useSaaSProductsData = useCreateDataHook('saasProducts');

export const useStaffData = () => {
    const leadership = useStore((state) => state.leadership);
    const staff = useStore((state) => state.staff);
    const agentCategories = useStore((state) => state.agentCategories);
    const isClient = useStore((state) => state.isClient);
    return { leadership, staff, agentCategories, isClient };
};

export { useStore as useGlobalStore, useSetStore };
