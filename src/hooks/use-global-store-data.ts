

'use client';

import { useState, useEffect } from 'react';
import { store } from '@/lib/global-store';
import type { Service } from '@/lib/services';
import type { Product } from '@/lib/products';
import type { Client, Testimonial } from '@/lib/clients';
import type { Provider } from '@/lib/providers';
import { initialStaffData, type Agent, type AgentCategory } from '@/lib/agents';
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
import { kpiData, transactionData, upcomingPayments, vatPayment } from '@/lib/cfo-data';

const useStoreData = () => {
    const [data, setData] = useState(() => store.get());
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
        const unsubscribe = store.subscribe(() => {
            setData(store.get());
        });
        return () => unsubscribe();
    }, []);
    
    return { ...data, isClient };
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
    return {
        ...data,
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
    return {
        ...data,
        setProviders: (updater: (providers: Provider[]) => void) => {
            store.set(state => ({ ...state, providers: updater(state.providers) }));
        },
    };
};

export const useStaffData = () => {
    const data = useStoreData();
    return {
        ...data,
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
    return {
        ...data,
        setCommunities: (updater: (communities: Community[]) => void) => {
            store.set(state => ({ ...state, communities: updater(state.communities) }));
        },
    };
};

export const useCommunityHubData = () => {
    const data = useStoreData();
    return {
        ...data,
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
    return {
        ...data,
        setMembers: (updater: (members: CommunityMember[]) => void) => {
            store.set(state => ({ ...state, communityMembers: updater(state.communityMembers) }));
        },
    };
};


export const useProjectStagesData = () => {
    const data = useStoreData();
    return {
        ...data,
        setStages: (updater: (stages: ProjectStage[]) => void) => {
            store.set(state => ({ ...state, stages: updater(state.stages) }));
        },
    };
};

export const useSettingsData = () => {
    const data = useStoreData();
    return {
        ...data,
        setSettings: (updater: (settings: AppSettings) => void) => {
            store.set(state => ({ ...state, settings: updater(state.settings) }));
        },
    };
};

export const useAssetsData = () => {
    const data = useStoreData();
    return {
        ...data,
        setAssets: (updater: (assets: Asset[]) => void) => {
            store.set(state => ({ ...state, assets: updater(state.assets) }));
        },
    };
};

export const useInvestorsData = () => {
    const data = useStoreData();
    return {
        ...data,
        setInvestors: (updater: (investors: Investor[]) => void) => {
            store.set(state => ({ ...state, investors: updater(state.investors) }));
        },
    };
};

export const useKnowledgeData = () => {
    const data = useStoreData();
    return {
        ...data,
        setKnowledgeBase: (updater: (docs: KnowledgeDocument[]) => void) => {
            store.set(state => ({ ...state, knowledgeBase: updater(state.knowledgeBase) }));
        },
    };
};

export const useAgenciesData = () => {
    const data = useStoreData();
    return {
        ...data,
        setAgencies: (updater: (agencies: Agency[]) => void) => {
            store.set(state => ({ ...state, raahaAgencies: updater(state.raahaAgencies) }));
        },
    };
};

export const useWorkersData = () => {
    const data = useStoreData();
    return {
        ...data,
        setWorkers: (updater: (workers: RaahaWorker[]) => void) => {
            store.set(state => ({ ...state, raahaWorkers: updater(state.raahaWorkers) }));
        },
    };
};

export const useRequestsData = () => {
    const data = useStoreData();
    return {
        ...data,
        setRequests: (updater: (requests: HireRequest[]) => void) => {
            store.set(state => ({ ...state, raahaRequests: updater(state.raahaRequests) }));
        },
    };
};

export const useLeasesData = () => {
    const data = useStoreData();
    return {
        ...data,
        setLeases: (updater: (leases: SignedLease[]) => void) => {
            store.set(state => ({ ...state, signedLeases: updater(state.signedLeases) }));
        },
    };
};

export const usePropertiesData = () => {
    const data = useStoreData();
    return {
        ...data,
        setProperties: (updater: (properties: Property[]) => void) => {
            store.set(state => ({ ...state, properties: updater(state.properties) }));
        },
    };
};

export const useStairspaceData = () => {
    const data = useStoreData();
    return {
        ...data,
        setStairspaceListings: (updater: (listings: StairspaceListing[]) => void) => {
            store.set(state => ({ ...state, stairspaceListings: updater(state.stairspaceListings) }));
        },
    };
};

export const useStairspaceRequestsData = () => {
    const data = useStoreData();
    return {
        ...data,
        setStairspaceRequests: (updater: (requests: StairspaceRequest[]) => void) => {
            store.set(state => ({ ...state, stairspaceRequests: updater(state.stairspaceRequests) }));
        },
    };
};

export const useOpportunitiesData = () => {
    const data = useStoreData();
    return {
        ...data,
        setOpportunities: (updater: (opps: Opportunity[]) => void) => {
            store.set(state => ({ ...state, opportunities: updater(state.opportunities) }));
        },
    };
};

export const useCfoData = () => {
    const data = useStoreData();
    return {
        ...data
    };
};
    