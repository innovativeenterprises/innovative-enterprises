'use client';

import { useContext, useEffect, useState } from 'react';
import { StoreContext, type AppState } from '@/lib/global-store';
import type { StoreType } from '@/lib/global-store';

export const useStore = <T>(selector: (state: AppState) => T): T => {
    const store = useContext(StoreContext);
    if (!store) {
        throw new Error('useStore must be used within a StoreProvider.');
    }
    const [state, setState] = useState(() => selector(store.get())); 

    useEffect(() => {
        const unsubscribe = store.subscribe(() => {
            setState(selector(store.get()));
        });
        return () => unsubscribe();
    }, [store, selector]);

    return state;
};

export const useCartData = () => {
    const store = useContext(StoreContext);
    if (!store) throw new Error('useCartData must be used within a StoreProvider.');
    
    const cart = useStore(s => s.cart);
    const isClient = useStore(s => s.isClient);

    const setCart = (updater: (prev: AppState['cart']) => AppState['cart']) => {
        store.set(s => ({ ...s, cart: updater(s.cart) }));
    };
    return { cart, setCart, isClient };
};

export const useProductsData = () => {
    const store = useContext(StoreContext);
    if (!store) throw new Error('useProductsData must be used within a StoreProvider.');

    const products = useStore(s => s.products);
    const storeProducts = useStore(s => s.storeProducts);
    const isClient = useStore(s => s.isClient);

    const setProducts = (updater: (prev: AppState['products']) => AppState['products']) => {
        store.set(s => ({ ...s, products: updater(s.products) }));
    };

    return { products, storeProducts, setProducts, isClient };
}

export const useSaaSProductsData = () => {
    const data = useStore(s => s.saasProducts);
    const isClient = useStore(s => s.isClient);
    return { data, isClient };
};

export const useProvidersData = () => {
    const store = useContext(StoreContext);
    if (!store) throw new Error('useProvidersData must be used within a StoreProvider.');
    const data = useStore(s => s.providers);
     const setData = (updater: (prev: AppState['providers']) => AppState['providers']) => {
        store.set(s => ({ ...s, providers: updater(s.providers) }));
    };
    return { data, setData, isClient: useStore(s => s.isClient) };
}
export const useOpportunitiesData = () => {
    const store = useContext(StoreContext);
    if (!store) throw new Error('useOpportunitiesData must be used within a StoreProvider.');
    const data = useStore(s => s.opportunities);
    const setData = (updater: (prev: AppState['opportunities']) => AppState['opportunities']) => {
        store.set(s => ({ ...s, opportunities: updater(s.opportunities) }));
    };
    return { data, setData, isClient: useStore(s => s.isClient) };
}
export const useServicesData = () => useStore(s => s.services);
export const useLeasesData = () => {
    const store = useContext(StoreContext);
    if (!store) throw new Error('useLeasesData must be used within a StoreProvider.');
    const data = useStore(s => s.signedLeases);
    const setData = (updater: (prev: AppState['signedLeases']) => AppState['signedLeases']) => {
        store.set(s => ({ ...s, signedLeases: updater(s.signedLeases) }));
    };
    return { data, setData, isClient: useStore(s => s.isClient) };
}

export const useStairspaceData = () => {
    const store = useContext(StoreContext);
    if (!store) throw new Error('useStairspaceData must be used within a StoreProvider.');
    const stairspaceListings = useStore(s => s.stairspaceListings);
    const setStairspaceListings = (updater: (prev: AppState['stairspaceListings']) => AppState['stairspaceListings']) => {
        store.set(s => ({ ...s, stairspaceListings: updater(s.stairspaceListings) }));
    };
    return { stairspaceListings, setStairspaceListings, isClient: useStore(s => s.isClient) };
}

export const useStairspaceRequestsData = () => {
    const store = useContext(StoreContext);
    if (!store) throw new Error('useStairspaceRequestsData must be used within a StoreProvider.');
    const data = useStore(s => s.stairspaceRequests);
    const setData = (updater: (prev: AppState['stairspaceRequests']) => AppState['stairspaceRequests']) => {
        store.set(s => ({ ...s, stairspaceRequests: updater(s.stairspaceRequests) }));
    };
    return { data, setData, isClient: useStore(s => s.isClient) };
}
export const useStaffData = () => {
    const leadership = useStore(s => s.leadership);
    const staff = useStore(s => s.staff);
    const agentCategories = useStore(s => s.agentCategories);
    return { leadership, staff, agentCategories, isClient: useStore(s => s.isClient) };
}

