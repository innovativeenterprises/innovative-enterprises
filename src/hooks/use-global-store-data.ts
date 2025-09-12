'use client';

import { useSyncExternalStore, useState, useEffect } from 'react';
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

const useClientCheck = () => {
    const [isClient, setIsClient] = useState(false);
    useEffect(() => {
        setIsClient(true);
    }, []);
    return isClient;
}


export const useServicesData = () => {
    const data = useStoreData();
    const isClient = useClientCheck();
    return {
        services: data.services,
        setServices: (updater: (services: Service[]) => void) => {
            store.set(state => ({ ...state, services: updater(state.services) }));
        },
        isClient,
    };
};

export const useProductsData = () => {
    const data = useStoreData();
    const isClient = useClientCheck();
    return {
        products: data.products,
        setProducts: (updater: (products: Product[]) => void) => {
            store.set(state => ({ ...state, products: updater(state.products) }));
        },
        isClient,
    };
};


export const useClientsData = () => {
    const data = useStoreData();
    const isClient = useClientCheck();
    return {
        clients: data.clients,
        testimonials: data.testimonials,
        setClients: (updater: (clients: Client[]) => void) => {
            store.set(state => ({ ...state, clients: updater(state.clients) }));
        },
        setTestimonials: (updater: (testimonials: Testimonial[]) => void) => {
            store.set(state => ({ ...state, testimonials: updater(state.testimonials) }));
        },
        isClient,
    };
};

export const useProvidersData = () => {
    const data = useStoreData();
    const isClient = useClientCheck();
    return {
        providers: data.providers,
        setProviders: (updater: (providers: Provider[]) => void) => {
            store.set(state => ({ ...state, providers: updater(state.providers) }));
        },
        isClient,
    };
};

export const useStaffData = () => {
    const data = useStoreData();
    const isClient = useClientCheck();
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
        isClient,
    };
};

export const useCommunitiesData = () => {
    const data = useStoreData();
    const isClient = useClientCheck();
    return {
        communities: data.communities,
        setCommunities: (updater: (communities: Community[]) => void) => {
            store.set(state => ({ ...state, communities: updater(state.communities) }));
        },
        isClient,
    };
};

export const useCommunityHubData = () => {
    const data = useStoreData();
    const isClient = useClientCheck();
    return {
        events: data.communityEvents,
        finances: data.communityFinances,
        setEvents: (updater: (events: CommunityEvent[]) => void) => {
            store.set(state => ({ ...state, communityEvents: updater(state.communityEvents) }));
        },
        setFinances: (updater: (finances: CommunityFinance[]) => void) => {
            store.set(state => ({ ...state, communityFinances: updater(state.communityFinances) }));
        },
        isClient,
    };
};

export const useMembersData = () => {
    const data = useStoreData();
    const isClient = useClientCheck();
    return {
        members: data.communityMembers,
        setMembers: (updater: (members: CommunityMember[]) => void) => {
            store.set(state => ({ ...state, communityMembers: updater(state.communityMembers) }));
        },
        isClient,
    };
};


export const useProjectStagesData = () => {
    const data = useStoreData();
    const isClient = useClientCheck();
    return {
        stages: data.stages,
        setStages: (updater: (stages: ProjectStage[]) => void) => {
            store.set(state => ({ ...state, stages: updater(state.stages) }));
        },
        isClient,
    };
};

export const useSettingsData = () => {
    const data = useStoreData();
    const isClient = useClientCheck();
    return {
        settings: data.settings,
        setSettings: (updater: (settings: AppSettings) => void) => {
            store.set(state => ({ ...state, settings: updater(state.settings) }));
        },
        isClient,
    };
};

export const useAssetsData = () => {
    const data = useStoreData();
    const isClient = useClientCheck();
    return {
        assets: data.assets,
        setAssets: (updater: (assets: Asset[]) => void) => {
            store.set(state => ({ ...state, assets: updater(state.assets) }));
        },
        isClient,
    };
};

export const useInvestorsData = () => {
    const data = useStoreData();
    const isClient = useClientCheck();
    return {
        investors: data.investors,
        setInvestors: (updater: (investors: Investor[]) => void) => {
            store.set(state => ({ ...state, investors: updater(state.investors) }));
        },
        isClient,
    };
};

