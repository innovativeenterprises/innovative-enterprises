
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
    const { state, store, isClient } = useGlobalStore();
    const products = isClient ? state.products : [];
    const storeProducts = isClient ? state.storeProducts : [];
    const setProducts = (updater: (currentProducts: AppState['products']) => AppState['products']) => {
        const currentProducts = store.get().products;
        store.set(s => ({ ...s, products: updater(currentProducts) }));
    }
    return { products, storeProducts, setProducts, isClient };
};

export const useProvidersData = () => {
    const { state, store, isClient } = useGlobalStore();
    const setProviders = (updater: (currentProviders: AppState['providers']) => AppState['providers']) => {
        const currentProviders = store.get().providers;
        store.set(s => ({ ...s, providers: updater(currentProviders) }));
    };
    return { providers: isClient ? state.providers : [], setProviders, isClient };
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
    return { data: isClient ? state.briefcase : store.get().briefcase, setData: setBriefcase, isClient };
};

export const useCostSettingsData = () => {
    const { state, store, isClient } = useGlobalStore();
    const setCostSettings = (updater: (costSettings: AppState['costSettings']) => AppState['costSettings']) => {
        const currentSettings = store.get().costSettings;
        store.set(s => ({...s, costSettings: updater(currentSettings)}));
    };
    return { costSettings: isClient ? state.costSettings : [], setCostSettings, isClient };
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
     const { state, store, isClient } = useGlobalStore();
     const setInvestors = (updater: (investors: AppState['investors']) => AppState['investors']) => {
        const currentInvestors = store.get().investors;
        store.set(s => ({...s, investors: updater(currentInvestors)}));
     };
    return { investors: isClient ? state.investors : [], setInvestors, isClient };
}

export const useRaahaData = () => {
     const { state, store, isClient } = useGlobalStore();
     const setRaahaAgencies = (updater: (agencies: AppState['raahaAgencies']) => AppState['raahaAgencies']) => {
        store.set(s => ({...s, raahaAgencies: updater(s.raahaAgencies)}));
     }
     const setRaahaWorkers = (updater: (workers: AppState['raahaWorkers']) => AppState['raahaWorkers']) => {
        store.set(s => ({...s, raahaWorkers: updater(s.raahaWorkers)}));
     }
     const setRaahaRequests = (updater: (reqs: AppState['raahaRequests']) => AppState['raahaRequests']) => {
        const currentData = store.get().raahaRequests;
        store.set(s => ({...s, raahaRequests: updater(currentData)}));
     }
    return { 
        agencies: isClient ? state.raahaAgencies : [], 
        workers: isClient ? state.raahaWorkers : [], 
        requests: isClient ? state.raahaRequests : [], 
        setRaahaAgencies,
        setRaahaWorkers,
        setRaahaRequests, 
        isClient 
    };
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
     const { state, store, isClient } = useGlobalStore();
     const setPosProducts = (updater: (currentProducts: AppState['posProducts']) => AppState['posProducts']) => {
        const currentProducts = store.get().posProducts;
        store.set(s => ({...s, posProducts: updater(currentProducts)}));
    };
    return { posProducts: isClient ? state.posProducts : [], setPosProducts, isClient };
}

export const useStairspaceData = () => {
    const { state, store, isClient } = useGlobalStore();
    const setStairspaceListings = (updater: (currentListings: AppState['stairspaceListings']) => AppState['stairspaceListings']) => {
        const currentListings = store.get().stairspaceListings;
        store.set(s => ({...s, stairspaceListings: updater(currentListings)}));
    };
    const setStairspaceRequests = (updater: (currentRequests: AppState['stairspaceRequests']) => AppState['stairspaceRequests']) => {
        const currentRequests = store.get().stairspaceRequests;
        store.set(s => ({...s, stairspaceRequests: updater(currentRequests)}));
    };
    return { 
        stairspaceListings: isClient ? state.stairspaceListings : [], 
        stairspaceRequests: isClient ? state.stairspaceRequests : [],
        setStairspaceListings, 
        setStairspaceRequests, 
        isClient 
    };
}
