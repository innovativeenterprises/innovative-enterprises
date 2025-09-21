
'use client';

import { useState, useEffect } from 'react';
import { store, type AppState, type CartItem } from '@/lib/global-store';


const useGlobalStore = () => {
    const [state, setState] = useState(store.get());
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
        const unsubscribe = store.subscribe(() => {
            setState(store.get());
        });
        return unsubscribe;
    }, []);

    return { state, store, isClient };
}

export default useGlobalStore;


export const useCartData = () => {
    const { state, store, isClient } = useGlobalStore();
    
    const cart = isClient ? state.cart : [];

    const setCart = (updater: (currentCart: CartItem[]) => CartItem[]) => {
        const currentCart = store.get().cart;
        store.set(s => ({ ...s, cart: updater(currentCart) }));
    };
    
    return { cart, setCart, isClient };
};

export const useProductsData = () => {
    const { state, isClient } = useGlobalStore();
    const products = isClient ? state.products : [];
    const storeProducts = isClient ? state.storeProducts : [];
    const setProducts = (updater: (currentProducts: AppState['products']) => AppState['products']) => {
        const currentProducts = store.get().products;
        store.set(s => ({ ...s, products: updater(currentProducts) }));
    }
    return { products, storeProducts, setProducts, isClient };
};
export const useProvidersData = () => {
    const { state, isClient } = useGlobalStore();
    return { providers: isClient ? state.providers : [], isClient };
};
export const useOpportunitiesData = () => {
    const { state, store, isClient } = useGlobalStore();
    const setOpportunities = (updater: (currentData: AppState['opportunities']) => AppState['opportunities']) => {
        const currentData = store.get().opportunities;
        store.set((s) => ({ ...s, opportunities: updater(currentData) }));
    };
    return { opportunities: isClient ? state.opportunities : [], setOpportunities, isClient };
};
export const useServicesData = () => {
    const { state, isClient } = useGlobalStore();
    return { services: isClient ? state.services : [], isClient };
};
export const useStaffData = () => {
    const { state, isClient } = useGlobalStore();
    const leadership = isClient ? state.leadership : [];
    const staff = isClient ? state.staff : [];
    const agentCategories = isClient ? state.agentCategories : [];
    return { leadership, staff, agentCategories, isClient };
};

export const useSettingsData = () => {
    const { state, isClient } = useGlobalStore();
    return { settings: isClient ? state.settings : store.get().settings, isClient }; // Provide default for settings
};

export const useSaaSProductsData = () => {
    const { state, isClient } = useGlobalStore();
    return { saasProducts: isClient ? state.saasProducts : [], isClient };
};

export const useBriefcaseData = () => {
    const { state, store, isClient } = useGlobalStore();
    const setBriefcase = (updater: (currentBriefcase: AppState['briefcase']) => AppState['briefcase']) => {
        const currentBriefcase = store.get().briefcase;
        store.set(s => ({ ...s, briefcase: updater(currentBriefcase) }));
    };
    return { data: state.briefcase, setData: setBriefcase, isClient };
};

export const useCostSettingsData = () => {
    const { state, isClient } = useGlobalStore();
    return { costSettings: isClient ? state.costSettings : [], isClient };
}

export const useClientsData = () => {
    const { state, isClient } = useGlobalStore();
    return { clients: isClient ? state.clients : [], isClient };
}
export const useTestimonialsData = () => {
    const { state, isClient } = useGlobalStore();
    return { testimonials: isClient ? state.testimonials : [], isClient };
}

export const useInvestorsData = () => {
     const { state, isClient } = useGlobalStore();
    return { investors: isClient ? state.investors : [], isClient };
}

export const useRaahaData = () => {
     const { state, store, isClient } = useGlobalStore();
     const setRaahaRequests = (updater: (reqs: AppState['raahaRequests']) => AppState['raahaRequests']) => {
        const currentData = store.get().raahaRequests;
        store.set(s => ({...s, raahaRequests: updater(currentData)}));
     }
    return { agencies: isClient ? state.raahaAgencies : [], workers: isClient ? state.raahaWorkers : [], requests: isClient ? state.raahaRequests : [], setRaahaRequests, isClient };
}

export const useBeautyData = () => {
    const { state, store, isClient } = useGlobalStore();
    const setAgencies = (updater: (data: AppState['beautyCenters']) => AppState['beautyCenters']) => {
        store.set(s => ({...s, beautyCenters: updater(s.beautyCenters)}));
    }
    const setServices = (updater: (data: AppState['beautyServices']) => AppState['beautyServices']) => {
        store.set(s => ({...s, beautyServices: updater(s.beautyServices)}));
    }
    const setAppointments = (updater: (data: AppState['beautyAppointments']) => AppState['beautyAppointments']) => {
        store.set(s => ({...s, beautyAppointments: updater(s.beautyAppointments)}));
    }
    return { 
        agencies: isClient ? state.beautyCenters : [], 
        services: isClient ? state.beautyServices : [], 
        appointments: isClient ? state.beautyAppointments : [], 
        setAgencies, setServices, setAppointments,
        isClient 
    };
}

