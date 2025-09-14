

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
 * The selector is applied *after* the state is retrieved to prevent infinite loops.
 */
function useStoreData<T>(selector: (state: any) => T): T {
    const state = useSyncExternalStore(
        store.subscribe,
        store.get,
        store.getSsrState
    );
    return useMemo(() => selector(state), [state, selector]);
}

export const useServicesData = () => {
    const services = useStoreData(state => state.services);
    return {
        services,
        setServices: (updater: (services: Service[]) => Service[]) => {
            store.set(state => ({ ...state, services: updater(state.services) }));
        },
        isClient: true, // Now always client-safe due to useSyncExternalStore
    };
};

export const useProductsData = () => {
    const products = useStoreData(state => state.products);
    return {
        products,
        setProducts: (updater: (products: Product[]) => Product[]) => {
            store.set(state => ({ ...state, products: updater(state.products) }));
        },
        isClient: true,
    };
};


export const useClientsData = () => {
    const data = useStoreData(state => ({ clients: state.clients, testimonials: state.testimonials }));
    return {
        ...data,
        setClients: (updater: (clients: Client[]) => Client[]) => {
            store.set(state => ({ ...state, clients: updater(state.clients) }));
        },
        setTestimonials: (updater: (testimonials: Testimonial[]) => Testimonial[]) => {
            store.set(state => ({ ...state, testimonials: updater(state.testimonials) }));
        },
        isClient: true,
    };
};

export const useProvidersData = () => {
    const providers = useStoreData(state => state.providers);
    return {
        providers,
        setProviders: (updater: (providers: Provider[]) => Provider[]) => {
            store.set(state => ({ ...state, providers: updater(state.providers) }));
        },
        isClient: true,
    };
};

export const useStaffData = () => {
    const data = useStoreData(state => ({
        leadership: state.leadership,
        staff: state.staff,
        agentCategories: state.agentCategories,
    }));
    return {
        ...data,
        setLeadership: (updater: (agents: Agent[]) => Agent[]) => {
            store.set(state => ({ ...state, leadership: updater(state.leadership) }));
        },
        setStaff: (updater: (agents: Agent[]) => Agent[]) => {
            store.set(state => ({ ...state, staff: updater(state.staff) }));
        },
        setAgentCategories: (updater: (categories: AgentCategory[]) => AgentCategory[]) => {
            store.set(state => ({ ...state, agentCategories: updater(state.agentCategories) }));
        },
        isClient: true,
    };
};

export const useCommunitiesData = () => {
    const communities = useStoreData(state => state.communities);
    return {
        communities,
        setCommunities: (updater: (communities: Community[]) => Community[]) => {
            store.set(state => ({ ...state, communities: updater(state.communities) }));
        },
        isClient: true,
    };
};

export const useCommunityHubData = () => {
    const data = useStoreData(state => ({
        events: state.communityEvents,
        finances: state.communityFinances,
    }));
    return {
        ...data,
        setCommunityEvents: (updater: (events: CommunityEvent[]) => CommunityEvent[]) => {
            store.set(state => ({ ...state, communityEvents: updater(state.communityEvents) }));
        },
        setCommunityFinances: (updater: (finances: CommunityFinance[]) => CommunityFinance[]) => {
            store.set(state => ({ ...state, communityFinances: updater(state.communityFinances) }));
        },
        isClient: true,
    };
};

export const useMembersData = () => {
    const members = useStoreData(state => state.communityMembers);
    return {
        members,
        setMembers: (updater: (members: CommunityMember[]) => CommunityMember[]) => {
            store.set(state => ({ ...state, communityMembers: updater(state.communityMembers) }));
        },
        isClient: true,
    };
};

export const useProjectStagesData = () => {
    const stages = useStoreData(state => state.stages);
    return {
        stages,
        setStages: (updater: (stages: ProjectStage[]) => ProjectStage[]) => {
            store.set(state => ({ ...state, stages: updater(state.stages) }));
        },
        isClient: true,
    };
};

export const useSettingsData = () => {
    const settings = useStoreData(state => state.settings);
    return {
        settings,
        setSettings: (updater: (settings: AppSettings) => AppSettings) => {
            store.set(state => ({ ...state, settings: updater(state.settings) }));
        },
        isClient: true,
    };
};

export const useAssetsData = () => {
    const assets = useStoreData(state => state.assets);
    return {
        assets,
        setAssets: (updater: (assets: Asset[]) => Asset[]) => {
            store.set(state => ({ ...state, assets: updater(state.assets) }));
        },
        isClient: true,
    };
};

