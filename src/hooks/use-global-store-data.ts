

'use client';

import { useSyncExternalStore } from 'react';
import { store, type AppState, initialState } from '@/lib/global-store';
import type { Service } from '@/lib/services';
import type { Product } from '@/lib/products';
import type { Client, Testimonial } from '@/lib/clients';
import type { Provider } from '@/lib/providers';
import { type Agent, type AgentCategory } from '@/lib/agents';
import type { Community } from '@/lib/communities';
import type { CommunityEvent } from '@/lib/community-events';
import type { CommunityFinance } from '@/lib/community-finances';
import type { CommunityMember } from '@/lib/community-members';
import type { Opportunity } from '@/lib/opportunities';
import type { ProjectStage } from '@/lib/stages';
import type { AppSettings } from '@/lib/settings';
import type { Asset } from '@/lib/assets';
import type { Investor } from '@/lib/investors';
import type { KnowledgeDocument } from '@/lib/knowledge';
import type { Agency } from '@/lib/raaha-agencies';
import type { HireRequest } from '@/lib/raaha-requests';
import type { Worker as RaahaWorker } from '@/lib/raaha-workers';
import type { SignedLease } from '@/lib/leases';
import type { Property } from '@/lib/properties';
import type { StairspaceListing } from '@/lib/stairspace.schema';
import type { BookingRequest as StairspaceRequest } from '@/lib/stairspace-requests';
import type { BoQItem } from '@/ai/flows/boq-generator.schema';
import type { CostRate } from '@/lib/cost-settings.schema';
import type { Student } from '@/lib/students';
import type { KpiData, TransactionData, UpcomingPayment, VatPayment, CashFlowData } from '@/lib/cfo-data';
import type { Pricing } from '@/lib/pricing';
import type { Car } from '@/lib/cars';
import type { RentalAgency } from '@/lib/rental-agencies';
import type { Transaction as PosTransaction, PosProduct } from '@/lib/pos-data';
import type { GiftCard } from '@/lib/gift-cards';
import type { JobPosting } from '@/lib/alumni-jobs';
import { type BeautyService, type Specialist as BeautySpecialist } from '@/lib/beauty-services';
import type { BeautyCenter } from '@/lib/beauty-centers';
import type { BeautyAppointment } from '@/lib/beauty-appointments';


/**
 * Custom hook to safely subscribe to the global store and select a slice of state.
 * It uses useSyncExternalStore, which is the officially recommended way to handle
 * external stores with React 18+ and server-side rendering to prevent hydration mismatches.
 */
function useStoreData<T>(selector: (state: AppState) => T): T {
    const state = useSyncExternalStore(
        store.subscribe,
        () => selector(store.get()),
        () => selector(initialState) // Use the static initial state for the server-side render.
    );
    return state;
}

