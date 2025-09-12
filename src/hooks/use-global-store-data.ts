
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
import type { KpiData, TransactionData, UpcomingPayment, VatPayment } from '@/lib/cfo-data';
import type { Pricing } from '@/lib/pricing';


const useStoreData = () => {
    return useSyncExternalStore(store.subscribe, store.get, store.get);
}

export const useServicesData = () => {
    const data = useStoreData();
    return {
        services: data.services,
        setServices: (updater: (services: Service[]) => void) => {
            store.set(state => ({ ...state, services: updater(state.services) }));
        },
        isClient: true,
    };
};

export const useProductsData = () => {
    const data = useStoreData();
    return {
        products: data.products,
        setProducts: (updater: (products: Product[]) => void) => {
            store.set(state => ({ ...state, products: updater(state.products) }));
        },
        isClient: true,
    };
};


export const useClientsData = () => {
    const data = useStoreData();
    return {
        clients: data.clients,
        testimonials: data.testimonials,
        setClients: (updater: (clients: Client[]) => void) => {
            store.set(state => ({ ...state, clients: updater(state.clients) }));
        },
        setTestimonials: (updater: (testimonials: Testimonial[]) => void) => {
            store.set(state => ({ ...state, testimonials: updater(state.testimonials) }));
        },
        isClient: true,
    };
};

export const useProvidersData = () => {
    const data = useStoreData();
    return {
        providers: data.providers,
        setProviders: (updater: (providers: Provider[]) => void) => {
            store.set(state => ({ ...state, providers: updater(state.providers) }));
        },
        isClient: true,
    };
};

export const useStaffData = () => {
    const data = useStoreData();
    return {
        leadership: data.leadership,
        staff: data.staff,
        agentCategories: data.agentCategories,
        setLeadership: (updater: (agents: Agent[]) => void) => {
            store.set(state => ({ ...state, leadership: updater(state.leadership) }));
        },
        setStaff: (updater: (agents: Agent[]) => void) => {
            store.set(state => ({ ...state, staff: updater(state.staff) }));
        },
        setAgentCategories: (updater: (categories: AgentCategory[]) => void) => {
            store.set(state => ({ ...state, agentCategories: updater(state.agentCategories) }));
        },
        isClient: true,
    };
};

export const useCommunitiesData = () => {
    const data = useStoreData();
    return {
        communities: data.communities,
        setCommunities: (updater: (communities: Community[]) => void) => {
            store.set(state => ({ ...state, communities: updater(state.communities) }));
        },
        isClient: true,
    };
};

export const useCommunityHubData = () => {
    const data = useStoreData();
    return {
        events: data.communityEvents,
        finances: data.communityFinances,
        setEvents: (updater: (events: CommunityEvent[]) => void) => {
            store.set(state => ({ ...state, communityEvents: updater(state.communityEvents) }));
        },
        setFinances: (updater: (finances: CommunityFinance[]) => void) => {
            store.set(state => ({ ...state, communityFinances: updater(state.communityFinances) }));
        },
        isClient: true,
    };
};

export const useMembersData = () => {
    const data = useStoreData();
    return {
        members: data.communityMembers,
        setMembers: (updater: (members: CommunityMember[]) => void) => {
            store.set(state => ({ ...state, communityMembers: updater(state.communityMembers) }));
        },
        isClient: true,
    };
};


export const useProjectStagesData = () => {
    const data = useStoreData();
    return {
        stages: data.stages,
        setStages: (updater: (stages: ProjectStage[]) => void) => {
            store.set(state => ({ ...state, stages: updater(state.stages) }));
        },
        isClient: true,
    };
};

export const useSettingsData = () => {
    const data = useStoreData();
    return {
        settings: data.settings,
        setSettings: (updater: (settings: AppSettings) => void) => {
            store.set(state => ({ ...state, settings: updater(state.settings) }));
        },
        isClient: true,
    };
};

export const useAssetsData = () => {
    const data = useStoreData();
    return {
        assets: data.assets,
        setAssets: (updater: (assets: Asset[]) => void) => {
            store.set(state => ({ ...state, assets: updater(state.assets) }));
        },
        isClient: true,
    };
};