export const useInvestorsData = () => {
    const investors = useStoreData(state => state.investors);
    return {
        investors,
        setInvestors: (updater: (investors: Investor[]) => Investor[]) => {
            store.set(state => ({ ...state, investors: updater(state.investors) }));
        },
        isClient: true,
    };
};

export const useKnowledgeData = () => {
    const knowledgeBase = useStoreData(state => state.knowledgeBase);
    return {
        knowledgeBase,
        setKnowledgeBase: (updater: (docs: KnowledgeDocument[]) => KnowledgeDocument[]) => {
            store.set(state => ({ ...state, knowledgeBase: updater(state.knowledgeBase) }));
        },
        isClient: true,
    };
};

export const useAgenciesData = () => {
    const agencies = useStoreData(state => state.raahaAgencies);
    return {
        agencies,
        setAgencies: (updater: (agencies: Agency[]) => Agency[]) => {
            store.set(state => ({ ...state, raahaAgencies: updater(state.raahaAgencies) }));
        },
        isClient: true,
    };
};

export const useWorkersData = () => {
    const workers = useStoreData(state => state.raahaWorkers);
    return {
        workers,
        setWorkers: (updater: (workers: RaahaWorker[]) => RaahaWorker[]) => {
            store.set(state => ({...state, raahaWorkers: updater(state.raahaWorkers)}));
        },
        isClient: true,
    };
};

export const useRequestsData = () => {
    const requests = useStoreData(state => state.raahaRequests);
    return {
        requests,
        setRequests: (updater: (requests: HireRequest[]) => HireRequest[]) => {
            store.set(state => ({ ...state, raahaRequests: updater(state.raahaRequests) }));
        },
        isClient: true,
    };
};

export const useLeasesData = () => {
    const leases = useStoreData(state => state.signedLeases);
    return {
        leases,
        setLeases: (updater: (leases: SignedLease[]) => SignedLease[]) => {
            store.set(state => ({ ...state, signedLeases: updater(state.signedLeases) }));
        },
        isClient: true,
    };
};

export const usePropertiesData = () => {
    const properties = useStoreData(state => state.properties);
    return {
        properties,
        setProperties: (updater: (properties: Property[]) => Property[]) => {
            store.set(state => ({ ...state, properties: updater(state.properties) }));
        },
        isClient: true,
    };
};

export const useStairspaceData = () => {
    const stairspaceListings = useStoreData(state => state.stairspaceListings);
    return {
        stairspaceListings,
        setStairspaceListings: (updater: (listings: StairspaceListing[]) => StairspaceListing[]) => {
            store.set(state => ({ ...state, stairspaceListings: updater(state.stairspaceListings) }));
        },
        isClient: true,
    };
};

export const useStairspaceRequestsData = () => {
    const stairspaceRequests = useStoreData(state => state.stairspaceRequests);
    return {
        stairspaceRequests,
        setStairspaceRequests: (updater: (requests: StairspaceRequest[]) => StairspaceRequest[]) => {
            store.set(state => ({ ...state, stairspaceRequests: updater(state.stairspaceRequests) }));
        },
        isClient: true,
    };
};

export const useOpportunitiesData = () => {
    const opportunities = useStoreData(state => state.opportunities);
    return {
        opportunities,
        setOpportunities: (updater: (opps: Opportunity[]) => Opportunity[]) => {
            store.set(state => ({ ...state, opportunities: updater(state.opportunities) }));
        },
        isClient: true,
    };
};

export const useCostSettingsData = () => {
    const costSettings = useStoreData(state => state.costSettings);
    return { 
        costSettings,
        setCostSettings: (updater: (items: CostRate[]) => CostRate[]) => {
            store.set(state => ({...state, costSettings: updater(state.costSettings)}));
        },
        isClient: true 
    };
}

export const usePricingData = () => {
    const pricing = useStoreData(state => state.pricing);
    return {
        pricing,
        setPricing: (updater: (items: Pricing[]) => Pricing[]) => {
            store.set(state => ({...state, pricing: updater(state.pricing)}));
        },
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
        setStudents: (updater: (students: Student[]) => Student[]) => {
            store.set(state => ({...state, students: updater(state.students)}));
        },
        isClient: true,
    };
};

