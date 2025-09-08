
'use client';

import { useState, useEffect } from 'react';
import { store } from '@/lib/global-store';
import type { Service } from '@/lib/services';
import type { Product } from '@/lib/products';
import type { Client, Testimonial } from '@/lib/clients';
import type { Provider } from '@/lib/providers';
import type { Agent, AgentCategory } from '@/lib/agents';
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
import type { Student } from '@/lib/students';
import type { CostRate } from '@/lib/cost-settings.schema';
import { kpiData, transactionData, upcomingPayments, vatPayment } from '@/lib/cfo-data';
import type { KpiData, TransactionData, UpcomingPayment, VatPayment } from '@/lib/cfo-data';

export const useServicesData = () => {
    const [data, setData] = useState(store.get());
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
        const unsubscribe = store.subscribe(() => {
            setData(store.get());
        });
        return () => unsubscribe();
    }, []);

    return {
        services: data.services,
        setServices: (updater: (services: Service[]) => void) => {
            store.set(state => ({ ...state, services: updater(state.services) }));
        },
        isClient,
    };
};

export const useProductsData = () => {
    const [data, setData] = useState(store.get());
     const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
        const unsubscribe = store.subscribe(() => {
            setData(store.get());
        });
        return () => unsubscribe();
    }, []);

    return {
        products: data.products,
        setProducts: (updater: (products: Product[]) => void) => {
            store.set(state => ({ ...state, products: updater(state.products) }));
        },
        isClient,
    };
};


export const useClientsData = () => {
    const [data, setData] = useState(store.get());
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
        const unsubscribe = store.subscribe(() => {
            setData(store.get());
        });
        return () => unsubscribe();
    }, []);

    return {
        clients: data.clients,
        setClients: (updater: (clients: Client[]) => void) => {
            store.set(state => ({ ...state, clients: updater(state.clients) }));
        },
        testimonials: data.testimonials,
        setTestimonials: (updater: (testimonials: Testimonial[]) => void) => {
            store.set(state => ({ ...state, testimonials: updater(state.testimonials) }));
        },
        isClient,
    };
};

export const useProvidersData = () => {
    const [data, setData] = useState(store.get());
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
        const unsubscribe = store.subscribe(() => {
            setData(store.get());
        });
        return () => unsubscribe();
    }, []);

    return {
        providers: data.providers,
        setProviders: (updater: (providers: Provider[]) => void) => {
            store.set(state => ({ ...state, providers: updater(state.providers) }));
        },
        isClient,
    };
};

export const useStaffData = () => {
    const [data, setData] = useState(store.get());
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
        const unsubscribe = store.subscribe(() => {
            setData(store.get());
        });
        return () => unsubscribe();
    }, []);

    return {
        leadership: data.leadership,
        setLeadership: (updater: (agents: Agent[]) => void) => {
            store.set(state => ({ ...state, leadership: updater(state.leadership) }));
        },
        staff: data.staff,
        setStaff: (updater: (agents: Agent[]) => void) => {
            store.set(state => ({ ...state, staff: updater(state.staff) }));
        },
        agentCategories: data.agentCategories,
        setAgentCategories: (updater: (categories: AgentCategory[]) => void) => {
            store.set(state => ({ ...state, agentCategories: updater(state.agentCategories) }));
        },
        isClient,
    };
};

export const useCommunitiesData = () => {
    const [data, setData] = useState(store.get());
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
        const unsubscribe = store.subscribe(() => {
            setData(store.get());
        });
        return () => unsubscribe();
    }, []);

    return {
        communities: data.communities,
        setCommunities: (updater: (communities: Community[]) => void) => {
            store.set(state => ({ ...state, communities: updater(state.communities) }));
        },
        isClient,
    };
};

export const useCommunityHubData = () => {
    const [data, setData] = useState(store.get());
     const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
        const unsubscribe = store.subscribe(() => {
            setData(store.get());
        });
        return () => unsubscribe();
    }, []);

    return {
        events: data.communityEvents,
        setEvents: (updater: (events: CommunityEvent[]) => void) => {
            store.set(state => ({ ...state, communityEvents: updater(state.communityEvents) }));
        },
        finances: data.communityFinances,
        setFinances: (updater: (finances: CommunityFinance[]) => void) => {
            store.set(state => ({ ...state, finances: updater(state.communityFinances) }));
        },
        members: data.communityMembers,
        setMembers: (updater: (members: CommunityMember[]) => void) => {
            store.set(state => ({ ...state, communityMembers: updater(state.communityMembers) }));
        },
        isClient,
    };
};

export const useMembersData = () => {
    const [data, setData] = useState(store.get());
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
        const unsubscribe = store.subscribe(() => {
            setData(store.get());
        });
        return () => unsubscribe();
    }, []);

    return {
        members: data.communityMembers,
        setMembers: (updater: (members: CommunityMember[]) => void) => {
            store.set(state => ({ ...state, communityMembers: updater(state.communityMembers) }));
        },
        isClient,
    };
};


export const useOpportunitiesData = () => {
    const [data, setData] = useState(store.get());
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
        const unsubscribe = store.subscribe(() => {
            setData(store.get());
        });
        return () => unsubscribe();
    }, []);

    return {
        opportunities: data.opportunities,
        setOpportunities: (updater: (opportunities: Opportunity[]) => void) => {
            store.set(state => ({ ...state, opportunities: updater(state.opportunities) }));
        },
        isClient,
    };
};

