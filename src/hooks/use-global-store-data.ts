
'use client';

import { useSyncExternalStore, useCallback } from 'react';
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


/**
 * Custom hook to safely subscribe to the global store and select a slice of state.
 * It uses useSyncExternalStore to be compatible with React 18's concurrent features.
 * The getServerSnapshot ensures that the server render and the first client render
 * use the same initial state, preventing hydration mismatches.
 */
function useStoreData<T>(selector: (state: AppState) => T): T {
    return useSyncExternalStore(
        store.subscribe,
        () => selector(store.get()),
        () => selector(initialState) // Use the stable initial state for the server snapshot.
    );
}

// Centralized setters to be used within the custom hooks
const setServices = (updater: (prev: Service[]) => Service[]) => store.set(state => ({ ...state, services: updater(state.services) }));
const setProducts = (updater: (prev: Product[]) => Product[]) => store.set(state => ({ ...state, products: updater(state.products) }));
const setClients = (updater: (prev: Client[]) => Client[]) => store.set(state => ({ ...state, clients: updater(state.clients) }));
const setTestimonials = (updater: (prev: Testimonial[]) => Testimonial[]) => store.set(state => ({ ...state, testimonials: updater(state.testimonials) }));
const setProviders = (updater: (prev: Provider[]) => Provider[]) => store.set(state => ({ ...state, providers: updater(state.providers) }));
const setLeadership = (updater: (prev: Agent[]) => Agent[]) => store.set(state => ({ ...state, leadership: updater(state.leadership) }));
const setStaff = (updater: (prev: Agent[]) => Agent[]) => store.set(state => ({ ...state, staff: updater(state.staff) }));
const setAgentCategories = (updater: (prev: AgentCategory[]) => AgentCategory[]) => store.set(state => ({ ...state, agentCategories: updater(state.agentCategories) }));
const setCommunities = (updater: (prev: Community[]) => Community[]) => store.set(state => ({ ...state, communities: updater(state.communities) }));
const setCommunityEvents = (updater: (prev: CommunityEvent[]) => CommunityEvent[]) => store.set(state => ({ ...state, communityEvents: updater(state.communityEvents) }));
const setCommunityFinances = (updater: (prev: CommunityFinance[]) => CommunityFinance[]) => store.set(state => ({ ...state, communityFinances: updater(state.communityFinances) }));
const setCommunityMembers = (updater: (prev: CommunityMember[]) => CommunityMember[]) => store.set(state => ({ ...state, communityMembers: updater(state.communityMembers) }));
const setProjectStages = (updater: (prev: ProjectStage[]) => ProjectStage[]) => store.set(state => ({ ...state, stages: updater(state.stages) }));
const setSettings = (updater: (prev: AppSettings) => AppSettings) => store.set(state => ({ ...state, settings: updater(state.settings) }));
const setAssets = (updater: (prev: Asset[]) => Asset[]) => store.set(state => ({ ...state, assets: updater(state.assets) }));
const setInvestors = (updater: (prev: Investor[]) => Investor[]) => store.set(state => ({ ...state, investors: updater(state.investors) }));
const setKnowledgeBase = (updater: (prev: KnowledgeDocument[]) => KnowledgeDocument[]) => store.set(state => ({ ...state, knowledgeBase: updater(state.knowledgeBase) }));
const setRaahaAgencies = (updater: (prev: Agency[]) => Agency[]) => store.set(state => ({ ...state, raahaAgencies: updater(state.raahaAgencies) }));
const setRaahaWorkers = (updater: (prev: RaahaWorker[]) => RaahaWorker[]) => store.set(state => ({ ...state, raahaWorkers: updater(state.raahaWorkers) }));
const setRaahaRequests = (updater: (prev: HireRequest[]) => HireRequest[]) => store.set(state => ({ ...state, raahaRequests: updater(state.raahaRequests) }));
const setProperties = (updater: (prev: Property[]) => Property[]) => store.set(state => ({ ...state, properties: updater(state.properties) }));
const setStairspaceListings = (updater: (prev: StairspaceListing[]) => StairspaceListing[]) => store.set(state => ({ ...state, stairspaceListings: updater(state.stairspaceListings) }));
const setStairspaceRequests = (updater: (prev: StairspaceRequest[]) => StairspaceRequest[]) => store.set(state => ({ ...state, stairspaceRequests: updater(state.stairspaceRequests) }));
const setOpportunities = (updater: (prev: Opportunity[]) => Opportunity[]) => store.set(state => ({ ...state, opportunities: updater(state.opportunities) }));
const setCostSettings = (updater: (prev: CostRate[]) => CostRate[]) => store.set(state => ({ ...state, costSettings: updater(state.costSettings) }));
const setPricing = (updater: (prev: Pricing[]) => Pricing[]) => store.set(state => ({ ...state, pricing: updater(state.pricing) }));
const setStudents = (updater: (prev: Student[]) => Student[]) => store.set(state => ({ ...state, students: updater(state.students) }));
const setSignedLeases = (updater: (prev: SignedLease[]) => SignedLease[]) => store.set(state => ({ ...state, signedLeases: updater(state.signedLeases) }));

