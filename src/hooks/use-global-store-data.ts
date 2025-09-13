

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

export function useServicesData() {
    const services = useStoreData(state => state.services);
    return {
        services,
        setServices: (updater: (services: Service[]) => Service[]) => {
            store.set(state => ({ ...state, services: updater(state.services) }));
        },
        isClient: true,
    };
};

export function useProductsData() {
    const products = useStoreData(state => state.products);
    return {
        products,
        setProducts: (updater: (products: Product[]) => Product[]) => {
            store.set(state => ({ ...state, products: updater(state.products) }));
        },
        isClient: true,
    };
};


export function useClientsData() {
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

export function useProvidersData() {
    const providers = useStoreData(state => state.providers);
    return {
        providers,
        setProviders: (updater: (providers: Provider[]) => Provider[]) => {
            store.set(state => ({ ...state, providers: updater(state.providers) }));
        },
        isClient: true,
    };
};

export function useStaffData() {
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

export function useCommunitiesData() {
    const communities = useStoreData(state => state.communities);
    return {
        communities,
        setCommunities: (updater: (communities: Community[]) => Community[]) => {
            store.set(state => ({ ...state, communities: updater(state.communities) }));
        },
        isClient: true,
    };
};

export function useCommunityHubData() {
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

export function useMembersData() {
    const members = useStoreData(state => state.communityMembers);
    return {
        members,
        setMembers: (updater: (members: CommunityMember[]) => CommunityMember[]) => {
            store.set(state => ({ ...state, communityMembers: updater(state.communityMembers) }));
        },
        isClient: true,
    };
};

export function useProjectStagesData() {
    const stages = useStoreData(state => state.stages);
    return {
        stages,
        setStages: (updater: (stages: ProjectStage[]) => ProjectStage[]) => {
            store.set(state => ({ ...state, stages: updater(state.stages) }));
        },
        isClient: true,
    };
};

export function useSettingsData() {
    const settings = useStoreData(state => state.settings);
    return {
        settings,
        setSettings: (updater: (settings: AppSettings) => AppSettings) => {
            store.set(state => ({ ...state, settings: updater(state.settings) }));
        },
        isClient: true,
    };
};

export function useAssetsData() {
    const assets = useStoreData(state => state.assets);
    return {
        assets,
        setAssets: (updater: (assets: Asset[]) => Asset[]) => {
            store.set(state => ({ ...state, assets: updater(state.assets) }));
        },
        isClient: true,
    };
};

export function useInvestorsData() {
    const investors = useStoreData(state => state.investors);
    return {
        investors,
        setInvestors: (updater: (investors: Investor[]) => Investor[]) => {
            store.set(state => ({ ...state, investors: updater(state.investors) }));
        },
        isClient: true,
    };
};

export function useKnowledgeData() {
    const knowledgeBase = useStoreData(state => state.knowledgeBase);
    return {
        knowledgeBase,
        setKnowledgeBase: (updater: (docs: KnowledgeDocument[]) => KnowledgeDocument[]) => {
            store.set(state => ({ ...state, knowledgeBase: updater(state.knowledgeBase) }));
        },
        isClient: true,
    };
};

export function useAgenciesData() {
    const agencies = useStoreData(state => state.raahaAgencies);
    return {
        agencies,
        setAgencies: (updater: (agencies: Agency[]) => Agency[]) => {
            store.set(state => ({ ...state, raahaAgencies: updater(state.raahaAgencies) }));
        },
        isClient: true,
    };
};

export function useWorkersData() {
    const workers = useStoreData(state => state.raahaWorkers);
    return {
        workers,
        setWorkers: (updater: (workers: RaahaWorker[]) => RaahaWorker[]) => {
            store.set(state => ({ ...state, raahaWorkers: updater(state.raahaWorkers) }));
        },
        isClient: true,
    };
};

export function useRequestsData() {
    const requests = useStoreData(state => state.raahaRequests);
    const setRaahaRequests = (updater: (requests: HireRequest[]) => HireRequest[]) => store.set(state => ({ ...state, raahaRequests: updater(state.raahaRequests) }));
    return {
        requests,
        setRaahaRequests,
        isClient: true,
    };
};

export function useLeasesData() {
    const leases = useStoreData(state => state.signedLeases);
    return {
        leases,
        setLeases: (updater: (leases: SignedLease[]) => SignedLease[]) => {
            store.set(state => ({ ...state, signedLeases: updater(state.signedLeases) }));
        },
        isClient: true,
    };
};

export function usePropertiesData() {
    const properties = useStoreData(state => state.properties);
    return {
        properties,
        setProperties: (updater: (properties: Property[]) => Property[]) => {
            store.set(state => ({ ...state, properties: updater(state.properties) }));
        },
        isClient: true,
    };
};

export function useStairspaceData() {
    const stairspaceListings = useStoreData(state => state.stairspaceListings);
    return {
        stairspaceListings,
        setStairspaceListings: (updater: (listings: StairspaceListing[]) => StairspaceListing[]) => {
            store.set(state => ({ ...state, stairspaceListings: updater(state.stairspaceListings) }));
        },
        isClient: true,
    };
};

export function useStairspaceRequestsData() {
    const stairspaceRequests = useStoreData(state => state.stairspaceRequests);
    const setStairspaceRequests = (updater: (requests: StairspaceRequest[]) => StairspaceRequest[]) => store.set(state => ({ ...state, stairspaceRequests: updater(state.stairspaceRequests) }));
    return {
        stairspaceRequests,
        setStairspaceRequests,
        isClient: true,
    };
};

export function useOpportunitiesData() {
    const opportunities = useStoreData(state => state.opportunities);
    return {
        opportunities,
        setOpportunities: (updater: (opps: Opportunity[]) => Opportunity[]) => {
            store.set(state => ({ ...state, opportunities: updater(state.opportunities) }));
        },
        isClient: true,
    };
};

export function useCostSettingsData() {
    const costSettings = useStoreData(state => state.costSettings);
    return {
        costSettings,
        setCostSettings: (updater: (items: CostRate[]) => CostRate[]) => {
            store.set(state => ({...state, costSettings: updater(state.costSettings)}));
        },
        isClient: true,
    };
}

export function usePricingData() {
    const pricing = useStoreData(state => state.pricing);
    return {
        pricing,
        setPricing: (updater: (items: Pricing[]) => Pricing[]) => {
            store.set(state => ({...state, pricing: updater(state.pricing)}));
        },
        isClient: true,
    };
}

export function useCfoData() {
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

export function useStudentsData() {
    const students = useStoreData(state => state.students);
    return {
        students,
        setStudents: (updater: (students: Student[]) => Student[]) => {
            store.set(state => ({...state, students: updater(state.students)}));
        },
        isClient: true,
    };
};
// Export setters directly
export const { setServices } = useServicesData();
export const { setProducts } = useProductsData();
export const { setClients, setTestimonials } = useClientsData();
export const { setProviders } = useProvidersData();
export const { setLeadership, setStaff, setAgentCategories } = useStaffData();
export const { setCommunities } = useCommunitiesData();
export const { setCommunityEvents, setCommunityFinances } = useCommunityHubData();
export const { setMembers } = useMembersData();
export const { setProjectStages } = useProjectStagesData();
export const { setSettings } = useSettingsData();
export const { setAssets } = useAssetsData();
export const { setInvestors } = useInvestorsData();
export const { setKnowledgeBase } = useKnowledgeData();
export const { setAgencies } = useAgenciesData();
export const { setWorkers } = useWorkersData();
export const { setRaahaRequests } = useRequestsData();
export const { setLeases } = useLeasesData();
export const { setProperties } = usePropertiesData();
export const { setStairspaceListings } = useStairspaceData();
export const { setStairspaceRequests } = useStairspaceRequestsData();
export const { setOpportunities } = useOpportunitiesData();
export const { setCostSettings } = useCostSettingsData();
export const { setPricing } = usePricingData();
export const { setStudents } = useStudentsData();