export const useBeautySpecialistsData = () => {
    const { state, store, isClient } = useGlobalStore();
    const setSpecialists = (updater: (data: AppState['beautySpecialists']) => AppState['beautySpecialists']) => {
        store.set(s => ({...s, beautySpecialists: updater(s.beautySpecialists)}));
    }
    return { specialists: isClient ? state.beautySpecialists : [], setSpecialists, isClient };
}
export const usePosData = () => {
    const { state, store, isClient } = useGlobalStore();
    const setDailySales = (updater: (currentSales: AppState['dailySales']) => AppState['dailySales']) => {
        const currentSales = store.get().dailySales;
        store.set(s => ({...s, dailySales: updater(currentSales)}));
    };
    return { dailySales: isClient ? state.dailySales : [], setDailySales, isClient };
}
export const usePosProductsData = () => {
     const { state, isClient } = useGlobalStore();
    return { posProducts: isClient ? state.posProducts : [], isClient };
}

export const useStairspaceData = () => {
    const { state, store, isClient } = useGlobalStore();
    const setStairspaceListings = (updater: (currentListings: AppState['stairspaceListings']) => AppState['stairspaceListings']) => {
        const currentListings = store.get().stairspaceListings;
        store.set(s => ({...s, stairspaceListings: updater(currentListings)}));
    };
    return { stairspaceListings: isClient ? state.stairspaceListings : [], setStairspaceListings, isClient };
}

export const useStairspaceRequestsData = () => {
    const { state, store, isClient } = useGlobalStore();
    const setStairspaceRequests = (updater: (currentRequests: AppState['stairspaceRequests']) => AppState['stairspaceRequests']) => {
        const currentRequests = store.get().stairspaceRequests;
        store.set(s => ({...s, stairspaceRequests: updater(currentRequests)}));
    };
    return { data: isClient ? state.stairspaceRequests : [], setData: setStairspaceRequests, isClient };
}

export const useLeasesData = () => {
    const { state, store, isClient } = useGlobalStore();
     const setLeases = (updater: (currentLeases: AppState['signedLeases']) => AppState['signedLeases']) => {
        const currentLeases = store.get().signedLeases;
        store.set(s => ({...s, signedLeases: updater(currentLeases)}));
    };
    return { leases: isClient ? state.signedLeases : [], setLeases, isClient };
}

export const useStudentsData = () => {
    const { state, store, isClient } = useGlobalStore();
     const setStudents = (updater: (currentStudents: AppState['students']) => AppState['students']) => {
        const currentStudents = store.get().students;
        store.set(s => ({...s, students: updater(currentStudents)}));
    };
    return { students: isClient ? state.students : [], setStudents, isClient };
}

export const useMembersData = () => {
    const { state, store, isClient } = useGlobalStore();
     const setMembers = (updater: (currentMembers: AppState['communityMembers']) => AppState['communityMembers']) => {
        const currentMembers = store.get().communityMembers;
        store.set(s => ({...s, communityMembers: updater(currentMembers)}));
    };
    return { members: isClient ? state.communityMembers : [], setMembers, isClient };
}

export const useEventsData = () => {
    const { state, isClient } = useGlobalStore();
    return { events: isClient ? state.communityEvents : [], isClient };
}
export const useAlumniJobsData = () => {
    const { state, isClient } = useGlobalStore();
    return { jobs: isClient ? state.alumniJobs : [], isClient };
}

export const useCommunitiesData = () => {
    const { state, isClient } = useGlobalStore();
    return { communities: isClient ? state.communities : [], isClient };
}

export const useUsedItemsData = () => {
    const { state, store, isClient } = useGlobalStore();
    const setItems = (updater: (items: AppState['usedItems']) => AppState['usedItems']) => {
        const currentItems = store.get().usedItems;
        store.set(s => ({...s, usedItems: updater(currentItems)}));
    }
    return { items: isClient ? state.usedItems : [], setItems, isClient };
}

export const useFinancesData = () => {
    const { state, store, isClient } = useGlobalStore();
    const setFinances = (updater: (finances: AppState['communityFinances']) => AppState['communityFinances']) => {
        const currentFinances = store.get().communityFinances;
        store.set(s => ({...s, communityFinances: updater(currentFinances)}));
    }
    return { finances: isClient ? state.communityFinances : [], setFinances, isClient };
}