// Export all setter functions for use in components
export {
    setServices, setProducts, setClients, setTestimonials, setProviders,
    setLeadership, setStaff, setAgentCategories, setCommunities,
    setCommunityEvents, setCommunityFinances, setCommunityMembers,
    setProjectStages, setSettings, setAssets, setInvestors,
    setKnowledgeBase, setRaahaAgencies, setRaahaWorkers, setRaahaRequests,
    setProperties, setStairspaceListings, setStairspaceRequests,
    setOpportunities, setCostSettings, setPricing, setStudents, setSignedLeases,
};

// Data hooks that return the reactive state slice.
// The `isClient` property is now redundant because useSyncExternalStore is safe, but we keep it for compatibility.
export const useServicesData = () => ({ services: useStoreData(s => s.services), isClient: true });
export const useProductsData = () => ({ products: useStoreData(s => s.products), isClient: true });
export const useClientsData = () => ({
    clients: useStoreData(s => s.clients),
    testimonials: useStoreData(s => s.testimonials),
    isClient: true,
});
export const useProvidersData = () => ({ providers: useStoreData(s => s.providers), isClient: true });
export const useStaffData = () => ({
    leadership: useStoreData(s => s.leadership),
    staff: useStoreData(s => s.staff),
    agentCategories: useStoreData(s => s.agentCategories),
    isClient: true,
});
export const useCommunitiesData = () => ({ communities: useStoreData(s => s.communities), isClient: true });
export const useCommunityHubData = () => ({
    events: useStoreData(s => s.communityEvents),
    finances: useStoreData(s => s.communityFinances),
    isClient: true,
});
export const useMembersData = () => ({ members: useStoreData(s => s.communityMembers), isClient: true });
export const useProjectStagesData = () => ({ stages: useStoreData(s => s.stages), isClient: true });
export const useSettingsData = () => ({ settings: useStoreData(s => s.settings), isClient: true });
export const useAssetsData = () => ({ assets: useStoreData(s => s.assets), isClient: true });
export const useInvestorsData = () => ({ investors: useStoreData(s => s.investors), isClient: true });
export const useKnowledgeData = () => ({
    knowledgeBase: useStoreData(s => s.knowledgeBase),
    isClient: true,
});
export const useAgenciesData = () => ({ agencies: useStoreData(s => s.raahaAgencies), isClient: true });
export const useWorkersData = () => ({ workers: useStoreData(s => s.raahaWorkers), isClient: true });
export const useRequestsData = () => ({ requests: useStoreData(s => s.raahaRequests), isClient: true });
export const useLeasesData = () => ({ leases: useStoreData(s => s.signedLeases), isClient: true });
export const usePropertiesData = () => ({ properties: useStoreData(s => s.properties), isClient: true });
export const useStairspaceData = () => ({
    stairspaceListings: useStoreData(s => s.stairspaceListings),
    isClient: true,
});
export const useStairspaceRequestsData = () => ({
    stairspaceRequests: useStoreData(s => s.stairspaceRequests),
    isClient: true,
});
export const useOpportunitiesData = () => ({
    opportunities: useStoreData(s => s.opportunities),
    isClient: true,
});
export const useCostSettingsData = () => ({
    costSettings: useStoreData(s => s.costSettings),
    isClient: true,
});
export const usePricingData = () => ({
    pricing: useStoreData(s => s.pricing),
    isClient: true,
});
export const useCfoData = () => ({
    kpiData: useStoreData(s => s.kpiData),
    transactionData: useStoreData(s => s.transactionData),
    upcomingPayments: useStoreData(s => s.upcomingPayments),
    vatPayment: useStoreData(s => s.vatPayment),
    cashFlowData: useStoreData(s => s.cashFlowData),
    isClient: true,
});
export const useStudentsData = () => ({
    students: useStoreData(s => s.students),
    isClient: true,
});