export const useInvestorsData = () => {
    const data = useStoreData();
    return {
        investors: data.investors,
        setInvestors: (updater: (investors: Investor[]) => void) => {
            store.set(state => ({ ...state, investors: updater(state.investors) }));
        },
        isClient: true,
    };
};

export const useKnowledgeData = () => {
    const data = useStoreData();
    return {
        knowledgeBase: data.knowledgeBase,
        setKnowledgeBase: (updater: (docs: KnowledgeDocument[]) => void) => {
            store.set(state => ({ ...state, knowledgeBase: updater(state.knowledgeBase) }));
        },
        isClient: true,
    };
};

export const useAgenciesData = () => {
    const data = useStoreData();
    return {
        agencies: data.raahaAgencies,
        setAgencies: (updater: (agencies: Agency[]) => void) => {
            store.set(state => ({ ...state, raahaAgencies: updater(state.raahaAgencies) }));
        },
        isClient: true,
    };
};

export const useWorkersData = () => {
    const data = useStoreData();
    return {
        workers: data.raahaWorkers,
        setWorkers: (updater: (workers: RaahaWorker[]) => void) => {
            store.set(state => ({ ...state, raahaWorkers: updater(state.raahaWorkers) }));
        },
        isClient: true,
    };
};

export const useRequestsData = () => {
    const data = useStoreData();
    return {
        requests: data.raahaRequests,
        setRequests: (updater: (requests: HireRequest[]) => void) => {
            store.set(state => ({ ...state, raahaRequests: updater(state.raahaRequests) }));
        },
        isClient: true,
    };
};

export const useLeasesData = () => {
    const data = useStoreData();
    return {
        leases: data.signedLeases,
        setLeases: (updater: (leases: SignedLease[]) => void) => {
            store.set(state => ({ ...state, signedLeases: updater(state.signedLeases) }));
        },
        isClient: true,
    };
};

export const usePropertiesData = () => {
    const data = useStoreData();
    return {
        properties: data.properties,
        setProperties: (updater: (properties: Property[]) => void) => {
            store.set(state => ({ ...state, properties: updater(state.properties) }));
        },
        isClient: true,
    };
};

export const useStairspaceData = () => {
    const data = useStoreData();
    return {
        stairspaceListings: data.stairspaceListings,
        setStairspaceListings: (updater: (listings: StairspaceListing[]) => void) => {
            store.set(state => ({ ...state, stairspaceListings: updater(state.stairspaceListings) }));
        },
        isClient: true,
    };
};

export const useStairspaceRequestsData = () => {
    const data = useStoreData();
    return {
        stairspaceRequests: data.stairspaceRequests,
        setStairspaceRequests: (updater: (requests: StairspaceRequest[]) => void) => {
            store.set(state => ({ ...state, stairspaceRequests: updater(state.stairspaceRequests) }));
        },
        isClient: true,
    };
};

export const useOpportunitiesData = () => {
    const data = useStoreData();
    return {
        opportunities: data.opportunities,
        setOpportunities: (updater: (opps: Opportunity[]) => void) => {
            store.set(state => ({ ...state, opportunities: updater(state.opportunities) }));
        },
        isClient: true,
    };
};

export const useCostSettingsData = () => {
    const data = useStoreData();
    return {
        costSettings: data.costSettings,
        setCostSettings: (updater: (items: CostRate[]) => void) => {
            store.set(state => ({...state, costSettings: updater(state.costSettings)}));
        },
        isClient: true,
    };
}

export const usePricingData = () => {
    const data = useStoreData();
    return {
        pricing: data.pricing,
        setPricing: (updater: (items: Pricing[]) => void) => {
            store.set(state => ({...state, pricing: updater(state.pricing)}));
        },
        isClient: true,
    };
}

export const useCfoData = () => {
    const data = useStoreData();
    return {
        kpiData: data.kpiData,
        transactionData: data.transactionData,
        upcomingPayments: data.upcomingPayments,
        vatPayment: data.vatPayment,
        isClient: true,
    };
};