export const useAgenciesData = () => {
     const store = useContext(StoreContext);
    if (!store) throw new Error('useAgenciesData must be used within a StoreProvider.');
    const data = useStore(s => s.raahaAgencies);
    const setData = (updater: (prev: AppState['raahaAgencies']) => AppState['raahaAgencies']) => {
        store.set(s => ({ ...s, raahaAgencies: updater(s.raahaAgencies) }));
    };
    return { data, setData, isClient: useStore(s => s.isClient) };
}
export const useWorkersData = () => {
    const store = useContext(StoreContext);
    if (!store) throw new Error('useWorkersData must be used within a StoreProvider.');
    const workers = useStore(s => s.raahaWorkers);
    const setWorkers = (updater: (prev: AppState['raahaWorkers']) => AppState['raahaWorkers']) => {
        store.set(s => ({ ...s, raahaWorkers: updater(s.raahaWorkers) }));
    };
    return { workers, setWorkers, isClient: useStore(s => s.isClient) };
}
export const useRequestsData = () => {
    const store = useContext(StoreContext);
    if (!store) throw new Error('useRequestsData must be used within a StoreProvider.');
    const data = useStore(s => s.raahaRequests);
    const setData = (updater: (prev: AppState['raahaRequests']) => AppState['raahaRequests']) => {
        store.set(s => ({ ...s, raahaRequests: updater(s.raahaRequests) }));
    };
    return { data, setData, isClient: useStore(s => s.isClient) };
}

export const useBeautyData = () => {
    const store = useContext(StoreContext);
    if (!store) throw new Error('useBeautyData must be used within a StoreProvider.');

    const agencies = useStore(s => s.beautyCenters);
    const services = useStore(s => s.beautyServices);
    const appointments = useStore(s => s.beautyAppointments);

    const setAgencies = (updater: (prev: any[]) => any[]) => store.set(s => ({...s, beautyCenters: updater(s.beautyCenters)}));
    const setServices = (updater: (prev: any[]) => any[]) => store.set(s => ({...s, beautyServices: updater(s.beautyServices)}));
    const setAppointments = (updater: (prev: any[]) => any[]) => store.set(s => ({...s, beautyAppointments: updater(s.beautyAppointments)}));
    
    return { 
        agencies, 
        setAgencies,
        services,
        setServices,
        appointments,
        setAppointments,
        isClient: useStore(s => s.isClient),
    };
}
export const useBeautySpecialistsData = () => {
    const store = useContext(StoreContext);
    if (!store) throw new Error('useBeautySpecialistsData must be used within a StoreProvider.');
    const specialists = useStore(s => s.beautySpecialists);
    const setSpecialists = (updater: (prev: AppState['beautySpecialists']) => AppState['beautySpecialists']) => {
        store.set(s => ({ ...s, beautySpecialists: updater(s.beautySpecialists) }));
    };
    return { specialists, setSpecialists, isClient: useStore(s => s.isClient) };
}
export const useUsedItemsData = () => {
     const store = useContext(StoreContext);
    if (!store) throw new Error('useUsedItemsData must be used within a StoreProvider.');
    const items = useStore(s => s.usedItems);
    const setItems = (updater: (prev: AppState['usedItems']) => AppState['usedItems']) => {
        store.set(s => ({ ...s, usedItems: updater(s.usedItems) }));
    };
     return { items, setItems, isClient: useStore(s => s.isClient) };
}
export const useGiftCardsData = () => {
    const store = useContext(StoreContext);
    if (!store) throw new Error('useGiftCardsData must be used within a StoreProvider.');
    const giftCards = useStore(s => s.giftCards);
    const setGiftCards = (updater: (prev: AppState['giftCards']) => AppState['giftCards']) => {
        store.set(s => ({ ...s, giftCards: updater(s.giftCards) }));
    };
    return { giftCards, setGiftCards, isClient: useStore(s => s.isClient) };
}
export const useStudentsData = () => {
    const store = useContext(StoreContext);
    if (!store) throw new Error('useStudentsData must be used within a StoreProvider.');
    const students = useStore(s => s.students);
    const setStudents = (updater: (prev: AppState['students']) => AppState['students']) => {
        store.set(s => ({ ...s, students: updater(s.students) }));
    };
    return { students, setStudents, isClient: useStore(s => s.isClient) };
}
export const useMembersData = () => {
    const store = useContext(StoreContext);
    if (!store) throw new Error('useMembersData must be used within a StoreProvider.');
    const members = useStore(s => s.communityMembers);
    const setMembers = (updater: (prev: AppState['communityMembers']) => AppState['communityMembers']) => {
        store.set(s => ({ ...s, communityMembers: updater(s.communityMembers) }));
    };
    return { members, setMembers, isClient: useStore(s => s.isClient) };
}
export const useCommunitiesData = () => useStore(s => ({ communities: s.communities, isClient: s.isClient }));
export const useEventsData = () => useStore(s => s.communityEvents);
export const useFinancesData = () => useStore(s => s.communityFinances);
export const useAlumniJobsData = () => useStore(s => s.alumniJobs);

