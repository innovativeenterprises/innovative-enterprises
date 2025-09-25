
'use client';

import { useGlobalStore } from '@/lib/global-store.tsx';
import type { AppState } from '@/lib/initial-state';

// Simplified hook creation
const createDataHook = <K extends keyof AppState>(key: K) => {
  return () => {
    const data = useGlobalStore(state => state[key]) as AppState[K];
    const setData = useGlobalStore(state => state.set);
    const isClient = useGlobalStore(state => state.isClient);

    const setKeyData = (updater: (prev: AppState[K]) => AppState[K]) => {
      setData(state => ({ ...state, [key]: updater(state[key]) }));
    };

    return { data, setData: setKeyData, isClient };
  };
};

export const useProductsData = createDataHook('products');
export const useStoreProductsData = createDataHook('storeProducts');
export const useProvidersData = createDataHook('providers');
export const useOpportunitiesData = createDataHook('opportunities');
export const useServicesData = createDataHook('services');
export const useStaffData = () => ({
  leadership: useGlobalStore(state => state.leadership),
  staff: useGlobalStore(state => state.staff),
  agentCategories: useGlobalStore(state => state.agentCategories),
  setData: useGlobalStore(state => state.set),
  isClient: useGlobalStore(state => state.isClient)
});
export const useCfoData = createDataHook('cfoData');
export const useAssetsData = createDataHook('assets');
export const usePropertiesData = createDataHook('properties');
export const useStairspaceListingsData = createDataHook('stairspaceListings');
export const useStairspaceRequestsData = createDataHook('stairspaceRequests');
export const useLeasesData = createDataHook('signedLeases');
export const useStockItemsData = createDataHook('stockItems');
export const useGiftCardsData = createDataHook('giftCards');
export const useStudentsData = createDataHook('students');
export const useCommunitiesData = createDataHook('communities');
export const useCommunityEventsData = createDataHook('communityEvents');
export const useMembersData = createDataHook('communityMembers');
export const useAlumniJobsData = createDataHook('alumniJobs');
export const useCarsData = createDataHook('cars');
export const usePosProductsData = createDataHook('posProducts');
export const useBriefcaseData = createDataHook('briefcase');
export const useKnowledgeBaseData = createDataHook('knowledgeBase');
export const useClientsData = createDataHook('clients');
export const useTestimonialsData = createDataHook('testimonials');
export const useStagesData = createDataHook('stages');
export const useRequestsData = createDataHook('raahaRequests');
export const useAgenciesData = createDataHook('raahaAgencies');
export const useWorkersData = createDataHook('raahaWorkers');
export const useBeautyCentersData = createDataHook('beautyCenters');
export const useBeautySpecialistsData = createDataHook('beautySpecialists');
export const useBeautyServicesData = createDataHook('beautyServices');
export const useBeautyAppointmentsData = createDataHook('beautyAppointments');
export const useUsedItemsData = createDataHook('usedItems');
export const useCartData = createDataHook('cart');
export const useSettingsData = createDataHook('settings');
export const useCostSettingsData = createDataHook('costSettings');
export const usePricingData = createDataHook('pricing');
