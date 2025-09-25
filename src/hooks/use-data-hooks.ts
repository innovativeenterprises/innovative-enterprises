
'use client';

import { useGlobalStore } from '@/lib/global-store.tsx';

// A consistent pattern for creating data hooks from the global store.
const createDataHook = (selector: (state: any) => any) => {
    return () => useGlobalStore(selector);
};

export const useProductsData = createDataHook(state => ({ data: state.products, setData: state.set, isClient: state.isClient }));
export const useStoreProductsData = createDataHook(state => ({ data: state.storeProducts, isClient: state.isClient }));
export const useProvidersData = createDataHook(state => ({ data: state.providers, setData: state.set, isClient: state.isClient }));
export const useOpportunitiesData = createDataHook(state => ({ data: state.opportunities, setData: state.set, isClient: state.isClient }));
export const useServicesData = createDataHook(state => ({ data: state.services, setData: state.set, isClient: state.isClient }));
export const useStaffData = createDataHook(state => ({ leadership: state.leadership, staff: state.staff, agentCategories: state.agentCategories, set: state.set, isClient: state.isClient }));
export const useCfoData = createDataHook(state => ({ data: state.cfoData, setData: state.set, isClient: state.isClient }));
export const useAssetsData = createDataHook(state => ({ data: state.assets, setData: state.set, isClient: state.isClient }));
export const usePropertiesData = createDataHook(state => ({ data: state.properties, setData: state.set, isClient: state.isClient }));
export const useStairspaceListingsData = createDataHook(state => ({ data: state.stairspaceListings, setData: state.set, isClient: state.isClient }));
export const useStairspaceRequestsData = createDataHook(state => ({ data: state.stairspaceRequests, setData: state.set, isClient: state.isClient }));
export const useLeasesData = createDataHook(state => ({ data: state.signedLeases, setData: state.set, isClient: state.isClient }));
export const useStockItemsData = createDataHook(state => ({ data: state.stockItems, setData: state.set, isClient: state.isClient }));
export const useGiftCardsData = createDataHook(state => ({ data: state.giftCards, setData: state.set, isClient: state.isClient }));
export const useStudentsData = createDataHook(state => ({ data: state.students, setData: state.set, isClient: state.isClient }));
export const useCommunitiesData = createDataHook(state => ({ data: state.communities, setData: state.set, isClient: state.isClient }));
export const useCommunityEventsData = createDataHook(state => ({ data: state.communityEvents, setData: state.set, isClient: state.isClient }));
export const useMembersData = createDataHook(state => ({ data: state.communityMembers, setData: state.set, isClient: state.isClient }));
export const useAlumniJobsData = createDataHook(state => ({ data: state.alumniJobs, setData: state.set, isClient: state.isClient }));
export const useCarsData = createDataHook(state => ({ data: state.cars, setData: state.set, isClient: state.isClient }));
export const usePosProductsData = createDataHook(state => ({ data: state.posProducts, setData: state.set, isClient: state.isClient }));
export const useBriefcaseData = createDataHook(state => ({ data: state.briefcase, setData: state.set, isClient: state.isClient }));
export const useKnowledgeBaseData = createDataHook(state => ({ data: state.knowledgeBase, setData: state.set, isClient: state.isClient }));
export const useClientsData = createDataHook(state => ({ data: state.clients, setData: state.set, isClient: state.isClient }));
export const useTestimonialsData = createDataHook(state => ({ data: state.testimonials, setData: state.set, isClient: state.isClient }));
export const useStagesData = createDataHook(state => ({ data: state.stages, setData: state.set, isClient: state.isClient }));
export const useRequestsData = createDataHook(state => ({ data: state.raahaRequests, setData: state.set, isClient: state.isClient }));
export const useAgenciesData = createDataHook(state => ({ data: state.raahaAgencies, setData: state.set, isClient: state.isClient }));
export const useWorkersData = createDataHook(state => ({ data: state.raahaWorkers, setData: state.set, isClient: state.isClient }));
export const useBeautyCentersData = createDataHook(state => ({ data: state.beautyCenters, setData: state.set, isClient: state.isClient }));
export const useBeautySpecialistsData = createDataHook(state => ({ data: state.beautySpecialists, setData: state.set, isClient: state.isClient }));
export const useBeautyServicesData = createDataHook(state => ({ data: state.beautyServices, setData: state.set, isClient: state.isClient }));
export const useBeautyAppointmentsData = createDataHook(state => ({ data: state.beautyAppointments, setData: state.set, isClient: state.isClient }));
export const useUsedItemsData = createDataHook(state => ({ data: state.usedItems, setData: state.set, isClient: state.isClient }));
export const useCartData = createDataHook(state => ({ cart: state.cart, setCart: state.set, isClient: state.isClient }));
export const useSettingsData = createDataHook(state => ({ settings: state.settings, setSettings: state.set, isClient: state.isClient }));
export const useCostSettingsData = createDataHook(state => ({ data: state.costSettings, setData: state.set, isClient: state.isClient }));
export const usePricingData = createDataHook(state => ({ data: state.pricing, setData: state.set, isClient: state.isClient }));
