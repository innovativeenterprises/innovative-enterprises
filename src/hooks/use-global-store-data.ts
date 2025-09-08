
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
import type { Worker } from '@/lib/raaha-workers';
import type { SignedLease } from '@/lib/leases';
import type { Property } from '@/lib/properties';
import type { Pricing } from '@/lib/pricing';
import type { Student } from '@/lib/students';
import type { CostRate } from '@/lib/cost-settings.schema';

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
        setServices: (updater: (services: Service[]) => Service[]) => {
            const currentServices = store.get().services;
            const newServices = updater(currentServices);
            store.set(state => ({ ...state, services: newServices }));
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
        setProducts: (updater: (products: Product[]) => Product[]) => {
            const currentProducts = store.get().products;
            const newProducts = updater(currentProducts);
            store.set(state => ({ ...state, products: newProducts }));
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
        setClients: (updater: (clients: Client[]) => Client[]) => {
            const currentClients = store.get().clients;
            const newClients = updater(currentClients);
            store.set(state => ({ ...state, clients: newClients }));
        },
        testimonials: data.testimonials,
        setTestimonials: (updater: (testimonials: Testimonial[]) => Testimonial[]) => {
             const currentTestimonials = store.get().testimonials;
            const newTestimonials = updater(currentTestimonials);
            store.set(state => ({ ...state, testimonials: newTestimonials }));
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
        setProviders: (updater: (providers: Provider[]) => Provider[]) => {
            const currentProviders = store.get().providers;
            const newProviders = updater(currentProviders);
            store.set(state => ({ ...state, providers: newProviders }));
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
            const currentAgents = store.get().leadership;
            const newAgents = updater(currentAgents);
            store.set(state => ({ ...state, leadership: newAgents }));
        },
        staff: data.staff,
        setStaff: (updater: (agents: Agent[]) => void) => {
            const currentAgents = store.get().staff;
            const newAgents = updater(currentAgents);
            store.set(state => ({ ...state, staff: newAgents }));
        },
        agentCategories: data.agentCategories,
        setAgentCategories: (updater: (categories: AgentCategory[]) => void) => {
            const currentCategories = store.get().agentCategories;
            const newCategories = updater(currentCategories);
            store.set(state => ({ ...state, agentCategories: newCategories }));
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
        setCommunities: (updater: (communities: Community[]) => Community[]) => {
            const currentCommunities = store.get().communities;
            const newCommunities = updater(currentCommunities);
            store.set(state => ({ ...state, communities: newCommunities }));
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
        setEvents: (updater: (events: CommunityEvent[]) => CommunityEvent[]) => {
            const current = store.get().communityEvents;
            const newItems = updater(current);
            store.set(state => ({ ...state, communityEvents: newItems }));
        },
        finances: data.communityFinances,
        setFinances: (updater: (finances: CommunityFinance[]) => CommunityFinance[]) => {
            const current = store.get().communityFinances;
            const newItems = updater(current);
            store.set(state => ({ ...state, communityFinances: newItems }));
        },
        members: data.communityMembers,
        setMembers: (updater: (members: CommunityMember[]) => CommunityMember[]) => {
            const current = store.get().communityMembers;
            const newItems = updater(current);
            store.set(state => ({ ...state, communityMembers: newItems }));
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
        setOpportunities: (updater: (opportunities: Opportunity[]) => Opportunity[]) => {
            const currentOpportunities = store.get().opportunities;
            const newOpportunities = updater(currentOpportunities);
            store.set(state => ({ ...state, opportunities: newOpportunities }));
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
        setStages: (updater: (stages: ProjectStage[]) => ProjectStage[]) => {
            const currentStages = store.get().stages;
            const newStages = updater(currentStages);
            store.set(state => ({ ...state, stages: newStages }));
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
        setSettings: (updater: (settings: AppSettings) => AppSettings) => {
            const currentSettings = store.get().settings;
            const newSettings = updater(currentSettings);
            store.set(state => ({ ...state, settings: newSettings }));
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
            const currentAssets = store.get().assets;
            const newAssets = updater(currentAssets);
            store.set(state => ({ ...state, assets: newAssets }));
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
        setInvestors: (updater: (investors: Investor[]) => Investor[]) => {
            const currentInvestors = store.get().investors;
            const newInvestors = updater(currentInvestors);
            store.set(state => ({ ...state, investors: newInvestors }));
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
        setKnowledgeBase: (updater: (docs: KnowledgeDocument[]) => KnowledgeDocument[]) => {
            const currentDocs = store.get().knowledgeBase;
            const newDocs = updater(currentDocs);
            store.set(state => ({ ...state, knowledgeBase: newDocs }));
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
        setAgencies: (updater: (agencies: Agency[]) => Agency[]) => {
            const currentAgencies = store.get().raahaAgencies;
            const newAgencies = updater(currentAgencies);
            store.set(state => ({ ...state, raahaAgencies: newAgencies }));
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
        setWorkers: (updater: (workers: RaahaWorker[]) => RaahaWorker[]) => {
            const currentWorkers = store.get().raahaWorkers;
            const newWorkers = updater(currentWorkers);
            store.set(state => ({ ...state, raahaWorkers: newWorkers }));
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
        setRequests: (updater: (requests: HireRequest[]) => HireRequest[]) => {
            const currentRequests = store.get().raahaRequests;
            const newRequests = updater(currentRequests);
            store.set(state => ({ ...state, raahaRequests: newRequests }));
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
        setLeases: (updater: (leases: SignedLease[]) => SignedLease[]) => {
            const currentLeases = store.get().signedLeases;
            const newLeases = updater(currentLeases);
            store.set(state => ({ ...state, signedLeases: newLeases }));
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
            const currentProperties = store.get().properties;
            const newProperties = updater(currentProperties);
            store.set(state => ({ ...state, properties: newProperties }));
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
        setStudents: (updater: (students: Student[]) => Student[]) => {
            const currentStudents = store.get().students;
            const newStudents = updater(currentStudents);
            store.set(state => ({ ...state, students: newStudents }));
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
            const current = store.get().costSettings;
            const newItems = updater(current);
            store.set(state => ({ ...state, costSettings: newItems }));
        },
        isClient,
    };
};
