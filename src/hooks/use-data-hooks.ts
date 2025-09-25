
'use client';

import { useGlobalStore, useSetStore } from '@/lib/global-store.tsx';

// The main hook to access the entire state or parts of it
export { useGlobalStore, useSetStore };

// Specific data hooks for convenience
export const useSettingsData = () => {
    const settings = useGlobalStore(state => state.settings);
    const setSettings = useSetStore();
    return { settings, setSettings: (updater: (prev: typeof settings) => typeof settings) => setSettings(state => ({ ...state, settings: updater(state.settings) })), isClient: useGlobalStore(s => s.isClient) };
}

export const useCartData = () => {
    const cart = useGlobalStore(state => state.cart);
    const setCart = useSetStore();
    return { cart, setCart: (updater: (prev: typeof cart) => typeof cart) => setSettings(state => ({ ...state, cart: updater(state.cart) })) };
}

export const useProductsData = (initialData: any[] = []) => {
    const data = useGlobalStore(state => state.products.length ? state.products : initialData);
    const setData = useSetStore();
    return { data, setData: (updater: (prev: typeof data) => typeof data) => setData(state => ({ ...state, products: updater(state.products) })), isClient: useGlobalStore(s => s.isClient) };
}

export const useStoreProductsData = (initialData: any[] = []) => {
    const data = useGlobalStore(state => state.storeProducts.length ? state.storeProducts : initialData);
    const setData = useSetStore();
    return { data, setData: (updater: (prev: typeof data) => typeof data) => setData(state => ({ ...state, storeProducts: updater(state.storeProducts) })), isClient: useGlobalStore(s => s.isClient) };
}

export const useProvidersData = (initialData: any[] = []) => {
    const data = useGlobalStore(state => state.providers.length ? state.providers : initialData);
    const setData = useSetStore();
    return { data, setData: (updater: (prev: typeof data) => typeof data) => setData(state => ({ ...state, providers: updater(state.providers) })), isClient: useGlobalStore(s => s.isClient) };
}

export const useOpportunitiesData = (initialData: any[] = []) => {
    const data = useGlobalStore(state => state.opportunities.length ? state.opportunities : initialData);
    const setData = useSetStore();
    return { data, setData: (updater: (prev: typeof data) => typeof data) => setData(state => ({ ...state, opportunities: updater(state.opportunities) })), isClient: useGlobalStore(s => s.isClient) };
}

export const useServicesData = (initialData: any[] = []) => {
    const data = useGlobalStore(state => state.services.length ? state.services : initialData);
    const setData = useSetStore();
    return { data, setData: (updater: (prev: typeof data) => typeof data) => setData(state => ({ ...state, services: updater(state.services) })), isClient: useGlobalStore(s => s.isClient) };
}

export const useStaffData = (initialData: any = { leadership: [], staff: [], agentCategories: [] }) => {
    const leadership = useGlobalStore(state => state.leadership.length ? state.leadership : initialData.leadership);
    const staff = useGlobalStore(state => state.staff.length ? state.staff : initialData.staff);
    const agentCategories = useGlobalStore(state => state.agentCategories.length ? state.agentCategories : initialData.agentCategories);
    const setStaff = useSetStore();
    return { 
        leadership,
        staff,
        agentCategories,
        setLeadership: (updater: (prev: typeof leadership) => typeof leadership) => setStaff(state => ({ ...state, leadership: updater(state.leadership) })),
        setStaff: (updater: (prev: typeof staff) => typeof staff) => setStaff(state => ({ ...state, staff: updater(state.staff) })),
        setAgentCategories: (updater: (prev: typeof agentCategories) => typeof agentCategories) => setStaff(state => ({ ...state, agentCategories: updater(state.agentCategories) })),
        isClient: useGlobalStore(s => s.isClient)
    };
}

export const useCfoData = (initialData: any = null) => {
    const data = useGlobalStore(state => state.cfoData || initialData);
    const setData = useSetStore();
    return { data, setData: (updater: (prev: typeof data) => typeof data) => setData(state => ({...state, cfoData: updater(state.cfoData)})), isClient: useGlobalStore(s => s.isClient) };
}

