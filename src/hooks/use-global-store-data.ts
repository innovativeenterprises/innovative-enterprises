

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

export const useServicesData = () => {
    const [data, setData] = useState(store.get());

    useEffect(() => {
        const unsubscribe = store.subscribe(() => {
            setData(store.get());
        });
        return () => unsubscribe();
    }, []);

    return {
        services: data.services,
        setServices: (updater: (services: Service[]) => Service[]) => {
            store.set(state => ({ ...state, services: updater(state.services) }));
        },
    };
};

export const useProductsData = () => {
    const [data, setData] = useState(store.get());

    useEffect(() => {
        const unsubscribe = store.subscribe(() => {
            setData(store.get());
        });
        return () => unsubscribe();
    }, []);

    return {
        products: data.products,
        setProducts: (updater: (products: Product[]) => Product[]) => {
            store.set(state => ({ ...state, products: updater(state.products) }));
        },
    };
};


export const useClientsData = () => {
    const [data, setData] = useState(store.get());

    useEffect(() => {
        const unsubscribe = store.subscribe(() => {
            setData(store.get());
        });
        return () => unsubscribe();
    }, []);

    return {
        clients: data.clients,
        setClients: (updater: (clients: Client[]) => Client[]) => {
            store.set(state => ({ ...state, clients: updater(state.clients) }));
        },
        testimonials: data.testimonials,
        setTestimonials: (updater: (testimonials: Testimonial[]) => Testimonial[]) => {
            store.set(state => ({ ...state, testimonials: updater(state.testimonials) }));
        },
    };
};

export const useProvidersData = () => {
    const [data, setData] = useState(store.get());

    useEffect(() => {
        const unsubscribe = store.subscribe(() => {
            setData(store.get());
        });
        return () => unsubscribe();
    }, []);

    return {
        providers: data.providers,
        setProviders: (updater: (providers: Provider[]) => Provider[]) => {
            store.set(state => ({ ...state, providers: updater(state.providers) }));
        },
    };
};

export const useStaffData = () => {
    const [data, setData] = useState(store.get());

    useEffect(() => {
        // Initialize the store with data from agents.ts if it's not already there
        if(store.get().leadership.length === 0) {
            store.set(state => ({
                ...state,
                leadership: initialStaffData.leadership,
                staff: initialStaffData.staff,
                agentCategories: initialStaffData.agentCategories
            }));
        }

        const unsubscribe = store.subscribe(() => {
            setData(store.get());
        });
        return () => unsubscribe();
    }, []);

    return {
        leadership: data.leadership,
        setLeadership: (updater: (agents: Agent[]) => Agent[]) => {
            store.set(state => ({ ...state, leadership: updater(state.leadership) }));
        },
        staff: data.staff,
        setStaff: (updater: (agents: Agent[]) => Agent[]) => {
            store.set(state => ({ ...state, staff: updater(state.staff) }));
        },
        agentCategories: data.agentCategories,
        setAgentCategories: (updater: (categories: AgentCategory[]) => AgentCategory[]) => {
            store.set(state => ({ ...state, agentCategories: updater(state.agentCategories) }));
        },
    };
};

export const useCommunitiesData = () => {
    const [data, setData] = useState(store.get());

    useEffect(() => {
        const unsubscribe = store.subscribe(() => {
            setData(store.get());
        });
        return () => unsubscribe();
    }, []);

    return {
        communities: data.communities,
        setCommunities: (updater: (communities: Community[]) => Community[]) => {
            store.set(state => ({ ...state, communities: updater(state.communities) }));
        },
    };
};

export const useCommunityHubData = () => {
    const [data, setData] = useState(store.get());

    useEffect(() => {
        const unsubscribe = store.subscribe(() => {
            setData(store.get());
        });
        return () => unsubscribe();
    }, []);

    return {
        events: data.communityEvents,
        setEvents: (updater: (events: CommunityEvent[]) => CommunityEvent[]) => {
            store.set(state => ({ ...state, communityEvents: updater(state.communityEvents) }));
        },
        finances: data.communityFinances,
        setFinances: (updater: (finances: CommunityFinance[]) => CommunityFinance[]) => {
            store.set(state => ({ ...state, finances: updater(state.communityFinances) }));
        },
        members: data.communityMembers,
        setMembers: (updater: (members: CommunityMember[]) => CommunityMember[]) => {
            store.set(state => ({ ...state, communityMembers: updater(state.communityMembers) }));
        },
    };
};

export const useMembersData = () => {
    const [data, setData] = useState(store.get());

    useEffect(() => {
        const unsubscribe = store.subscribe(() => {
            setData(store.get());
        });
        return () => unsubscribe();
    }, []);

    return {
        members: data.communityMembers,
        setMembers: (updater: (members: CommunityMember[]) => CommunityMember[]) => {
            store.set(state => ({ ...state, communityMembers: updater(state.communityMembers) }));
        },
    };
};


export const useProjectStagesData = () => {
    const [data, setData] = useState(store.get());

    useEffect(() => {
        const unsubscribe = store.subscribe(() => {
            setData(store.get());
        });
        return () => unsubscribe();
    }, []);

    return {
        stages: data.stages,
        setStages: (updater: (stages: ProjectStage[]) => ProjectStage[]) => {
            store.set(state => ({ ...state, stages: updater(state.stages) }));
        },
    };
};

export const useSettingsData = () => {
    const [data, setData] = useState(store.get());

    useEffect(() => {
        const unsubscribe = store.subscribe(() => {
            setData(store.get());
        });
        return () => unsubscribe();
    }, []);

    return {
        settings: data.settings,
        setSettings: (updater: (settings: AppSettings) => AppSettings) => {
            store.set(state => ({ ...state, settings: updater(state.settings) }));
        },
    };
};

