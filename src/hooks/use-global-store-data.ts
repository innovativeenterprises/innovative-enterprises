

'use client';

import { useState, useEffect } from 'react';
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


function useClientStoreData<T>(selector: (state: any) => T): T | null {
    const [state, setState] = useState<T | null>(null);

    useEffect(() => {
        const updateState = () => {
            setState(selector(store.get()));
        };

        updateState(); // Initial sync
        const unsubscribe = store.subscribe(updateState);
        return () => unsubscribe();
    }, [selector]);

    return state;
}

// --- Data Hooks ---
export const useServicesData = () => {
    const services = useClientStoreData(state => state.services) || [];
    return {
        services,
        setServices: (updater: (prev: Service[]) => Service[]) => store.set(state => ({ ...state, services: updater(state.services) })),
        isClient: services.length > 0 || useClientStoreData(s => s.services) === null ? true : false,
    };
};

export const useProductsData = () => {
    const products = useClientStoreData(state => state.products) || [];
    return {
        products,
        setProducts: (updater: (prev: Product[]) => Product[]) => store.set(state => ({ ...state, products: updater(state.products) })),
        isClient: products.length > 0 || useClientStoreData(s => s.products) === null ? true : false,
    };
};

export const useClientsData = () => {
    const data = useClientStoreData(state => ({ clients: state.clients, testimonials: state.testimonials }));
    return {
        clients: data?.clients || [],
        testimonials: data?.testimonials || [],
        setClients: (updater: (prev: Client[]) => Client[]) => store.set(state => ({ ...state, clients: updater(state.clients) })),
        setTestimonials: (updater: (prev: Testimonial[]) => Testimonial[]) => store.set(state => ({ ...state, testimonials: updater(state.testimonials) })),
        isClient: data !== null,
    };
};

export const useProvidersData = () => {
    const providers = useClientStoreData(state => state.providers) || [];
    return {
        providers,
        setProviders: (updater: (prev: Provider[]) => Provider[]) => store.set(state => ({ ...state, providers: updater(state.providers) })),
        isClient: providers.length > 0 || useClientStoreData(s => s.providers) === null ? true : false,
    };
};

export const useStaffData = () => {
    const data = useClientStoreData(state => ({
        leadership: state.leadership,
        staff: state.staff,
        agentCategories: state.agentCategories,
    }));
    return {
        leadership: data?.leadership || [],
        staff: data?.staff || [],
        agentCategories: data?.agentCategories || [],
        setLeadership: (updater: (prev: Agent[]) => Agent[]) => store.set(state => ({ ...state, leadership: updater(state.leadership) })),
        setStaff: (updater: (prev: Agent[]) => Agent[]) => store.set(state => ({ ...state, staff: updater(state.staff) })),
        setAgentCategories: (updater: (prev: AgentCategory[]) => AgentCategory[]) => store.set(state => ({ ...state, agentCategories: updater(state.agentCategories) })),
        isClient: data !== null,
    };
};

export const useCommunitiesData = () => {
    const communities = useClientStoreData(state => state.communities) || [];
    return {
        communities,
        setCommunities: (updater: (prev: Community[]) => Community[]) => store.set(state => ({ ...state, communities: updater(state.communities) })),
        isClient: communities.length > 0 || useClientStoreData(s => s.communities) === null ? true : false,
    };
};

export const useCommunityHubData = () => {
    const data = useClientStoreData(state => ({
        events: state.communityEvents,
        finances: state.communityFinances,
    }));
    return {
        events: data?.events || [],
        finances: data?.finances || [],
        setCommunityEvents: (updater: (prev: CommunityEvent[]) => CommunityEvent[]) => store.set(state => ({ ...state, communityEvents: updater(state.communityEvents) })),
        setCommunityFinances: (updater: (prev: CommunityFinance[]) => CommunityFinance[]) => store.set(state => ({ ...state, communityFinances: updater(state.communityFinances) })),
        isClient: data !== null,
    };
};

export const useMembersData = () => {
    const members = useClientStoreData(state => state.communityMembers) || [];
    return {
        members,
        setMembers: (updater: (prev: CommunityMember[]) => CommunityMember[]) => store.set(state => ({ ...state, communityMembers: updater(state.communityMembers) })),
        isClient: members.length > 0 || useClientStoreData(s => s.communityMembers) === null ? true : false,
    };
};

export const useProjectStagesData = () => {
    const stages = useClientStoreData(state => state.stages) || [];
    return {
        stages,
        setStages: (updater: (prev: ProjectStage[]) => ProjectStage[]) => store.set(state => ({ ...state, stages: updater(state.stages) })),
        isClient: stages.length > 0 || useClientStoreData(s => s.stages) === null ? true : false,
    };
};

export const useSettingsData = () => {
    const settings = useClientStoreData(state => state.settings);
    return {
        settings,
        setSettings: (updater: (prev: AppSettings) => AppSettings) => store.set(state => ({ ...state, settings: updater(state.settings) })),
        isClient: settings !== null,
    };
};

export const useAssetsData = () => {
    const assets = useClientStoreData(state => state.assets) || [];
    return {
        assets,
        setAssets: (updater: (prev: Asset[]) => Asset[]) => store.set(state => ({ ...state, assets: updater(state.assets) })),
        isClient: assets.length > 0 || useClientStoreData(s => s.assets) === null ? true : false,
    };
};

export const useInvestorsData = () => {
    const investors = useClientStoreData(state => state.investors) || [];
    return {
        investors,
        setInvestors: (updater: (prev: Investor[]) => Investor[]) => store.set(state => ({ ...state, investors: updater(state.investors) })),
        isClient: investors.length > 0 || useClientStoreData(s => s.investors) === null ? true : false,
    };
};

