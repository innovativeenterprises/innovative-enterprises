

'use client';

import { useSyncExternalStore } from 'react';
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


function useStoreData<T>(selector: (state: any) => T): T {
    const state = useSyncExternalStore(store.subscribe, () => selector(store.get()), () => selector(store.get()));
    return state;
}

// --- Data Hooks ---
export const useServicesData = () => {
    const services = useStoreData(state => state.services);
    const setServices = (updater: (prev: Service[]) => Service[]) => store.set(state => ({ ...state, services: updater(state.services) }));
    return { services, setServices };
};

export const useProductsData = () => {
    const products = useStoreData(state => state.products);
    const setProducts = (updater: (prev: Product[]) => Product[]) => store.set(state => ({ ...state, products: updater(state.products) }));
    return { products, setProducts };
};

export const useClientsData = () => {
    const data = useStoreData(state => ({ clients: state.clients, testimonials: state.testimonials }));
    const setClients = (updater: (prev: Client[]) => Client[]) => store.set(state => ({ ...state, clients: updater(state.clients) }));
    const setTestimonials = (updater: (prev: Testimonial[]) => Testimonial[]) => store.set(state => ({ ...state, testimonials: updater(state.testimonials) }));
    return { ...data, setClients, setTestimonials };
};

export const useProvidersData = () => {
    const providers = useStoreData(state => state.providers);
    const setProviders = (updater: (prev: Provider[]) => Provider[]) => store.set(state => ({ ...state, providers: updater(state.providers) }));
    return { providers, setProviders };
};

export const useStaffData = () => {
    const data = useStoreData(state => ({
        leadership: state.leadership,
        staff: state.staff,
        agentCategories: state.agentCategories,
    }));
    const setLeadership = (updater: (prev: Agent[]) => Agent[]) => store.set(state => ({ ...state, leadership: updater(state.leadership) }));
    const setStaff = (updater: (prev: Agent[]) => Agent[]) => store.set(state => ({ ...state, staff: updater(state.staff) }));
    const setAgentCategories = (updater: (prev: AgentCategory[]) => AgentCategory[]) => store.set(state => ({ ...state, agentCategories: updater(state.agentCategories) }));
    return { ...data, setLeadership, setStaff, setAgentCategories };
};

export const useCommunitiesData = () => {
    const communities = useStoreData(state => state.communities);
    const setCommunities = (updater: (prev: Community[]) => Community[]) => store.set(state => ({ ...state, communities: updater(state.communities) }));
    return { communities, setCommunities };
};

export const useCommunityHubData = () => {
    const data = useStoreData(state => ({
        events: state.communityEvents,
        finances: state.communityFinances,
    }));
    const setCommunityEvents = (updater: (prev: CommunityEvent[]) => CommunityEvent[]) => store.set(state => ({ ...state, communityEvents: updater(state.communityEvents) }));
    const setCommunityFinances = (updater: (prev: CommunityFinance[]) => CommunityFinance[]) => store.set(state => ({ ...state, communityFinances: updater(state.communityFinances) }));
    return { ...data, setCommunityEvents, setCommunityFinances };
};

export const useMembersData = () => {
    const members = useStoreData(state => state.communityMembers);
    const setMembers = (updater: (prev: CommunityMember[]) => CommunityMember[]) => store.set(state => ({ ...state, communityMembers: updater(state.communityMembers) }));
    return { members, setMembers };
};

export const useProjectStagesData = () => {
    const stages = useStoreData(state => state.stages);
    const setStages = (updater: (prev: ProjectStage[]) => ProjectStage[]) => store.set(state => ({ ...state, stages: updater(state.stages) }));
    return { stages, setStages };
};

export const useSettingsData = () => {
    const settings = useStoreData(state => state.settings);
    const setSettings = (updater: (prev: AppSettings) => AppSettings) => store.set(state => ({ ...state, settings: updater(state.settings) }));
    return { settings, setSettings };
};

export const useAssetsData = () => {
    const assets = useStoreData(state => state.assets);
    const setAssets = (updater: (prev: Asset[]) => Asset[]) => store.set(state => ({ ...state, assets: updater(state.assets) }));
    return { assets, setAssets };
};

