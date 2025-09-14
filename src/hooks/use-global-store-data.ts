

'use client';

import { useSyncExternalStore, useMemo, useCallback } from 'react';
import { store } from '@/lib/global-store';
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
 * The selector is applied *after* the hook to ensure stability during SSR.
 */
function useStoreData<T>(selector: (state: AppState) => T): T {
    const state = useSyncExternalStore(
        store.subscribe,
        store.get,
        store.getSsrState, // This function is now guaranteed to return a stable snapshot on the server
    );
    return useMemo(() => selector(state), [state, selector]);
}

// All setter functions are now wrapped in useCallback to ensure they have a stable identity across renders.
const setServices = (updater: (services: Service[]) => Service[]) => store.set(state => ({ ...state, services: updater(state.services) }));
const setProducts = (updater: (products: Product[]) => Product[]) => store.set(state => ({ ...state, products: updater(state.products) }));
const setClients = (updater: (clients: Client[]) => Client[]) => store.set(state => ({ ...state, clients: updater(state.clients) }));
const setTestimonials = (updater: (testimonials: Testimonial[]) => Testimonial[]) => store.set(state => ({ ...state, testimonials: updater(state.testimonials) }));
const setProviders = (updater: (providers: Provider[]) => Provider[]) => store.set(state => ({ ...state, providers: updater(state.providers) }));
const setLeadership = (updater: (agents: Agent[]) => Agent[]) => store.set(state => ({ ...state, leadership: updater(state.leadership) }));
const setStaff = (updater: (agents: Agent[]) => Agent[]) => store.set(state => ({ ...state, staff: updater(state.staff) }));
const setAgentCategories = (updater: (categories: AgentCategory[]) => AgentCategory[]) => store.set(state => ({ ...state, agentCategories: updater(state.agentCategories) }));
const setCommunities = (updater: (communities: Community[]) => Community[]) => store.set(state => ({ ...state, communities: updater(state.communities) }));
const setCommunityEvents = (updater: (events: CommunityEvent[]) => CommunityEvent[]) => store.set(state => ({ ...state, communityEvents: updater(state.communityEvents) }));
const setCommunityFinances = (updater: (finances: CommunityFinance[]) => CommunityFinance[]) => store.set(state => ({ ...state, communityFinances: updater(state.communityFinances) }));
const setCommunityMembers = (updater: (members: CommunityMember[]) => CommunityMember[]) => store.set(state => ({...state, communityMembers: updater(state.communityMembers)}));
const setProjectStages = (updater: (stages: ProjectStage[]) => ProjectStage[]) => store.set(state => ({ ...state, stages: updater(state.stages) }));
const setSettings = (updater: (settings: AppSettings) => AppSettings) => store.set(state => ({ ...state, settings: updater(state.settings) }));
const setAssets = (updater: (assets: Asset[]) => Asset[]) => store.set(state => ({ ...state, assets: updater(state.assets) }));
const setInvestors = (updater: (investors: Investor[]) => Investor[]) => store.set(state => ({ ...state, investors: updater(state.investors) }));
const setKnowledgeBase = (updater: (docs: KnowledgeDocument[]) => KnowledgeDocument[]) => store.set(state => ({ ...state, knowledgeBase: updater(state.knowledgeBase) }));
const setRaahaAgencies = (updater: (agencies: Agency[]) => Agency[]) => store.set(state => ({ ...state, raahaAgencies: updater(state.raahaAgencies) }));
const setRaahaWorkers = (updater: (workers: RaahaWorker[]) => RaahaWorker[]) => store.set(state => ({ ...state, raahaWorkers: updater(state.raahaWorkers) }));
const setRaahaRequests = (updater: (requests: HireRequest[]) => HireRequest[]) => store.set(state => ({ ...state, raahaRequests: updater(state.raahaRequests) }));
const setProperties = (updater: (properties: Property[]) => Property[]) => store.set(state => ({ ...state, properties: updater(state.properties) }));
const setStairspaceListings = (updater: (listings: StairspaceListing[]) => StairspaceListing[]) => store.set(state => ({ ...state, stairspaceListings: updater(state.stairspaceListings) }));
const setStairspaceRequests = (updater: (requests: StairspaceRequest[]) => StairspaceRequest[]) => store.set(state => ({ ...state, stairspaceRequests: updater(state.stairspaceRequests) }));
const setOpportunities = (updater: (opps: Opportunity[]) => Opportunity[]) => store.set(state => ({ ...state, opportunities: updater(state.opportunities) }));
const setCostSettings = (updater: (items: CostRate[]) => CostRate[]) => store.set(state => ({...state, costSettings: updater(state.costSettings)}));
const setPricing = (updater: (items: Pricing[]) => Pricing[]) => store.set(state => ({...state, pricing: updater(state.pricing)}));
const setStudents = (updater: (students: Student[]) => Student[]) => store.set(state => ({...state, students: updater(state.students)}));
const setSignedLeases = (updater: (leases: SignedLease[]) => SignedLease[]) => store.set(state => ({ ...state, signedLeases: updater(state.signedLeases) }));


export const useServicesData = () => {
    const services = useStoreData(state => state.services);
    return { services, setServices: useCallback(setServices, []), isClient: true };
};

