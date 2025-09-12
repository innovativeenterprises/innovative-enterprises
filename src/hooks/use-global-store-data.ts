
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
import type { KpiData, TransactionData, UpcomingPayment, VatPayment } from '@/lib/cfo-data';
import type { Pricing } from '@/lib/pricing';

// This is the new, robust pattern for all client-side data hooks.
// It ensures that components re-render correctly once the global store is hydrated.
function useStoreData<T>(selector: (state: any) => T): T {
    const [data, setData] = useState(() => selector(store.get()));

    useEffect(() => {
        const unsubscribe = store.subscribe(() => {
            setData(selector(store.get()));
        });
        // Ensure data is up-to-date on mount in case it changed between initial state and effect
        setData(selector(store.get())); 
        return unsubscribe;
    }, [selector]);

    return data;
}

const useClientCheck = () => {
    const [isClient, setIsClient] = useState(false);
    useEffect(() => {
        setIsClient(true);
    }, []);
    return isClient;
}


export const useServicesData = () => {
    const services = useStoreData(state => state.services);
    const isClient = useClientCheck();
    return {
        services,
        setServices: (updater: (services: Service[]) => Service[]) => {
            store.set(state => ({ ...state, services: updater(state.services) }));
        },
        isClient,
    };
};

export const useProductsData = () => {
    const products = useStoreData(state => state.products);
    const isClient = useClientCheck();
    return {
        products,
        setProducts: (updater: (products: Product[]) => Product[]) => {
            store.set(state => ({ ...state, products: updater(state.products) }));
        },
        isClient,
    };
};

export const useClientsData = () => {
    const data = useStoreData(state => ({ clients: state.clients, testimonials: state.testimonials }));
    const isClient = useClientCheck();
    return {
        clients: data.clients,
        testimonials: data.testimonials,
        setClients: (updater: (clients: Client[]) => Client[]) => {
            store.set(state => ({ ...state, clients: updater(state.clients) }));
        },
        setTestimonials: (updater: (testimonials: Testimonial[]) => Testimonial[]) => {
            store.set(state => ({ ...state, testimonials: updater(state.testimonials) }));
        },
        isClient,
    };
};

export const useProvidersData = () => {
    const providers = useStoreData(state => state.providers);
    const isClient = useClientCheck();
    return {
        providers,
        setProviders: (updater: (providers: Provider[]) => Provider[]) => {
            store.set(state => ({ ...state, providers: updater(state.providers) }));
        },
        isClient,
    };
};

export const useStaffData = () => {
    const data = useStoreData(state => ({
        leadership: state.leadership,
        staff: state.staff,
        agentCategories: state.agentCategories,
    }));
    const isClient = useClientCheck();
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
        isClient,
    };
};

export const useCommunitiesData = () => {
    const communities = useStoreData(state => state.communities);
    const isClient = useClientCheck();
    return {
        communities,
        setCommunities: (updater: (communities: Community[]) => Community[]) => {
            store.set(state => ({ ...state, communities: updater(state.communities) }));
        },
        isClient,
    };
};

export const useCommunityHubData = () => {
    const data = useStoreData(state => ({
        events: state.communityEvents,
        finances: state.communityFinances,
    }));
    const isClient = useClientCheck();
    return {
        ...data,
        setEvents: (updater: (events: CommunityEvent[]) => CommunityEvent[]) => {
            store.set(state => ({ ...state, communityEvents: updater(state.communityEvents) }));
        },
        setFinances: (updater: (finances: CommunityFinance[]) => CommunityFinance[]) => {
            store.set(state => ({ ...state, communityFinances: updater(state.communityFinances) }));
        },
        isClient,
    };
};

export const useMembersData = () => {
    const members = useStoreData(state => state.communityMembers);
    const isClient = useClientCheck();
    return {
        members,
        setMembers: (updater: (members: CommunityMember[]) => CommunityMember[]) => {
            store.set(state => ({ ...state, communityMembers: updater(state.communityMembers) }));
        },
        isClient,
    };
};

export const useProjectStagesData = () => {
    const stages = useStoreData(state => state.stages);
    const isClient = useClientCheck();
    return {
        stages,
        setStages: (updater: (stages: ProjectStage[]) => ProjectStage[]) => {
            store.set(state => ({ ...state, stages: updater(state.stages) }));
        },
        isClient,
    };
};

export const useSettingsData = () => {
    const settings = useStoreData(state => state.settings);
    const isClient = useClientCheck();
    return {
        settings,
        setSettings: (updater: (settings: AppSettings) => AppSettings) => {
            store.set(state => ({ ...state, settings: updater(state.settings) }));
        },
        isClient,
    };
};

export const useAssetsData = () => {
    const assets = useStoreData(state => state.assets);
    const isClient = useClientCheck();
    return {
        assets,
        setAssets: (updater: (assets: Asset[]) => Asset[]) => {
            store.set(state => ({ ...state, assets: updater(state.assets) }));
        },
        isClient,
    };
};