export const useAssetsData = (initialData: any[] = []) => {
    const data = useGlobalStore(state => state.assets.length ? state.assets : initialData);
    const setData = useSetStore();
    return { data, setData: (updater: (prev: typeof data) => typeof data) => setData(state => ({ ...state, assets: updater(state.assets) })), isClient: useGlobalStore(s => s.isClient) };
}

export const useUsedItemsData = (initialData: any[] = []) => {
    const data = useGlobalStore(state => state.usedItems.length ? state.usedItems : initialData);
    const setData = useSetStore();
    return { data, setData: (updater: (prev: typeof data) => typeof data) => setData(state => ({ ...state, usedItems: updater(state.usedItems) })), isClient: useGlobalStore(s => s.isClient) };
}

export const useClientsData = (initialData: any[] = []) => {
    const data = useGlobalStore(state => state.clients.length ? state.clients : initialData);
    const setData = useSetStore();
    return { data, setData: (updater: (prev: typeof data) => typeof data) => setData(state => ({ ...state, clients: updater(state.clients) })), isClient: useGlobalStore(s => s.isClient) };
}

export const useTestimonialsData = (initialData: any[] = []) => {
    const data = useGlobalStore(state => state.testimonials.length ? state.testimonials : initialData);
    const setData = useSetStore();
    return { data, setData: (updater: (prev: typeof data) => typeof data) => setData(state => ({ ...state, testimonials: updater(state.testimonials) })), isClient: useGlobalStore(s => s.isClient) };
}

export const usePricingData = (initialData: any[] = []) => {
    const data = useGlobalStore(state => state.pricing.length ? state.pricing : initialData);
    const setData = useSetStore();
    return { data, setData: (updater: (prev: typeof data) => typeof data) => setData(state => ({ ...state, pricing: updater(state.pricing) })), isClient: useGlobalStore(s => s.isClient) };
}

export const usePosProductsData = (initialData: any[] = []) => {
    const data = useGlobalStore(state => state.posProducts.length ? state.posProducts : initialData);
    const setData = useSetStore();
    return { data, setData: (updater: (prev: typeof data) => typeof data) => setData(state => ({ ...state, posProducts: updater(state.posProducts) })), isClient: useGlobalStore(s => s.isClient) };
}

export const usePropertiesData = (initialData: any[] = []) => {
    const data = useGlobalStore(state => state.properties.length ? state.properties : initialData);
    const setData = useSetStore();
    return { data, setData: (updater: (prev: typeof data) => typeof data) => setData(state => ({ ...state, properties: updater(state.properties) })), isClient: useGlobalStore(s => s.isClient) };
}

export const useStairspaceListingsData = (initialData: any[] = []) => {
    const data = useGlobalStore(state => state.stairspaceListings.length ? state.stairspaceListings : initialData);
    const setData = useSetStore();
    return { data, setData: (updater: (prev: typeof data) => typeof data) => setData(state => ({ ...state, stairspaceListings: updater(state.stairspaceListings) })), isClient: useGlobalStore(s => s.isClient) };
}

export const useStairspaceRequestsData = (initialData: any[] = []) => {
    const data = useGlobalStore(state => state.stairspaceRequests.length ? state.stairspaceRequests : initialData);
    const setData = useSetStore();
    return { data, setData: (updater: (prev: typeof data) => typeof data) => setData(state => ({ ...state, stairspaceRequests: updater(state.stairspaceRequests) })), isClient: useGlobalStore(s => s.isClient) };
}

export const useAgenciesData = (initialData: any[] = []) => {
    const data = useGlobalStore(state => state.raahaAgencies.length ? state.raahaAgencies : initialData);
    const setData = useSetStore();
    return { data, setData: (updater: (prev: typeof data) => typeof data) => setData(state => ({...state, raahaAgencies: updater(state.raahaAgencies)})), isClient: useGlobalStore(s => s.isClient) };
}

