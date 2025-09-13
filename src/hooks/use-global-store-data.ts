
'use client';

import { useSyncExternalStore, useMemo } from 'react';
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

export const setServices = (updater: (prev: Service[]) => Service[]) => {
    store.set(state => ({ ...state, services: updater(state.services) }));
};
export const useServicesData = () => {
    const services = useStoreData(state => state.services);
    return useMemo(() => ({ services, isClient: true }), [services]);
};

export const setProducts = (updater: (prev: Product[]) => Product[]) => {
    store.set(state => ({ ...state, products: updater(state.products) }));
};
export const useProductsData = () => {
    const products = useStoreData(state => state.products);
    return useMemo(() => ({ products, isClient: true }), [products]);
};

export const setClients = (updater: (prev: Client[]) => Client[]) => {
    store.set(state => ({ ...state, clients: updater(state.clients) }));
};
export const setTestimonials = (updater: (prev: Testimonial[]) => Testimonial[]) => {
    store.set(state => ({ ...state, testimonials: updater(state.testimonials) }));
};
export const useClientsData = () => {
    const data = useStoreData(state => ({ clients: state.clients, testimonials: state.testimonials }));
    return useMemo(() => ({ ...data, isClient: true }), [data]);
};

export const setProviders = (updater: (prev: Provider[]) => Provider[]) => {
    store.set(state => ({ ...state, providers: updater(state.providers) }));
};
export const useProvidersData = () => {
    const providers = useStoreData(state => state.providers);
    return useMemo(() => ({ providers, isClient: true }), [providers]);
};

export const setLeadership = (updater: (prev: Agent[]) => Agent[]) => {
    store.set(state => ({ ...state, leadership: updater(state.leadership) }));
};
export const setStaff = (updater: (prev: Agent[]) => Agent[]) => {
    store.set(state => ({ ...state, staff: updater(state.staff) }));
};
export const setAgentCategories = (updater: (prev: AgentCategory[]) => AgentCategory[]) => {
    store.set(state => ({ ...state, agentCategories: updater(state.agentCategories) }));
};
export const useStaffData = () => {
    const data = useStoreData(state => ({
        leadership: state.leadership,
        staff: state.staff,
        agentCategories: state.agentCategories,
    }));
    return useMemo(() => ({ ...data, isClient: true }), [data]);
};

export const setCommunities = (updater: (prev: Community[]) => Community[]) => {
    store.set(state => ({ ...state, communities: updater(state.communities) }));
};
export const useCommunitiesData = () => {
    const communities = useStoreData(state => state.communities);
    return useMemo(() => ({ communities, isClient: true }), [communities]);
};

export const setCommunityEvents = (updater: (prev: CommunityEvent[]) => CommunityEvent[]) => {
    store.set(state => ({ ...state, communityEvents: updater(state.communityEvents) }));
};
export const setCommunityFinances = (updater: (prev: CommunityFinance[]) => CommunityFinance[]) => {
    store.set(state => ({ ...state, communityFinances: updater(state.communityFinances) }));
};
export const useCommunityHubData = () => {
    const data = useStoreData(state => ({
        events: state.communityEvents,
        finances: state.communityFinances,
    }));
    return useMemo(() => ({ 
        events: data.events,
        finances: data.finances,
        isClient: true 
    }), [data.events, data.finances]);
};

export const setCommunityMembers = (updater: (prev: CommunityMember[]) => CommunityMember[]) => {
    store.set(state => ({ ...state, communityMembers: updater(state.communityMembers) }));
};
export const useMembersData = () => {
    const members = useStoreData(state => state.communityMembers);
    return useMemo(() => ({ members, setMembers: setCommunityMembers, isClient: true }), [members]);
};

export const setStages = (updater: (prev: ProjectStage[]) => ProjectStage[]) => {
    store.set(state => ({ ...state, stages: updater(state.stages) }));
};
export const useProjectStagesData = () => {
    const stages = useStoreData(state => state.stages);
    return useMemo(() => ({ stages, setStages, isClient: true }), [stages]);
};

export const setSettings = (updater: (prev: AppSettings) => AppSettings) => {
    store.set(state => ({ ...state, settings: updater(state.settings) }));
};
export const useSettingsData = () => {
    const settings = useStoreData(state => state.settings);
    return useMemo(() => ({ settings, isClient: true }), [settings]);
};

export const setAssets = (updater: (prev: Asset[]) => Asset[]) => {
    store.set(state => ({ ...state, assets: updater(state.assets) }));
};
export const useAssetsData = () => {
    const assets = useStoreData(state => state.assets);
    return useMemo(() => ({ assets, isClient: true }), [assets]);
};

export const setInvestors = (updater: (prev: Investor[]) => Investor[]) => {
    store.set(state => ({ ...state, investors: updater(state.investors) }));
};
export const useInvestorsData = () => {
    const investors = useStoreData(state => state.investors);
    return useMemo(() => ({ investors, isClient: true }), [investors]);
};