export const useAssetsData = () => {
    const [data, setData] = useState(store.get());

    useEffect(() => {
        const unsubscribe = store.subscribe(() => {
            setData(store.get());
        });
        return () => unsubscribe();
    }, []);

    return {
        assets: data.assets,
        setAssets: (updater: (assets: Asset[]) => Asset[]) => {
            store.set(state => ({ ...state, assets: updater(state.assets) }));
        },
    };
};

export const useInvestorsData = () => {
    const [data, setData] = useState(store.get());

    useEffect(() => {
        const unsubscribe = store.subscribe(() => {
            setData(store.get());
        });
        return () => unsubscribe();
    }, []);

    return {
        investors: data.investors,
        setInvestors: (updater: (investors: Investor[]) => Investor[]) => {
            store.set(state => ({ ...state, investors: updater(state.investors) }));
        },
    };
};

export const useKnowledgeData = () => {
    const [data, setData] = useState(store.get());

    useEffect(() => {
        const unsubscribe = store.subscribe(() => {
            setData(store.get());
        });
        return () => unsubscribe();
    }, []);

    return {
        knowledgeBase: data.knowledgeBase,
        setKnowledgeBase: (updater: (docs: KnowledgeDocument[]) => KnowledgeDocument[]) => {
            store.set(state => ({ ...state, knowledgeBase: updater(state.knowledgeBase) }));
        },
    };
};

export const useAgenciesData = () => {
    const [data, setData] = useState(store.get());

    useEffect(() => {
        const unsubscribe = store.subscribe(() => {
            setData(store.get());
        });
        return () => unsubscribe();
    }, []);

    return {
        agencies: data.raahaAgencies,
        setAgencies: (updater: (agencies: Agency[]) => Agency[]) => {
            store.set(state => ({ ...state, raahaAgencies: updater(state.raahaAgencies) }));
        },
    };
};

export const useWorkersData = () => {
    const [data, setData] = useState(store.get());

    useEffect(() => {
        const unsubscribe = store.subscribe(() => {
            setData(store.get());
        });
        return () => unsubscribe();
    }, []);

    return {
        workers: data.raahaWorkers,
        setWorkers: (updater: (workers: RaahaWorker[]) => RaahaWorker[]) => {
            store.set(state => ({ ...state, raahaWorkers: updater(state.raahaWorkers) }));
        },
    };
};

export const useRequestsData = () => {
    const [data, setData] = useState(store.get());

    useEffect(() => {
        const unsubscribe = store.subscribe(() => {
            setData(store.get());
        });
        return () => unsubscribe();
    }, []);

    return {
        requests: data.raahaRequests,
        setRequests: (updater: (requests: HireRequest[]) => HireRequest[]) => {
            store.set(state => ({ ...state, raahaRequests: updater(state.raahaRequests) }));
        },
    };
};

export const useLeasesData = () => {
    const [data, setData] = useState(store.get());

    useEffect(() => {
        const unsubscribe = store.subscribe(() => {
            setData(store.get());
        });
        return () => unsubscribe();
    }, []);

    return {
        leases: data.signedLeases,
        setLeases: (updater: (leases: SignedLease[]) => SignedLease[]) => {
            store.set(state => ({ ...state, signedLeases: updater(state.signedLeases) }));
        },
    };
};

export const usePropertiesData = () => {
    const [data, setData] = useState(store.get());

    useEffect(() => {
        const unsubscribe = store.subscribe(() => {
            setData(store.get());
        });
        return () => unsubscribe();
    }, []);

    return {
        properties: data.properties,
        setProperties: (updater: (properties: Property[]) => Property[]) => {
            store.set(state => ({ ...state, properties: updater(state.properties) }));
        },
    };
};

export const useStairspaceData = () => {
    const [data, setData] = useState(store.get());

    useEffect(() => {
        const unsubscribe = store.subscribe(() => {
            setData(store.get());
        });
        return () => unsubscribe();
    }, []);

    return {
        stairspaceListings: data.stairspaceListings,
        setStairspaceListings: (updater: (listings: StairspaceListing[]) => StairspaceListing[]) => {
            store.set(state => ({ ...state, stairspaceListings: updater(state.stairspaceListings) }));
        },
    };
};

export const useStairspaceRequestsData = () => {
    const [data, setData] = useState(store.get());

    useEffect(() => {
        const unsubscribe = store.subscribe(() => {
            setData(store.get());
        });
        return () => unsubscribe();
    }, []);

    return {
        stairspaceRequests: data.stairspaceRequests,
        setStairspaceRequests: (updater: (requests: StairspaceRequest[]) => StairspaceRequest[]) => {
            store.set(state => ({ ...state, stairspaceRequests: updater(state.stairspaceRequests) }));
        },
    };
};

export const useOpportunitiesData = () => {
    const [data, setData] = useState(store.get());

    useEffect(() => {
        const unsubscribe = store.subscribe(() => {
            setData(store.get());
        });
        return () => unsubscribe();
    }, []);

    return {
        opportunities: data.opportunities,
        setOpportunities: (updater: (opps: Opportunity[]) => Opportunity[]) => {
            store.set(state => ({ ...state, opportunities: updater(state.opportunities) }));
        },
    };
};

export const useCfoData = () => {
    const [data, setData] = useState(store.get());

    useEffect(() => {
        const unsubscribe = store.subscribe(() => {
            setData(store.get());
        });
        return () => unsubscribe();
    }, []);

    return {
        kpiData: data.kpiData,
        transactionData: data.transactionData,
        upcomingPayments: data.upcomingPayments,
        vatPayment: data.vatPayment,
    };
};