export const useBeautyCentersData = (initialData: any[] = []) => {
    const data = useGlobalStore(state => state.beautyCenters.length ? state.beautyCenters : initialData);
    const setData = useSetStore();
    return { data, setData: (updater: (prev: typeof data) => typeof data) => setData(state => ({ ...state, beautyCenters: updater(state.beautyCenters) })), isClient: useGlobalStore(s => s.isClient) };
}

export const useBeautyServicesData = (initialData: any[] = []) => {
    const data = useGlobalStore(state => state.beautyServices.length ? state.beautyServices : initialData);
    const setData = useSetStore();
    return { data, setData: (updater: (prev: typeof data) => typeof data) => setData(state => ({ ...state, beautyServices: updater(state.beautyServices) })), isClient: useGlobalStore(s => s.isClient) };
}

export const useBeautyAppointmentsData = (initialData: any[] = []) => {
    const data = useGlobalStore(state => state.beautyAppointments.length ? state.beautyAppointments : initialData);
    const setData = useSetStore();
    return { data, setData: (updater: (prev: typeof data) => typeof data) => setData(state => ({ ...state, beautyAppointments: updater(state.beautyAppointments) })), isClient: useGlobalStore(s => s.isClient) };
}

export const useBeautySpecialistsData = (initialData: any[] = []) => {
    const data = useGlobalStore(state => state.beautySpecialists.length ? state.beautySpecialists : initialData);
    const setData = useSetStore();
    return { data, setData: (updater: (prev: typeof data) => typeof data) => setData(state => ({ ...state, beautySpecialists: updater(state.beautySpecialists) })), isClient: useGlobalStore(s => s.isClient) };
}

export const useWorkersData = (initialData: any[] = []) => {
    const data = useGlobalStore(state => state.raahaWorkers.length ? state.raahaWorkers : initialData);
    const setData = useSetStore();
    return { data, setData: (updater: (prev: typeof data) => typeof data) => setData(state => ({...state, raahaWorkers: updater(state.raahaWorkers)})), isClient: useGlobalStore(s => s.isClient) };
}

export const useRequestsData = (initialData: any[] = []) => {
    const data = useGlobalStore(state => state.raahaRequests.length ? state.raahaRequests : initialData);
    const setData = useSetStore();
    return { data, setData: (updater: (prev: typeof data) => typeof data) => setData(state => ({...state, raahaRequests: updater(state.raahaRequests)})), isClient: useGlobalStore(s => s.isClient) };
}

export const useStockItemsData = (initialData: any[] = []) => {
    const data = useGlobalStore(state => state.stockItems.length ? state.stockItems : initialData);
    const setData = useSetStore();
    return { data, setData: (updater: (prev: typeof data) => typeof data) => setData(state => ({ ...state, stockItems: updater(state.stockItems) })), isClient: useGlobalStore(s => s.isClient) };
}

export const useGiftCardsData = (initialData: any[] = []) => {
    const data = useGlobalStore(state => state.giftCards.length ? state.giftCards : initialData);
    const setData = useSetStore();
    return { data, setData: (updater: (prev: typeof data) => typeof data) => setData(state => ({ ...state, giftCards: updater(state.giftCards) })), isClient: useGlobalStore(s => s.isClient) };
}

export const useLeasesData = (initialData: any[] = []) => {
    const data = useGlobalStore(state => state.signedLeases.length ? state.signedLeases : initialData);
    const setData = useSetStore();
    return { data, setData: (updater: (prev: typeof data) => typeof data) => setData(state => ({ ...state, signedLeases: updater(state.signedLeases) })), isClient: useGlobalStore(s => s.isClient) };
}

export const useStudentsData = (initialData: any[] = []) => {
    const data = useGlobalStore(state => state.students.length ? state.students : initialData);
    const setData = useSetStore();
    return { data, setData: (updater: (prev: typeof data) => typeof data) => setData(state => ({ ...state, students: updater(state.students) })), isClient: useGlobalStore(s => s.isClient) };
}