export const useProjectStagesData = () => {
    const [data, setData] = useState(store.get());
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
        const unsubscribe = store.subscribe(() => {
            setData(store.get());
        });
        return () => unsubscribe();
    }, []);

    return {
        stages: data.stages,
        setStages: (updater: (stages: ProjectStage[]) => void) => {
            store.set(state => ({ ...state, stages: updater(state.stages) }));
        },
        isClient,
    };
};

export const useSettingsData = () => {
    const [data, setData] = useState(store.get());
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
        const unsubscribe = store.subscribe(() => {
            setData(store.get());
        });
        return () => unsubscribe();
    }, []);

    return {
        settings: data.settings,
        setSettings: (updater: (settings: AppSettings) => void) => {
            store.set(state => ({ ...state, settings: updater(state.settings) }));
        },
        isClient,
    };
};

export const useAssetsData = () => {
    const [data, setData] = useState(store.get());
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
        const unsubscribe = store.subscribe(() => {
            setData(store.get());
        });
        return () => unsubscribe();
    }, []);

    return {
        assets: data.assets,
        setAssets: (updater: (assets: Asset[]) => void) => {
            store.set(state => ({ ...state, assets: updater(state.assets) }));
        },
        isClient,
    };
};

export const useInvestorsData = () => {
    const [data, setData] = useState(store.get());
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
        const unsubscribe = store.subscribe(() => {
            setData(store.get());
        });
        return () => unsubscribe();
    }, []);

    return {
        investors: data.investors,
        setInvestors: (updater: (investors: Investor[]) => void) => {
            store.set(state => ({ ...state, investors: updater(state.investors) }));
        },
        isClient,
    };
};

export const useKnowledgeData = () => {
    const [data, setData] = useState(store.get());
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
        const unsubscribe = store.subscribe(() => {
            setData(store.get());
        });
        return () => unsubscribe();
    }, []);

    return {
        knowledgeBase: data.knowledgeBase,
        setKnowledgeBase: (updater: (docs: KnowledgeDocument[]) => void) => {
            store.set(state => ({ ...state, knowledgeBase: updater(state.knowledgeBase) }));
        },
        isClient,
    };
};

export const useAgenciesData = () => {
    const [data, setData] = useState(store.get());
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
        const unsubscribe = store.subscribe(() => {
            setData(store.get());
        });
        return () => unsubscribe();
    }, []);

    return {
        agencies: data.raahaAgencies,
        setAgencies: (updater: (agencies: Agency[]) => void) => {
            store.set(state => ({ ...state, raahaAgencies: updater(state.raahaAgencies) }));
        },
        isClient,
    };
};

export const useWorkersData = () => {
    const [data, setData] = useState(store.get());
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
        const unsubscribe = store.subscribe(() => {
            setData(store.get());
        });
        return () => unsubscribe();
    }, []);

    return {
        workers: data.raahaWorkers,
        setWorkers: (updater: (workers: RaahaWorker[]) => void) => {
            store.set(state => ({ ...state, raahaWorkers: updater(state.raahaWorkers) }));
        },
        isClient,
    };
};

export const useRequestsData = () => {
    const [data, setData] = useState(store.get());
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
        const unsubscribe = store.subscribe(() => {
            setData(store.get());
        });
        return () => unsubscribe();
    }, []);

    return {
        requests: data.raahaRequests,
        setRequests: (updater: (requests: HireRequest[]) => void) => {
            store.set(state => ({ ...state, raahaRequests: updater(state.raahaRequests) }));
        },
        isClient,
    };
};

export const useLeasesData = () => {
    const [data, setData] = useState(store.get());
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
        const unsubscribe = store.subscribe(() => {
            setData(store.get());
        });
        return () => unsubscribe();
    }, []);

    return {
        leases: data.signedLeases,
        setLeases: (updater: (leases: SignedLease[]) => void) => {
            store.set(state => ({ ...state, signedLeases: updater(state.signedLeases) }));
        },
        isClient,
    };
};

export const usePropertiesData = () => {
    const [data, setData] = useState(store.get());
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
        const unsubscribe = store.subscribe(() => {
            setData(store.get());
        });
        return () => unsubscribe();
    }, []);

    return {
        properties: data.properties,
        setProperties: (updater: (properties: Property[]) => void) => {
            store.set(state => ({ ...state, properties: updater(state.properties) }));
        },
        isClient,
    };
};

export const useStudentsData = () => {
    const [data, setData] = useState(store.get());
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
        const unsubscribe = store.subscribe(() => {
            setData(store.get());
        });
        return () => unsubscribe();
    }, []);

    return {
        students: data.students,
        setStudents: (updater: (students: Student[]) => void) => {
            store.set(state => ({ ...state, students: updater(state.students) }));
        },
        isClient,
    };
};

export const useCostSettingsData = () => {
    const [data, setData] = useState(store.get());
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
        const unsubscribe = store.subscribe(() => {
            setData(store.get());
        });
        return () => unsubscribe();
    }, []);

    return {
        costSettings: data.costSettings,
        setCostSettings: (updater: (items: CostRate[]) => void) => {
            store.set(state => ({ ...state, costSettings: updater(state.costSettings) }));
        },
        isClient,
    };
};

export const useCfoData = () => {
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    // Data is static, so we don't need to subscribe to the store for it.
    const data = {
        kpiData,
        transactionData,
        upcomingPayments,
        vatPayment
    };
    
    return {
        ...data,
        isClient,
    };
};