// Centralized setters to be used within the custom hooks
export const setServices = (updater: (prev: Service[]) => Service[]) => store.set(state => ({ ...state, services: updater(state.services) }));
export const setProducts = (updater: (prev: Product[]) => Product[]) => store.set(state => ({ ...state, products: updater(state.products) }));
export const setClients = (updater: (prev: Client[]) => Client[]) => store.set(state => ({ ...state, clients: updater(state.clients) }));
export const setTestimonials = (updater: (prev: Testimonial[]) => Testimonial[]) => store.set(state => ({ ...state, testimonials: updater(state.testimonials) }));
export const setProviders = (updater: (prev: Provider[]) => Provider[]) => store.set(state => ({ ...state, providers: updater(state.providers) }));
export const setLeadership = (updater: (prev: Agent[]) => Agent[]) => store.set(state => ({ ...state, leadership: updater(state.leadership) }));
export const setStaff = (updater: (prev: Agent[]) => Agent[]) => store.set(state => ({ ...state, staff: updater(state.staff) }));
export const setAgentCategories = (updater: (prev: AgentCategory[]) => AgentCategory[]) => store.set(state => ({ ...state, agentCategories: updater(state.agentCategories) }));
export const setCommunities = (updater: (prev: Community[]) => Community[]) => store.set(state => ({ ...state, communities: updater(state.communities) }));
export const setCommunityEvents = (updater: (prev: CommunityEvent[]) => CommunityEvent[]) => store.set(state => ({ ...state, communityEvents: updater(state.communityEvents) }));
export const setCommunityFinances = (updater: (prev: CommunityFinance[]) => CommunityFinance[]) => store.set(state => ({ ...state, communityFinances: updater(state.communityFinances) }));
export const setCommunityMembers = (updater: (prev: CommunityMember[]) => CommunityMember[]) => store.set(state => ({ ...state, communityMembers: updater(state.communityMembers) }));
export const setProjectStages = (updater: (prev: ProjectStage[]) => ProjectStage[]) => store.set(state => ({ ...state, stages: updater(state.stages) }));
export const setSettings = (updater: (prev: AppSettings) => AppSettings) => store.set(state => ({ ...state, settings: updater(state.settings) }));
export const setAssets = (updater: (prev: Asset[]) => Asset[]) => store.set(state => ({ ...state, assets: updater(state.assets) }));
export const setInvestors = (updater: (prev: Investor[]) => Investor[]) => store.set(state => ({ ...state, investors: updater(state.investors) }));
export const setKnowledgeBase = (updater: (prev: KnowledgeDocument[]) => KnowledgeDocument[]) => store.set(state => ({ ...state, knowledgeBase: updater(state.knowledgeBase) }));
export const setRaahaAgencies = (updater: (prev: Agency[]) => Agency[]) => store.set(state => ({ ...state, raahaAgencies: updater(state.raahaAgencies) }));
export const setRaahaWorkers = (updater: (prev: RaahaWorker[]) => RaahaWorker[]) => store.set(state => ({ ...state, raahaWorkers: updater(state.raahaWorkers) }));
export const setRaahaRequests = (updater: (prev: HireRequest[]) => HireRequest[]) => store.set(state => ({ ...state, raahaRequests: updater(state.raahaRequests) }));
export const setProperties = (updater: (prev: Property[]) => Property[]) => store.set(state => ({ ...state, properties: updater(state.properties) }));
export const setStairspaceListings = (updater: (prev: StairspaceListing[]) => StairspaceListing[]) => store.set(state => ({ ...state, stairspaceListings: updater(state.stairspaceListings) }));
export const setStairspaceRequests = (updater: (prev: StairspaceRequest[]) => StairspaceRequest[]) => store.set(state => ({ ...state, stairspaceRequests: updater(state.stairspaceRequests) }));
export const setOpportunities = (updater: (prev: Opportunity[]) => Opportunity[]) => store.set(state => ({ ...state, opportunities: updater(state.opportunities) }));
export const setCostSettings = (updater: (prev: CostRate[]) => CostRate[]) => store.set(state => ({ ...state, costSettings: updater(state.costSettings) }));
export const setPricing = (updater: (prev: Pricing[]) => Pricing[]) => store.set(state => ({...state, pricing: updater(state.pricing)}));
export const setStudents = (updater: (prev: Student[]) => Student[]) => store.set(state => ({ ...state, students: updater(state.students) }));
export const setSignedLeases = (updater: (prev: SignedLease[]) => SignedLease[]) => store.set(state => ({ ...state, signedLeases: updater(state.signedLeases) }));
export const setCars = (updater: (prev: Car[]) => Car[]) => store.set(state => ({ ...state, cars: updater(state.cars) }));
export const setRentalAgencies = (updater: (prev: RentalAgency[]) => RentalAgency[]) => store.set(state => ({ ...state, rentalAgencies: updater(state.rentalAgencies) }));
export const setDailySales = (updater: (prev: PosTransaction[]) => PosTransaction[]) => store.set(state => ({...state, dailySales: updater(state.dailySales) }));
export const setPosProducts = (updater: (prev: PosProduct[]) => PosProduct[]) => store.set(state => ({...state, posProducts: updater(state.posProducts) }));
export const setGiftCards = (updater: (prev: GiftCard[]) => GiftCard[]) => store.set(state => ({ ...state, giftCards: updater(state.giftCards) }));
export const setStockItems = (updater: (prev: StockItem[]) => StockItem[]) => store.set(state => ({...state, stockItems: updater(state.stockItems) }));
export const setBeautyCenters = (updater: (prev: BeautyCenter[]) => BeautyCenter[]) => store.set(state => ({ ...state, beautyCenters: updater(state.beautyCenters) }));
export const setBeautyServices = (updater: (prev: BeautyService[]) => BeautyService[]) => store.set(state => ({ ...state, beautyServices: updater(state.beautyServices) }));
export const setBeautyAppointments = (updater: (prev: BeautyAppointment[]) => BeautyAppointment[]) => store.set(state => ({...state, beautyAppointments: updater(state.beautyAppointments) }));