export const useInvestorsData = () => {
    const investors = useStoreData(state => state.investors);
    const setInvestors = (updater: (prev: Investor[]) => Investor[]) => store.set(state => ({ ...state, investors: updater(state.investors) }));
    return { investors, setInvestors };
};

export const useKnowledgeData = () => {
    const knowledgeBase = useStoreData(state => state.knowledgeBase);
    const setKnowledgeBase = (updater: (prev: KnowledgeDocument[]) => KnowledgeDocument[]) => store.set(state => ({ ...state, knowledgeBase: updater(state.knowledgeBase) }));
    return { knowledgeBase, setKnowledgeBase };
};

export const useAgenciesData = () => {
    const agencies = useStoreData(state => state.raahaAgencies);
    const setAgencies = (updater: (prev: Agency[]) => Agency[]) => store.set(state => ({ ...state, raahaAgencies: updater(state.raahaAgencies) }));
    return { agencies, setAgencies };
};

export const useWorkersData = () => {
    const workers = useStoreData(state => state.raahaWorkers);
    const setWorkers = (updater: (prev: RaahaWorker[]) => RaahaWorker[]) => store.set(state => ({ ...state, raahaWorkers: updater(state.raahaWorkers) }));
    return { workers, setWorkers };
};

export const useRequestsData = () => {
    const requests = useStoreData(state => state.raahaRequests);
    const setRaahaRequests = (updater: (prev: HireRequest[]) => HireRequest[]) => store.set(state => ({ ...state, raahaRequests: updater(state.raahaRequests) }));
    return { requests, setRequests: setRaahaRequests };
};

export const useLeasesData = () => {
    const leases = useStoreData(state => state.signedLeases);
    const setLeases = (updater: (prev: SignedLease[]) => SignedLease[]) => store.set(state => ({ ...state, signedLeases: updater(state.signedLeases) }));
    return { leases, setLeases };
};

export const usePropertiesData = () => {
    const properties = useStoreData(state => state.properties);
    const setProperties = (updater: (prev: Property[]) => Property[]) => store.set(state => ({ ...state, properties: updater(state.properties) }));
    return { properties, setProperties };
};

export const useStairspaceData = () => {
    const stairspaceListings = useStoreData(state => state.stairspaceListings);
    const setStairspaceListings = (updater: (prev: StairspaceListing[]) => StairspaceListing[]) => store.set(state => ({ ...state, stairspaceListings: updater(state.stairspaceListings) }));
    return { stairspaceListings, setStairspaceListings };
};

export const useStairspaceRequestsData = () => {
    const stairspaceRequests = useStoreData(state => state.stairspaceRequests);
    const setStairspaceRequests = (updater: (prev: StairspaceRequest[]) => StairspaceRequest[]) => store.set(state => ({ ...state, stairspaceRequests: updater(state.stairspaceRequests) }));
    return { stairspaceRequests, setStairspaceRequests };
};

export const useOpportunitiesData = () => {
    const opportunities = useStoreData(state => state.opportunities);
    const setOpportunities = (updater: (prev: Opportunity[]) => Opportunity[]) => store.set(state => ({ ...state, opportunities: updater(state.opportunities) }));
    return { opportunities, setOpportunities };
};

export const useCostSettingsData = () => {
    const costSettings = useStoreData(state => state.costSettings);
    const setCostSettings = (updater: (prev: CostRate[]) => CostRate[]) => store.set(state => ({...state, costSettings: updater(state.costSettings)}));
    return { costSettings, setCostSettings };
}

export const usePricingData = () => {
    const pricing = useStoreData(state => state.pricing);
    const setPricing = (updater: (prev: Pricing[]) => Pricing[]) => store.set(state => ({...state, pricing: updater(state.pricing)}));
    return { pricing, setPricing };
}

export const useCfoData = () => {
    return useStoreData(state => ({
        kpiData: state.kpiData,
        transactionData: state.transactionData,
        upcomingPayments: state.upcomingPayments,
        vatPayment: state.vatPayment,
        cashFlowData: state.cashFlowData,
    }));
};

export const useStudentsData = () => {
    const students = useStoreData(state => state.students);
    const setStudents = (updater: (prev: Student[]) => Student[]) => store.set(state => ({...state, students: updater(state.students)}));
    return { students, setStudents };
};