export const useProductsData = () => {
    const products = useStoreData(state => state.products);
    return { products, setProducts: useCallback(setProducts, []), isClient: true };
};

export const useClientsData = () => {
    const data = useStoreData(state => ({ clients: state.clients, testimonials: state.testimonials }));
    return {
        ...data,
        setClients: useCallback(setClients, []),
        setTestimonials: useCallback(setTestimonials, []),
        isClient: true,
    };
};

export const useProvidersData = () => {
    const providers = useStoreData(state => state.providers);
    return { providers, setProviders: useCallback(setProviders, []), isClient: true };
};

export const useStaffData = () => {
    const data = useStoreData(state => ({
        leadership: state.leadership,
        staff: state.staff,
        agentCategories: state.agentCategories,
    }));
    return {
        ...data,
        setLeadership: useCallback(setLeadership, []),
        setStaff: useCallback(setStaff, []),
        setAgentCategories: useCallback(setAgentCategories, []),
        isClient: true,
    };
};

export const useCommunitiesData = () => {
    const communities = useStoreData(state => state.communities);
    return { communities, setCommunities: useCallback(setCommunities, []), isClient: true };
};

export const useCommunityHubData = () => {
    const data = useStoreData(state => ({
        events: state.communityEvents,
        finances: state.communityFinances,
    }));
    return {
        ...data,
        setCommunityEvents: useCallback(setCommunityEvents, []),
        setCommunityFinances: useCallback(setCommunityFinances, []),
        isClient: true,
    };
};

export const useMembersData = () => {
    const members = useStoreData(state => state.communityMembers);
    return {
        members,
        setCommunityMembers: useCallback(setCommunityMembers, []),
        setMembers: useCallback(setCommunityMembers, []),
        isClient: true,
    };
};

export const useProjectStagesData = () => {
    const stages = useStoreData(state => state.stages);
    return { stages, setStages: useCallback(setProjectStages, []), isClient: true };
};

export const useSettingsData = () => {
    const settings = useStoreData(state => state.settings);
    return { settings, setSettings: useCallback(setSettings, []), isClient: true };
};

export const useAssetsData = () => {
    const assets = useStoreData(state => state.assets);
    return { assets, setAssets: useCallback(setAssets, []), isClient: true };
};

export const useInvestorsData = () => {
    const investors = useStoreData(state => state.investors);
    return { investors, setInvestors: useCallback(setInvestors, []), isClient: true };
};

export const useKnowledgeData = () => {
    const knowledgeBase = useStoreData(state => state.knowledgeBase);
    return {
        knowledgeBase,
        setKnowledgeBase: useCallback(setKnowledgeBase, []),
        isClient: true,
    };
};

export const useAgenciesData = () => {
    const agencies = useStoreData(state => state.raahaAgencies);
    return {
        agencies,
        setAgencies: useCallback(setRaahaAgencies, []),
        isClient: true,
    };
};

export const useWorkersData = () => {
    const workers = useStoreData(state => state.raahaWorkers);
    return {
        workers,
        setWorkers: useCallback(setRaahaWorkers, []),
        isClient: true,
    };
};

export const useRequestsData = () => {
    const requests = useStoreData(state => state.raahaRequests);
    return {
        requests,
        setRequests: useCallback(setRaahaRequests, []),
        isClient: true,
    };
};

export const useLeasesData = () => {
    const leases = useStoreData(state => state.signedLeases);
    return {
        leases,
        setLeases: useCallback(setSignedLeases, []),
        isClient: true,
    };
};

export const usePropertiesData = () => {
    const properties = useStoreData(state => state.properties);
    return { properties, setProperties: useCallback(setProperties, []), isClient: true };
};

export const useStairspaceData = () => {
    const stairspaceListings = useStoreData(state => state.stairspaceListings);
    return {
        stairspaceListings,
        setStairspaceListings: useCallback(setStairspaceListings, []),
        isClient: true,
    };
};

export const useStairspaceRequestsData = () => {
    const stairspaceRequests = useStoreData(state => state.stairspaceRequests);
    return {
        stairspaceRequests,
        setStairspaceRequests: useCallback(setStairspaceRequests, []),
        isClient: true,
    };
};

export const useOpportunitiesData = () => {
    const opportunities = useStoreData(state => state.opportunities);
    return {
        opportunities,
        setOpportunities: useCallback(setOpportunities, []),
        isClient: true,
    };
};

export const useCostSettingsData = () => {
    const costSettings = useStoreData(state => state.costSettings);
    return { 
        costSettings,
        setCostSettings: useCallback(setCostSettings, []),
        isClient: true 
    };
}

export const usePricingData = () => {
    const pricing = useStoreData(state => state.pricing);
    return {
        pricing,
        setPricing: useCallback(setPricing, []),
        isClient: true,
    };
}

export const useCfoData = () => {
    const data = useStoreData(state => ({
        kpiData: state.kpiData,
        transactionData: state.transactionData,
        upcomingPayments: state.upcomingPayments,
        vatPayment: state.vatPayment,
        cashFlowData: state.cashFlowData,
    }));
    return {
        ...data,
        isClient: true,
    };
};

export const useStudentsData = () => {
    const students = useStoreData(state => state.students);
    return {
        students,
        setStudents: useCallback(setStudents, []),
        isClient: true,
    };
};

    