// Data hooks that return the reactive state slice and setters.
export const useServicesData = () => ({ services: useStoreData(s => s.services), setServices, isClient: true });
export const useProductsData = () => ({ products: useStoreData(s => s.products), setProducts, isClient: true });
export const useClientsData = () => ({
    clients: useStoreData(s => s.clients),
    testimonials: useStoreData(s => s.testimonials),
    setClients,
    setTestimonials,
    isClient: true,
});
export const useProvidersData = () => ({ providers: useStoreData(s => s.providers), setProviders, isClient: true });
export const useStaffData = () => ({
    leadership: useStoreData(s => s.leadership),
    staff: useStoreData(s => s.staff),
    agentCategories: useStoreData(s => s.agentCategories),
    setLeadership,
    setStaff,
    setAgentCategories,
    isClient: true,
});
export const useCommunitiesData = () => ({ communities: useStoreData(s => s.communities), setCommunities, isClient: true });
export const useCommunityHubData = () => ({
    events: useStoreData(s => s.communityEvents),
    finances: useStoreData(s => s.communityFinances),
    setCommunityEvents,
    setCommunityFinances,
    isClient: true,
});
export const useMembersData = () => ({ members: useStoreData(s => s.communityMembers), setMembers, isClient: true });
export const useProjectStagesData = () => ({ stages: useStoreData(s => s.stages), setStages, isClient: true });
export const useSettingsData = () => ({ settings: useStoreData(s => s.settings), setSettings, isClient: true });
export const useAssetsData = () => ({ assets: useStoreData(s => s.assets), setAssets, isClient: true });
export const useInvestorsData = () => ({ investors: useStoreData(s => s.investors), setInvestors, isClient: true });
export const useKnowledgeData = () => ({
    knowledgeBase: useStoreData(s => s.knowledgeBase),
    setKnowledgeBase,
    isClient: true,
});
export const useAgenciesData = () => ({ agencies: useStoreData(s => s.raahaAgencies), setAgencies: setRaahaAgencies, isClient: true });
export const useWorkersData = () => ({ workers: useStoreData(s => s.raahaWorkers), isClient: true });
export const useRequestsData = () => ({ requests: useStoreData(s => s.raahaRequests), isClient: true });
export const useLeasesData = () => ({ leases: useStoreData(s => s.signedLeases), setLeases: setSignedLeases, isClient: true });
export const usePropertiesData = () => ({ properties: useStoreData(s => s.properties), setProperties, isClient: true });
export const useStairspaceData = () => ({
    stairspaceListings: useStoreData(s => s.stairspaceListings),
    setStairspaceListings,
    isClient: true,
});
export const useStairspaceRequestsData = () => ({
    stairspaceRequests: useStoreData(s => s.stairspaceRequests),
    setStairspaceRequests,
    isClient: true,
});
export const useOpportunitiesData = () => ({
    opportunities: useStoreData(s => s.opportunities),
    setOpportunities,
    isClient: true,
});
export const useCostSettingsData = () => ({
    costSettings: useStoreData(s => s.costSettings),
    setCostSettings,
    isClient: true,
});
export const usePricingData = () => ({
    pricing: useStoreData(s => s.pricing),
    setPricing,
    isClient: true,
});

export const useCfoData = () => ({
    ...useStoreData(s => ({
        kpiData: s.kpiData,
        transactionData: s.transactionData,
        upcomingPayments: s.upcomingPayments,
        vatPayment: s.vatPayment,
        cashFlowData: s.cashFlowData,
    })),
    isClient: true
});
export const useStudentsData = () => ({
    students: useStoreData(s => s.students),
    setStudents,
    isClient: true,
});
export const useBeautyData = () => ({
    centers: useStoreData(s => s.beautyCenters),
    services: useStoreData(s => s.beautyServices),
    specialists: useStoreData(s => s.beautySpecialists),
    appointments: useStoreData(s => s.beautyAppointments),
    setBeautyCenters,
    setBeautyServices,
    setBeautyAppointments,
    isClient: true,
});
export const useDriveSyncData = () => ({
    cars: useStoreData(s => s.cars),
    rentalAgencies: useStoreData(s => s.rentalAgencies),
    isClient: true,
});
export const usePosData = () => ({
    dailySales: useStoreData(s => s.dailySales),
    products: useStoreData(s => s.posProducts),
    setProducts: setPosProducts,
    setDailySales: setDailySales,
    isClient: true,
});
export const useGiftCardsData = () => ({
    giftCards: useStoreData(s => s.giftCards),
    setGiftCards,
    isClient: true,
});
export const useStockItemsData = () => ({
    stockItems: useStoreData(s => s.stockItems),
    setStockItems,
    isClient: true,
});