// Direct setter functions that can be called from anywhere
export const setServices = (updater: (services: Service[]) => Service[]) => store.set(state => ({ ...state, services: updater(state.services) }));
export const setProducts = (updater: (products: Product[]) => Product[]) => store.set(state => ({ ...state, products: updater(state.products) }));
export const setClients = (updater: (clients: Client[]) => Client[]) => store.set(state => ({ ...state, clients: updater(state.clients) }));
export const setTestimonials = (updater: (testimonials: Testimonial[]) => Testimonial[]) => store.set(state => ({ ...state, testimonials: updater(state.testimonials) }));
export const setProviders = (updater: (providers: Provider[]) => Provider[]) => store.set(state => ({ ...state, providers: updater(state.providers) }));
export const setLeadership = (updater: (agents: Agent[]) => Agent[]) => store.set(state => ({ ...state, leadership: updater(state.leadership) }));
export const setStaff = (updater: (agents: Agent[]) => Agent[]) => store.set(state => ({ ...state, staff: updater(state.staff) }));
export const setAgentCategories = (updater: (categories: AgentCategory[]) => AgentCategory[]) => store.set(state => ({ ...state, agentCategories: updater(state.agentCategories) }));
export const setCommunities = (updater: (communities: Community[]) => Community[]) => store.set(state => ({ ...state, communities: updater(state.communities) }));
export const setCommunityEvents = (updater: (events: CommunityEvent[]) => CommunityEvent[]) => store.set(state => ({ ...state, communityEvents: updater(state.communityEvents) }));
export const setCommunityFinances = (updater: (finances: CommunityFinance[]) => CommunityFinance[]) => store.set(state => ({ ...state, communityFinances: updater(state.communityFinances) }));
export const setCommunityMembers = (updater: (members: CommunityMember[]) => CommunityMember[]) => store.set(state => ({...state, communityMembers: updater(state.communityMembers)}));
export const setProjectStages = (updater: (stages: ProjectStage[]) => ProjectStage[]) => store.set(state => ({ ...state, stages: updater(state.stages) }));
export const setSettings = (updater: (settings: AppSettings) => AppSettings) => store.set(state => ({ ...state, settings: updater(state.settings) }));
export const setAssets = (updater: (assets: Asset[]) => Asset[]) => store.set(state => ({ ...state, assets: updater(state.assets) }));
export const setInvestors = (updater: (investors: Investor[]) => Investor[]) => store.set(state => ({ ...state, investors: updater(state.investors) }));
export const setKnowledgeBase = (updater: (docs: KnowledgeDocument[]) => KnowledgeDocument[]) => store.set(state => ({ ...state, knowledgeBase: updater(state.knowledgeBase) }));
export const setRaahaAgencies = (updater: (agencies: Agency[]) => Agency[]) => store.set(state => ({ ...state, raahaAgencies: updater(state.raahaAgencies) }));
export const setRaahaWorkers = (updater: (workers: RaahaWorker[]) => RaahaWorker[]) => store.set(state => ({ ...state, raahaWorkers: updater(state.raahaWorkers) }));
export const setRaahaRequests = (updater: (requests: HireRequest[]) => HireRequest[]) => store.set(state => ({ ...state, raahaRequests: updater(state.raahaRequests) }));
export const setProperties = (updater: (properties: Property[]) => Property[]) => store.set(state => ({ ...state, properties: updater(state.properties) }));
export const setStairspaceListings = (updater: (listings: StairspaceListing[]) => StairspaceListing[]) => store.set(state => ({ ...state, stairspaceListings: updater(state.stairspaceListings) }));
export const setStairspaceRequests = (updater: (requests: StairspaceRequest[]) => StairspaceRequest[]) => store.set(state => ({ ...state, stairspaceRequests: updater(state.stairspaceRequests) }));
export const setOpportunities = (updater: (opps: Opportunity[]) => Opportunity[]) => store.set(state => ({ ...state, opportunities: updater(state.opportunities) }));
export const setCostSettings = (updater: (items: CostRate[]) => CostRate[]) => store.set(state => ({...state, costSettings: updater(state.costSettings)}));
export const setPricing = (updater: (items: Pricing[]) => Pricing[]) => store.set(state => ({...state, pricing: updater(state.pricing)}));
export const setStudents = (updater: (students: Student[]) => Student[]) => store.set(state => ({...state, students: updater(state.students)}));
export const setSignedLeases = (updater: (leases: SignedLease[]) => SignedLease[]) => store.set(state => ({ ...state, signedLeases: updater(state.signedLeases) }));