export const useKnowledgeData = () => {
    const data = useStoreData();
    const isClient = useClientCheck();
    return {
        knowledgeBase: data.knowledgeBase,
        setKnowledgeBase: (updater: (docs: KnowledgeDocument[]) => void) => {
            store.set(state => ({ ...state, knowledgeBase: updater(state.knowledgeBase) }));
        },
        isClient,
    };
};

export const useAgenciesData = () => {
    const data = useStoreData();
    const isClient = useClientCheck();
    return {
        agencies: data.raahaAgencies,
        setAgencies: (updater: (agencies: Agency[]) => void) => {
            store.set(state => ({ ...state, raahaAgencies: updater(state.raahaAgencies) }));
        },
        isClient,
    };
};

export const useWorkersData = () => {
    const data = useStoreData();
    const isClient = useClientCheck();
    return {
        workers: data.raahaWorkers,
        setWorkers: (updater: (workers: RaahaWorker[]) => void) => {
            store.set(state => ({ ...state, raahaWorkers: updater(state.raahaWorkers) }));
        },
        isClient,
    };
};

export const useRequestsData = () => {
    const data = useStoreData();
    const isClient = useClientCheck();
    return {
        requests: data.raahaRequests,
        setRequests: (updater: (requests: HireRequest[]) => void) => {
            store.set(state => ({ ...state, raahaRequests: updater(state.raahaRequests) }));
        },
        isClient,
    };
};

export const useLeasesData = () => {
    const data = useStoreData();
    const isClient = useClientCheck();
    return {
        leases: data.signedLeases,
        setLeases: (updater: (leases: SignedLease[]) => void) => {
            store.set(state => ({ ...state, signedLeases: updater(state.signedLeases) }));
        },
        isClient,
    };
};

export const usePropertiesData = () => {
    const data = useStoreData();
    const isClient = useClientCheck();
    return {
        properties: data.properties,
        setProperties: (updater: (properties: Property[]) => void) => {
            store.set(state => ({ ...state, properties: updater(state.properties) }));
        },
        isClient,
    };
};

export const useStairspaceData = () => {
    const data = useStoreData();
    const isClient = useClientCheck();
    return {
        stairspaceListings: data.stairspaceListings,
        setStairspaceListings: (updater: (listings: StairspaceListing[]) => void) => {
            store.set(state => ({ ...state, stairspaceListings: updater(state.stairspaceListings) }));
        },
        isClient,
    };
};

export const useStairspaceRequestsData = () => {
    const data = useStoreData();
    const isClient = useClientCheck();
    return {
        stairspaceRequests: data.stairspaceRequests,
        setStairspaceRequests: (updater: (requests: StairspaceRequest[]) => void) => {
            store.set(state => ({ ...state, stairspaceRequests: updater(state.stairspaceRequests) }));
        },
        isClient,
    };
};

export const useOpportunitiesData = () => {
    const data = useStoreData();
    const isClient = useClientCheck();
    return {
        opportunities: data.opportunities,
        setOpportunities: (updater: (opps: Opportunity[]) => void) => {
            store.set(state => ({ ...state, opportunities: updater(state.opportunities) }));
        },
        isClient,
    };
};

export const useCostSettingsData = () => {
    const data = useStoreData();
    const isClient = useClientCheck();
    return {
        costSettings: data.costSettings,
        setCostSettings: (updater: (items: CostRate[]) => void) => {
            store.set(state => ({...state, costSettings: updater(state.costSettings)}));
        },
        isClient,
    };
}

export const usePricingData = () => {
    const data = useStoreData();
    const isClient = useClientCheck();
    return {
        pricing: data.pricing,
        setPricing: (updater: (items: Pricing[]) => void) => {
            store.set(state => ({...state, pricing: updater(state.pricing)}));
        },
        isClient,
    };
}

export const useCfoData = () => {
    const data = useStoreData();
    const isClient = useClientCheck();
    return {
        kpiData: data.kpiData,
        transactionData: data.transactionData,
        upcomingPayments: data.upcomingPayments,
        vatPayment: data.vatPayment,
        isClient,
    };
};

export const useStudentsData = () => {
    const data = useStoreData();
    const isClient = useClientCheck();
    return {
        students: data.students,
        setStudents: (updater: (students: Student[]) => void) => {
            store.set(state => ({...state, students: updater(state.students)}));
        },
        isClient,
    };
};