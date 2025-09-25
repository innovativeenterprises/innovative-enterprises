
'use client';

import { useGlobalStore } from '@/lib/global-store.tsx';

// Simplified hook creation
const createDataHook = <T, K extends keyof T>(key: K) => {
  return () => useGlobalStore(state => ({ data: state[key], setData: state.set, isClient: state.isClient }));
};

export const useProductsData = createDataHook('products');
export const useStoreProductsData = createDataHook('storeProducts');
export const useProvidersData = createDataHook('providers');
export const useOpportunitiesData = createDataHook('opportunities');
export const useServicesData = createDataHook('services');
export const useStaffData = createDataHook('leadership' || 'staff' || 'agentCategories');
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