export const usePosProductsData = () => {
    const posProducts = useStore(s => s.posProducts);
    const isClient = useStore(s => s.isClient);
    return { posProducts, isClient };
};

export const usePosData = () => {
    const store = useContext(StoreContext);
    if (!store) throw new Error('usePosData must be used within a StoreProvider.');
    const dailySales = useStore(s => s.dailySales);
    const setDailySales = (updater: (prev: AppState['dailySales']) => AppState['dailySales']) => {
        store.set(s => ({ ...s, dailySales: updater(s.dailySales) }));
    };
    return { dailySales, setDailySales, isClient: useStore(s => s.isClient) };
}

export const useStockItemsData = () => {
     const store = useContext(StoreContext);
    if (!store) throw new Error('useStockItemsData must be used within a StoreProvider.');
    const items = useStore(s => s.stockItems);
    const setItems = (updater: (prev: AppState['stockItems']) => AppState['stockItems']) => {
        store.set(s => ({ ...s, stockItems: updater(s.stockItems) }));
    };
     return { items, setItems, isClient: useStore(s => s.isClient) };
}

export const usePropertiesData = () => {
    const store = useContext(StoreContext);
    if (!store) throw new Error('usePropertiesData must be used within a StoreProvider.');
    const data = useStore(s => s.properties);
    const setData = (updater: (prev: AppState['properties']) => AppState['properties']) => {
        store.set(s => ({ ...s, properties: updater(s.properties) }));
    };
    return { data, setData, isClient: useStore(s => s.isClient) };
}

export const useBriefcaseData = () => {
    const store = useContext(StoreContext);
    if (!store) throw new Error('useBriefcaseData must be used within a StoreProvider.');
    const data = useStore(s => s.briefcase);
    const setData = (updater: (prev: AppState['briefcase']) => AppState['briefcase']) => {
        store.set(s => ({ ...s, briefcase: updater(s.briefcase) }));
    };
    return { data, setData, isClient: useStore(s => s.isClient) };
};

export const useNavLinksData = () => {
    const solutions = useStore(s => s.solutions);
    const industries = useStore(s => s.industries);
    const aiTools = useStore(s => s.aiTools);
    return { solutions, industries, aiTools };
};

export const useSettingsData = () => {
    const settings = useStore(s => s.settings);
    const isClient = useStore(s => s.isClient);
    return { settings, isClient };
};

export const usePricingData = () => {
    const store = useContext(StoreContext);
    if (!store) throw new Error('usePricingData must be used within a StoreProvider.');
    const pricing = useStore(s => s.pricing);
    const setPricing = (updater: (prev: AppState['pricing']) => AppState['pricing']) => {
        store.set(s => ({ ...s, pricing: updater(s.pricing) }));
    };
    return { pricing, setPricing, isClient: useStore(s => s.isClient) };
};