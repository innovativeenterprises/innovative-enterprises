
'use client';

import { useGlobalStore } from '@/lib/global-store.tsx';

// The main hooks to access and update the global state.
export { useGlobalStore, useSetStore } from '@/lib/global-store.tsx';

export const useProductsData = (initialData?: any[]) => useGlobalStore(state => ({ data: state.products, setData: state.set, isClient: state.isClient }));
export const useStoreProductsData = (initialData?: any[]) => useGlobalStore(state => ({ data: state.storeProducts, isClient: state.isClient }));
export const useProvidersData = (initialData?: any[]) => useGlobalStore(state => ({ data: state.providers, setData: state.set, isClient: state.isClient }));
export const useOpportunitiesData = (initialData?: any[]) => useGlobalStore(state => ({ data: state.opportunities, setData: state.set, isClient: state.isClient }));
export const useServicesData = (initialData?: any[]) => useGlobalStore(state => ({ data: state.services, setData: state.set, isClient: state.isClient }));
export const useStaffData = (initialData?: any) => useGlobalStore(state => ({ leadership: state.leadership, staff: state.staff, agentCategories: state.agentCategories, set: state.set, isClient: state.isClient }));
export const useCfoData = (initialData?: any) => useGlobalStore(state => ({ data: state.cfoData, setData: state.set, isClient: state.isClient }));
export const useAssetsData = (initialData?: any[]) => useGlobalStore(state => ({ data: state.assets, setData: state.set, isClient: state.isClient }));
export const usePropertiesData = (initialData?: any[]) => useGlobalStore(state => ({ data: state.properties, setData: state.set, isClient: state.isClient }));
export const useStairspaceListingsData = (initialData?: any[]) => useGlobalStore(state => ({ data: state.stairspaceListings, setData: state.set, isClient: state.isClient }));
export const useStairspaceRequestsData = (initialData?: any[]) => useGlobalStore(state => ({ data: state.stairspaceRequests, setData: state.set, isClient: state.isClient }));
export const useLeasesData = (initialData?: any[]) => useGlobalStore(state => ({ data: state.signedLeases, setData: state.set, isClient: state.isClient }));
export const useStockItemsData = (initialData?: any[]) => useGlobalStore(state => ({ data: state.stockItems, setData: state.set, isClient: state.isClient }));
export const useGiftCardsData = (initialData?: any[]) => useGlobalStore(state => ({ data: state.giftCards, setData: state.set, isClient: state.isClient }));
export const useStudentsData = (initialData?: any[]) => useGlobalStore(state => ({ data: state.students, setData: state.set, isClient: state.isClient }));
export const useCommunitiesData = (initialData?: any[]) => useGlobalStore(state => ({ data: state.communities, setData: state.set, isClient: state.isClient }));
export const useCommunityEventsData = (initialData?: any[]) => useGlobalStore(state => ({ data: state.communityEvents, setData: state.set, isClient: state.isClient }));
export const useMembersData = (initialData?: any[]) => useGlobalStore(state => ({ data: state.communityMembers, setData: state.set, isClient: state.isClient }));
export const useAlumniJobsData = (initialData?: any[]) => useGlobalStore(state => ({ data: state.alumniJobs, setData: state.set, isClient: state.isClient }));
export const useCarsData = (initialData?: any[]) => useGlobalStore(state => ({ data: state.cars, setData: state.set, isClient: state.isClient }));
export const usePosProductsData = (initialData?: any[]) => useGlobalStore(state => ({ data: state.posProducts, setData: state.set, isClient: state.isClient }));
export const useBriefcaseData = () => useGlobalStore(state => ({ data: state.briefcase, setData: state.set, isClient: state.isClient }));
export const useKnowledgeBaseData = (initialData?: any[]) => useGlobalStore(state => ({ data: state.knowledgeBase, setData: state.set, isClient: state.isClient }));
export const useClientsData = (initialData?: any[]) => useGlobalStore(state => ({ data: state.clients, setData: state.set, isClient: state.isClient }));
export const useTestimonialsData = (initialData?: any[]) => useGlobalStore(state => ({ data: state.testimonials, setData: state.set, isClient: state.isClient }));
export const useStagesData = (initialData?: any[]) => useGlobalStore(state => ({ data: state.stages, setData: state.set, isClient: state.isClient }));
export const useRequestsData = (initialData?: any[]) => useGlobalStore(state => ({ data: state.raahaRequests, setData: state.set, isClient: state.isClient }));
export const useAgenciesData = (initialData?: any[]) => useGlobalStore(state => ({ data: state.raahaAgencies, setData: state.set, isClient: state.isClient }));
export const useWorkersData = (initialData?: any[]) => useGlobalStore(state => ({ data: state.raahaWorkers, setData: state.set, isClient: state.isClient }));
export const useBeautyCentersData = (initialData?: any[]) => useGlobalStore(state => ({ data: state.beautyCenters, setData: state.set, isClient: state.isClient }));
export const useBeautySpecialistsData = (initialData?: any[]) => useGlobalStore(state => ({ data: state.beautySpecialists, setData: state.set, isClient: state.isClient }));
export const useBeautyServicesData = (initialData?: any[]) => useGlobalStore(state => ({ data: state.beautyServices, setData: state.set, isClient: state.isClient }));
export const useBeautyAppointmentsData = (initialData?: any[]) => useGlobalStore(state => ({ data: state.beautyAppointments, setData: state.set, isClient: state.isClient }));
export const useUsedItemsData = (initialData?: any[]) => useGlobalStore(state => ({ data: state.usedItems, setData: state.set, isClient: state.isClient }));
export const useUserDocumentsData = (initialData?: any[]) => useGlobalStore(state => ({ data: state.userDocuments, setData: state.set, isClient: state.isClient }));
export const useCartData = () => useGlobalStore(state => ({ cart: state.cart, setCart: state.set, isClient: state.isClient }));
export const useSettingsData = () => useGlobalStore(state => ({ settings: state.settings, setSettings: state.set, isClient: state.isClient }));
export const useCostSettingsData = (initialData?: any[]) => useGlobalStore(state => ({ data: state.costSettings, setData: state.set, isClient: state.isClient }));
export const usePricingData = (initialData?: any[]) => useGlobalStore(state => ({ data: state.pricing, setData: state.set, isClient: state.isClient }));