export const useCommunitiesData = (initialData: any[] = []) => {
    const data = useGlobalStore(state => state.communities.length ? state.communities : initialData);
    const setData = useSetStore();
    return { data, setData: (updater: (prev: typeof data) => typeof data) => setData(state => ({ ...state, communities: updater(state.communities) })), isClient: useGlobalStore(s => s.isClient) };
}

export const useCommunityEventsData = (initialData: any[] = []) => {
    const data = useGlobalStore(state => state.communityEvents.length ? state.communityEvents : initialData);
    const setData = useSetStore();
    return { data, setData: (updater: (prev: typeof data) => typeof data) => setData(state => ({ ...state, communityEvents: updater(state.communityEvents) })), isClient: useGlobalStore(s => s.isClient) };
}

export const useCommunityFinancesData = (initialData: any[] = []) => {
    const data = useGlobalStore(state => state.communityFinances.length ? state.communityFinances : initialData);
    const setData = useSetStore();
    return { data, setData: (updater: (prev: typeof data) => typeof data) => setData(state => ({ ...state, communityFinances: updater(state.communityFinances) })), isClient: useGlobalStore(s => s.isClient) };
}

export const useMembersData = (initialData: any[] = []) => {
    const data = useGlobalStore(state => state.communityMembers.length ? state.communityMembers : initialData);
    const setData = useSetStore();
    return { data, setData: (updater: (prev: typeof data) => typeof data) => setData(state => ({ ...state, communityMembers: updater(state.communityMembers) })), isClient: useGlobalStore(s => s.isClient) };
}

export const useAlumniJobsData = (initialData: any[] = []) => {
    const data = useGlobalStore(state => state.alumniJobs.length ? state.alumniJobs : initialData);
    const setData = useSetStore();
    return { data, setData: (updater: (prev: typeof data) => typeof data) => setData(state => ({ ...state, alumniJobs: updater(state.alumniJobs) })), isClient: useGlobalStore(s => s.isClient) };
}

export const useCostSettingsData = (initialData: any[] = []) => {
    const data = useGlobalStore(state => state.costSettings.length ? state.costSettings : initialData);
    const setData = useSetStore();
    return { data, setData: (updater: (prev: typeof data) => typeof data) => setData(state => ({ ...state, costSettings: updater(state.costSettings) })), isClient: useGlobalStore(s => s.isClient) };
}

export const useKnowledgeBaseData = (initialData: any[] = []) => {
    const data = useGlobalStore(state => state.knowledgeBase.length ? state.knowledgeBase : initialData);
    const setData = useSetStore();
    return { data, setData: (updater: (prev: typeof data) => typeof data) => setData(state => ({ ...state, knowledgeBase: updater(state.knowledgeBase) })), isClient: useGlobalStore(s => s.isClient) };
}

export const useBriefcaseData = () => {
    const briefcase = useGlobalStore(state => state.briefcase);
    const setBriefcase = useSetStore();
    return { briefcase, setBriefcase: (updater: (prev: typeof briefcase) => typeof briefcase) => setBriefcase(state => ({ ...state, briefcase: updater(state.briefcase) })), isClient: useGlobalStore(s => s.isClient) };
}

export const useSaaSProductsData = (initialData: any[] = []) => {
    const data = useGlobalStore(state => state.saasProducts.length ? state.saasProducts : initialData);
    const setData = useSetStore();
    return { data, setData: (updater: (prev: typeof data) => typeof data) => setData(state => ({ ...state, saasProducts: updater(state.saasProducts) })), isClient: useGlobalStore(s => s.isClient) };
}

export const useUserDocumentsData = (initialData: any[] = []) => {
    const data = useGlobalStore(state => state.userDocuments.length ? state.userDocuments : initialData);
    const setData = useSetStore();
    return { data, setData: (updater: (prev: typeof data) => typeof data) => setData(state => ({ ...state, userDocuments: updater(state.userDocuments) })), isClient: useGlobalStore(s => s.isClient) };
}