export const setKnowledgeBase = (updater: (prev: KnowledgeDocument[]) => KnowledgeDocument[]) => {
    store.set(state => ({ ...state, knowledgeBase: updater(state.knowledgeBase) }));
};
export const useKnowledgeData = () => {
    const knowledgeBase = useStoreData(state => state.knowledgeBase);
    return useMemo(() => ({ knowledgeBase, isClient: true }), [knowledgeBase]);
};

export const setRaahaAgencies = (updater: (prev: Agency[]) => Agency[]) => {
    store.set(state => ({ ...state, raahaAgencies: updater(state.raahaAgencies) }));
};
export const useAgenciesData = () => {
    const agencies = useStoreData(state => state.raahaAgencies);
    return useMemo(() => ({ agencies, isClient: true }), [agencies]);
};

export const setRaahaWorkers = (updater: (prev: RaahaWorker[]) => RaahaWorker[]) => {
    store.set(state => ({ ...state, raahaWorkers: updater(state.raahaWorkers) }));
};
export const useWorkersData = () => {
    const workers = useStoreData(state => state.raahaWorkers);
    return useMemo(() => ({ workers, setWorkers: setRaahaWorkers, isClient: true }), [workers]);
};

export const setRaahaRequests = (updater: (prev: HireRequest[]) => HireRequest[]) => {
    store.set(state => ({ ...state, raahaRequests: updater(state.raahaRequests) }));
};
export const useRequestsData = () => {
    const requests = useStoreData(state => state.raahaRequests);
    return useMemo(() => ({ requests, setRequests: setRaahaRequests, isClient: true }), [requests]);
};

export const setSignedLeases = (updater: (prev: SignedLease[]) => SignedLease[]) => {
    store.set(state => ({ ...state, signedLeases: updater(state.signedLeases) }));
};
export const useLeasesData = () => {
    const leases = useStoreData(state => state.signedLeases);
    return useMemo(() => ({ leases, setLeases: setSignedLeases, isClient: true }), [leases]);
};

export const setProperties = (updater: (prev: Property[]) => Property[]) => {
    store.set(state => ({ ...state, properties: updater(state.properties) }));
};
export const usePropertiesData = () => {
    const properties = useStoreData(state => state.properties);
    return useMemo(() => ({ properties, isClient: true }), [properties]);
};

export const setStairspaceListings = (updater: (prev: StairspaceListing[]) => StairspaceListing[]) => {
    store.set(state => ({ ...state, stairspaceListings: updater(state.stairspaceListings) }));
};
export const useStairspaceData = () => {
    const stairspaceListings = useStoreData(state => state.stairspaceListings);
    return useMemo(() => ({ stairspaceListings, setStairspaceListings, isClient: true }), [stairspaceListings]);
};

export const setStairspaceRequests = (updater: (prev: StairspaceRequest[]) => StairspaceRequest[]) => {
    store.set(state => ({ ...state, stairspaceRequests: updater(state.stairspaceRequests) }));
};
export const useStairspaceRequestsData = () => {
    const stairspaceRequests = useStoreData(state => state.stairspaceRequests);
    return useMemo(() => ({ stairspaceRequests, setStairspaceRequests, isClient: true }), [stairspaceRequests]);
};

export const setOpportunities = (updater: (prev: Opportunity[]) => Opportunity[]) => {
    store.set(state => ({ ...state, opportunities: updater(state.opportunities) }));
};
export const useOpportunitiesData = () => {
    const opportunities = useStoreData(state => state.opportunities);
    return useMemo(() => ({ opportunities, isClient: true }), [opportunities]);
};

export const setCostSettings = (updater: (prev: CostRate[]) => CostRate[]) => {
    store.set(state => ({...state, costSettings: updater(state.costSettings)}));
};
export const useCostSettingsData = () => {
    const costSettings = useStoreData(state => state.costSettings);
    return useMemo(() => ({ costSettings, setCostSettings, isClient: true }), [costSettings]);
};

export const setPricing = (updater: (prev: Pricing[]) => Pricing[]) => {
    store.set(state => ({...state, pricing: updater(state.pricing)}));
};
export const usePricingData = () => {
    const pricing = useStoreData(state => state.pricing);
    return useMemo(() => ({ pricing, isClient: true }), [pricing]);
};

export const useCfoData = () => {
    const data = useStoreData(state => ({
        kpiData: state.kpiData,
        transactionData: state.transactionData,
        upcomingPayments: state.upcomingPayments,
        vatPayment: state.vatPayment,
        cashFlowData: state.cashFlowData,
    }));
    return useMemo(() => ({
        ...data,
        isClient: true,
    }), [data]);
};

export const setStudents = (updater: (prev: Student[]) => Student[]) => {
    store.set(state => ({...state, students: updater(state.students)}));
};
export const useStudentsData = () => {
    const students = useStoreData(state => state.students);
    return useMemo(() => ({ students, setStudents, isClient: true }), [students]);
};