export const useKnowledgeData = () => {
    const knowledgeBase = useClientStoreData(state => state.knowledgeBase) || [];
    return {
        knowledgeBase,
        setKnowledgeBase: (updater: (prev: KnowledgeDocument[]) => KnowledgeDocument[]) => store.set(state => ({ ...state, knowledgeBase: updater(state.knowledgeBase) })),
        isClient: knowledgeBase.length > 0 || useClientStoreData(s => s.knowledgeBase) === null ? true : false,
    };
};

export const useAgenciesData = () => {
    const agencies = useClientStoreData(state => state.raahaAgencies) || [];
    return {
        agencies,
        setAgencies: (updater: (prev: Agency[]) => Agency[]) => store.set(state => ({ ...state, raahaAgencies: updater(state.raahaAgencies) })),
        isClient: agencies.length > 0 || useClientStoreData(s => s.raahaAgencies) === null ? true : false,
    };
};

export const useWorkersData = () => {
    const workers = useClientStoreData(state => state.raahaWorkers) || [];
    return {
        workers,
        setWorkers: (updater: (prev: RaahaWorker[]) => RaahaWorker[]) => store.set(state => ({ ...state, raahaWorkers: updater(state.raahaWorkers) })),
        isClient: workers.length > 0 || useClientStoreData(s => s.raahaWorkers) === null ? true : false,
    };
};

export const useRequestsData = () => {
    const requests = useClientStoreData(state => state.raahaRequests) || [];
    const setRaahaRequests = (updater: (prev: HireRequest[]) => HireRequest[]) => store.set(state => ({ ...state, raahaRequests: updater(state.raahaRequests) }));
    return {
        requests,
        setRaahaRequests,
        isClient: requests.length > 0 || useClientStoreData(s => s.raahaRequests) === null ? true : false,
    };
};

export const useLeasesData = () => {
    const leases = useClientStoreData(state => state.signedLeases) || [];
    return {
        leases,
        setLeases: (updater: (prev: SignedLease[]) => SignedLease[]) => store.set(state => ({ ...state, signedLeases: updater(state.signedLeases) })),
        isClient: leases.length > 0 || useClientStoreData(s => s.signedLeases) === null ? true : false,
    };
};

export const usePropertiesData = () => {
    const properties = useClientStoreData(state => state.properties) || [];
    return {
        properties,
        setProperties: (updater: (prev: Property[]) => Property[]) => store.set(state => ({ ...state, properties: updater(state.properties) })),
        isClient: properties.length > 0 || useClientStoreData(s => s.properties) === null ? true : false,
    };
};

export const useStairspaceData = () => {
    const stairspaceListings = useClientStoreData(state => state.stairspaceListings) || [];
    return {
        stairspaceListings,
        setStairspaceListings: (updater: (prev: StairspaceListing[]) => StairspaceListing[]) => store.set(state => ({ ...state, stairspaceListings: updater(state.stairspaceListings) })),
        isClient: stairspaceListings.length > 0 || useClientStoreData(s => s.stairspaceListings) === null ? true : false,
    };
};

export const useStairspaceRequestsData = () => {
    const stairspaceRequests = useClientStoreData(state => state.stairspaceRequests) || [];
    const setStairspaceRequests = (updater: (prev: StairspaceRequest[]) => StairspaceRequest[]) => store.set(state => ({ ...state, stairspaceRequests: updater(state.stairspaceRequests) }));
    return {
        stairspaceRequests,
        setStairspaceRequests,
        isClient: stairspaceRequests.length > 0 || useClientStoreData(s => s.stairspaceRequests) === null ? true : false,
    };
};

export const useOpportunitiesData = () => {
    const opportunities = useClientStoreData(state => state.opportunities) || [];
    return {
        opportunities,
        setOpportunities: (updater: (prev: Opportunity[]) => Opportunity[]) => store.set(state => ({ ...state, opportunities: updater(state.opportunities) })),
        isClient: opportunities.length > 0 || useClientStoreData(s => s.opportunities) === null ? true : false,
    };
};

export const useCostSettingsData = () => {
    const costSettings = useClientStoreData(state => state.costSettings) || [];
    return {
        costSettings,
        setCostSettings: (updater: (prev: CostRate[]) => CostRate[]) => store.set(state => ({ ...state, costSettings: updater(state.costSettings) })),
        isClient: costSettings.length > 0 || useClientStoreData(s => s.costSettings) === null ? true : false,
    };
}

export const usePricingData = () => {
    const pricing = useClientStoreData(state => state.pricing) || [];
    return {
        pricing,
        setPricing: (updater: (prev: Pricing[]) => Pricing[]) => store.set(state => ({ ...state, pricing: updater(state.pricing) })),
        isClient: pricing.length > 0 || useClientStoreData(s => s.pricing) === null ? true : false,
    };
}

export const useCfoData = () => {
    const data = useClientStoreData(state => ({
        kpiData: state.kpiData,
        transactionData: state.transactionData,
        upcomingPayments: state.upcomingPayments,
        vatPayment: state.vatPayment,
        cashFlowData: state.cashFlowData,
    }));
    return {
        kpiData: data?.kpiData || [],
        transactionData: data?.transactionData || [],
        upcomingPayments: data?.upcomingPayments || [],
        vatPayment: data?.vatPayment || { amount: 0, dueDate: '' },
        cashFlowData: data?.cashFlowData || [],
        isClient: data !== null,
    };
};

export const useStudentsData = () => {
    const students = useClientStoreData(state => state.students) || [];
    return {
        students,
        setStudents: (updater: (prev: Student[]) => Student[]) => store.set(state => ({...state, students: updater(state.students)})),
        isClient: students.length > 0 || useClientStoreData(s => s.students) === null ? true : false,
    };
};