export const useInvestorsData = () => {
    const investors = useStoreData(state => state.investors);
    const isClient = useClientCheck();
    return {
        investors,
        setInvestors: (updater: (investors: Investor[]) => Investor[]) => {
            store.set(state => ({ ...state, investors: updater(state.investors) }));
        },
        isClient,
    };
};

export const useKnowledgeData = () => {
    const knowledgeBase = useStoreData(state => state.knowledgeBase);
    const isClient = useClientCheck();
    return {
        knowledgeBase,
        setKnowledgeBase: (updater: (docs: KnowledgeDocument[]) => KnowledgeDocument[]) => {
            store.set(state => ({ ...state, knowledgeBase: updater(state.knowledgeBase) }));
        },
        isClient,
    };
};

export const useAgenciesData = () => {
    const agencies = useStoreData(state => state.raahaAgencies);
    const isClient = useClientCheck();
    return {
        agencies,
        setAgencies: (updater: (agencies: Agency[]) => Agency[]) => {
            store.set(state => ({ ...state, raahaAgencies: updater(state.raahaAgencies) }));
        },
        isClient,
    };
};

export const useWorkersData = () => {
    const workers = useStoreData(state => state.raahaWorkers);
    const isClient = useClientCheck();
    return {
        workers,
        setWorkers: (updater: (workers: RaahaWorker[]) => RaahaWorker[]) => {
            store.set(state => ({ ...state, raahaWorkers: updater(state.raahaWorkers) }));
        },
        isClient,
    };
};

export const useRequestsData = () => {
    const requests = useStoreData(state => state.raahaRequests);
    const isClient = useClientCheck();
    return {
        requests,
        setRequests: (updater: (requests: HireRequest[]) => HireRequest[]) => {
            store.set(state => ({ ...state, raahaRequests: updater(state.raahaRequests) }));
        },
        isClient,
    };
};

export const useLeasesData = () => {
    const leases = useStoreData(state => state.signedLeases);
    const isClient = useClientCheck();
    return {
        leases,
        setLeases: (updater: (leases: SignedLease[]) => SignedLease[]) => {
            store.set(state => ({ ...state, signedLeases: updater(state.signedLeases) }));
        },
        isClient,
    };
};

export const usePropertiesData = () => {
    const properties = useStoreData(state => state.properties);
    const isClient = useClientCheck();
    return {
        properties,
        setProperties: (updater: (properties: Property[]) => Property[]) => {
            store.set(state => ({ ...state, properties: updater(state.properties) }));
        },
        isClient,
    };
};

export const useStairspaceData = () => {
    const stairspaceListings = useStoreData(state => state.stairspaceListings);
    const isClient = useClientCheck();
    return {
        stairspaceListings,
        setStairspaceListings: (updater: (listings: StairspaceListing[]) => StairspaceListing[]) => {
            store.set(state => ({ ...state, stairspaceListings: updater(state.stairspaceListings) }));
        },
        isClient,
    };
};

export const useStairspaceRequestsData = () => {
    const stairspaceRequests = useStoreData(state => state.stairspaceRequests);
    const isClient = useClientCheck();
    return {
        stairspaceRequests,
        setStairspaceRequests: (updater: (requests: StairspaceRequest[]) => StairspaceRequest[]) => {
            store.set(state => ({ ...state, stairspaceRequests: updater(state.stairspaceRequests) }));
        },
        isClient,
    };
};

export const useOpportunitiesData = () => {
    const opportunities = useStoreData(state => state.opportunities);
    const isClient = useClientCheck();
    return {
        opportunities,
        setOpportunities: (updater: (opps: Opportunity[]) => Opportunity[]) => {
            store.set(state => ({ ...state, opportunities: updater(state.opportunities) }));
        },
        isClient,
    };
};

export const useCostSettingsData = () => {
    const costSettings = useStoreData(state => state.costSettings);
    const isClient = useClientCheck();
    return {
        costSettings,
        setCostSettings: (updater: (items: CostRate[]) => CostRate[]) => {
            store.set(state => ({...state, costSettings: updater(state.costSettings)}));
        },
        isClient,
    };
}

export const usePricingData = () => {
    const pricing = useStoreData(state => state.pricing);
    const isClient = useClientCheck();
    return {
        pricing,
        setPricing: (updater: (items: Pricing[]) => Pricing[]) => {
            store.set(state => ({...state, pricing: updater(state.pricing)}));
        },
        isClient,
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
    const isClient = useClientCheck();
    return {
        ...data,
        isClient,
    };
};

export const useStudentsData = () => {
    const students = useStoreData(state => state.students);
    const isClient = useClientCheck();
    return {
        students,
        setStudents: (updater: (students: Student[]) => Student[]) => {
            store.set(state => ({...state, students: updater(state.students)}));
        },
        isClient,
    };
};
