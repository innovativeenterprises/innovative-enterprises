
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

const useStoreData = () => {
    return useSyncExternalStore(store.subscribe, store.get, store.get);
}

const useIsClient = () => {
    const [isClient, setIsClient] = useState(false);
    useEffect(() => {
        setIsClient(true);
    }, []);
    return isClient;
}


export const useServicesData = () => {
    const data = useStoreData();
    return {
        ...data,
        setServices: (updater: (services: Service[]) => void) => {
            store.set(state => ({ ...state, services: updater(state.services) }));
        },
    };
};

export const useProductsData = () => {
    const data = useStoreData();
    const isClient = useIsClient();
    return {
        ...data,
        isClient,
        setProducts: (updater: (products: Product[]) => void) => {
            store.set(state => ({ ...state, products: updater(state.products) }));
        },
    };
};


export const useClientsData = () => {
    const data = useStoreData();
    return {
        ...data,
        setClients: (updater: (clients: Client[]) => void) => {
            store.set(state => ({ ...state, clients: updater(state.clients) }));
        },
        setTestimonials: (updater: (testimonials: Testimonial[]) => void) => {
            store.set(state => ({ ...state, testimonials: updater(state.testimonials) }));
        },
    };
};

export const useProvidersData = () => {
    const data = useStoreData();
    const isClient = useIsClient();
    return {
        ...data,
        isClient,
        setProviders: (updater: (providers: Provider[]) => void) => {
            store.set(state => ({ ...state, providers: updater(state.providers) }));
        },
    };
};

export const useStaffData = () => {
    const data = useStoreData();
    const isClient = useIsClient();
    return {
        ...data,
        isClient,
        setLeadership: (updater: (agents: Agent[]) => void) => {
            store.set(state => ({ ...state, leadership: updater(state.leadership) }));
        },
        setStaff: (updater: (agents: Agent[]) => void) => {
            store.set(state => ({ ...state, staff: updater(state.staff) }));
        },
        setAgentCategories: (updater: (categories: AgentCategory[]) => void) => {
            store.set(state => ({ ...state, agentCategories: updater(state.agentCategories) }));
        },
    };
};

export const useCommunitiesData = () => {
    const data = useStoreData();
    const isClient = useIsClient();
    return {
        ...data,
        isClient,
        setCommunities: (updater: (communities: Community[]) => void) => {
            store.set(state => ({ ...state, communities: updater(state.communities) }));
        },
    };
};

export const useCommunityHubData = () => {
    const data = useStoreData();
    const isClient = useIsClient();
    return {
        ...data,
        isClient,
        setEvents: (updater: (events: CommunityEvent[]) => void) => {
            store.set(state => ({ ...state, communityEvents: updater(state.communityEvents) }));
        },
        setFinances: (updater: (finances: CommunityFinance[]) => void) => {
            store.set(state => ({ ...state, finances: updater(state.communityFinances) }));
        },
    };
};

export const useMembersData = () => {
    const data = useStoreData();
    const isClient = useIsClient();
    return {
        ...data,
        isClient,
        setMembers: (updater: (members: CommunityMember[]) => void) => {
            store.set(state => ({ ...state, communityMembers: updater(state.communityMembers) }));
        },
    };
};


export const useProjectStagesData = () => {
    const data = useStoreData();
    const isClient = useIsClient();
    return {
        ...data,
        isClient,
        setStages: (updater: (stages: ProjectStage[]) => void) => {
            store.set(state => ({ ...state, stages: updater(state.stages) }));
        },
    };
};

export const useSettingsData = () => {
    const data = useStoreData();
    const isClient = useIsClient();
    return {
        ...data,
        isClient,
        setSettings: (updater: (settings: AppSettings) => void) => {
            store.set(state => ({ ...state, settings: updater(state.settings) }));
        },
    };
};

