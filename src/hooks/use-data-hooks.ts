
'use client';

import { useGlobalStore, useSetStore as useZustandSetStore } from '@/lib/global-store.tsx';
import type { AppState } from '@/lib/initial-state';

const createDataHook = <K extends keyof AppState>(key: K) => {
  return () => {
    const data = useGlobalStore(state => state[key]);
    const isClient = useGlobalStore(state => state.isClient);
    const setData = useZustandSetStore();

    return { data: data as AppState[K], setData, isClient };
  };
};

export const useProductsData = createDataHook('products');
export const useStoreProductsData = createDataHook('storeProducts');
export const useProvidersData = createDataHook('providers');
export const useOpportunitiesData = createDataHook('opportunities');
export const useServicesData = createDataHook('services');

export const useStaffData = () => {
    const data = useGlobalStore(state => ({
        leadership: state.leadership,
        staff: state.staff,
        agentCategories: state.agentCategories,
    }));
    const isClient = useGlobalStore(state => state.isClient);
    return { ...data, isClient };
};

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
export const useApplicationsData = createDataHook('applications');
export const useAiToolsData = createDataHook('aiTools');
export const useSolutionsData = createDataHook('solutions');
export const useIndustriesData = createDataHook('industries');
export const useDailySalesData = createDataHook('dailySales');
export const useUserDocumentsData = createDataHook('userDocuments');
export const useSaaSProductsData = createDataHook('saasProducts');
export { useSetStore } from '@/lib/global-store.tsx';