export const useAssetsData = () => {
    const data = useStoreData();
    const isClient = useIsClient();
    return {
        ...data,
        isClient,
        setAssets: (updater: (assets: Asset[]) => void) => {
            store.set(state => ({ ...state, assets: updater(state.assets) }));
        },
    };
};

export const useInvestorsData = () => {
    const data = useStoreData();
    const isClient = useIsClient();
    return {
        ...data,
        isClient,
        setInvestors: (updater: (investors: Investor[]) => void) => {
            store.set(state => ({ ...state, investors: updater(state.investors) }));
        },
    };
};

export const useKnowledgeData = () => {
    const data = useStoreData();
    const isClient = useIsClient();
    return {
        ...data,
        isClient,
        setKnowledgeBase: (updater: (docs: KnowledgeDocument[]) => void) => {
            store.set(state => ({ ...state, knowledgeBase: updater(state.knowledgeBase) }));
        },
    };
};

export const useAgenciesData = () => {
    const data = useStoreData();
    const isClient = useIsClient();
    return {
        ...data,
        isClient,
        setAgencies: (updater: (agencies: Agency[]) => void) => {
            store.set(state => ({ ...state, raahaAgencies: updater(state.raahaAgencies) }));
        },
    };
};

export const useWorkersData = () => {
    const data = useStoreData();
    const isClient = useIsClient();
    return {
        ...data,
        isClient,
        setWorkers: (updater: (workers: RaahaWorker[]) => void) => {
            store.set(state => ({ ...state, raahaWorkers: updater(state.raahaWorkers) }));
        },
    };
};

export const useRequestsData = () => {
    const data = useStoreData();
    const isClient = useIsClient();
    return {
        ...data,
        isClient,
        setRequests: (updater: (requests: HireRequest[]) => void) => {
            store.set(state => ({ ...state, raahaRequests: updater(state.raahaRequests) }));
        },
    };
};

export const useLeasesData = () => {
    const data = useStoreData();
    const isClient = useIsClient();
    return {
        ...data,
        isClient,
        setLeases: (updater: (leases: SignedLease[]) => void) => {
            store.set(state => ({ ...state, signedLeases: updater(state.signedLeases) }));
        },
    };
};

export const usePropertiesData = () => {
    const data = useStoreData();
    const isClient = useIsClient();
    return {
        ...data,
        isClient,
        setProperties: (updater: (properties: Property[]) => void) => {
            store.set(state => ({ ...state, properties: updater(state.properties) }));
        },
    };
};

export const useStairspaceData = () => {
    const data = useStoreData();
    const isClient = useIsClient();
    return {
        ...data,
        isClient,
        setStairspaceListings: (updater: (listings: StairspaceListing[]) => void) => {
            store.set(state => ({ ...state, stairspaceListings: updater(state.stairspaceListings) }));
        },
    };
};

export const useStairspaceRequestsData = () => {
    const data = useStoreData();
    const isClient = useIsClient();
    return {
        ...data,
        isClient,
        setStairspaceRequests: (updater: (requests: StairspaceRequest[]) => void) => {
            store.set(state => ({ ...state, stairspaceRequests: updater(state.stairspaceRequests) }));
        },
    };
};

export const useOpportunitiesData = () => {
    const data = useStoreData();
    const isClient = useIsClient();
    return {
        ...data,
        isClient,
        setOpportunities: (updater: (opps: Opportunity[]) => void) => {
            store.set(state => ({ ...state, opportunities: updater(state.opportunities) }));
        },
    };
};

export const useCfoData = () => {
    const data = useStoreData();
    const isClient = useIsClient();
    return {
        ...data,
        isClient,
    };
};

export const useCostSettingsData = () => {
    const data = useStoreData();
    const isClient = useIsClient();
    return {
        ...data,
        isClient,
        setCostSettings: (updater: (items: CostRate[]) => void) => {
            store.set(state => ({...state, costSettings: updater(state.costSettings)}));
        }
    };
}
