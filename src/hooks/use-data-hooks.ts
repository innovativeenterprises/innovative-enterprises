
'use client';

import { useContext, useSyncExternalStore } from 'react';
import { StoreContext, type AppState, type StoreType } from '@/lib/global-store';

export const useStore = <T>(selector: (state: AppState) => T): T => {
    const store = useContext(StoreContext);
    if (!store) {
        throw new Error('useStore must be used within a StoreProvider.');
    }
    
    // The useSyncExternalStore hook is the key to correctly subscribing to an external store.
    // The third argument, getServerSnapshot, is crucial for SSR. It ensures the server render
    // uses the same initial snapshot of the data as the client, preventing mismatches.
    const state = useSyncExternalStore(
      store.subscribe,
      () => selector(store.get()),
      () => selector(store.get()) // getServerSnapshot
    );

    return state;
};

// The rest of the hooks will now correctly use the stabilized `useStore` hook.

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

export const useProductsData = (initialData?: AppState['products']) => {
    const store = useContext(StoreContext);
    if (!store) throw new Error('useProductsData must be used within a StoreProvider.');
    const data = useStore(s => s.products);
     const setData = (updater: (prev: AppState['products']) => AppState['products']) => {
        store.set(s => ({ ...s, products: updater(s.products) }));
    };
    return { data, setData, isClient: useStore(s => s.isClient) };
}

export const useSaaSProductsData = (initialData: AppState['saasProducts']) => {
    const data = useStore(s => s.saasProducts);
    return { data, isClient: useStore(s => s.isClient) };
};

export const useProvidersData = (initialData: AppState['providers']) => {
    const store = useContext(StoreContext);
    if (!store) throw new Error('useProvidersData must be used within a StoreProvider.');
    const data = useStore(s => s.providers);
     const setData = (updater: (prev: AppState['providers']) => AppState['providers']) => {
        store.set(s => ({ ...s, providers: updater(s.providers) }));
    };
    return { data, setData, isClient: useStore(s => s.isClient) };
}

export const useOpportunitiesData = (initialData: AppState['opportunities']) => {
    const store = useContext(StoreContext);
    if (!store) throw new Error('useOpportunitiesData must be used within a StoreProvider.');
    const data = useStore(s => s.opportunities);
    const setData = (updater: (prev: AppState['opportunities']) => AppState['opportunities']) => {
        store.set(s => ({ ...s, opportunities: updater(s.opportunities) }));
    };
    return { data, setData, isClient: useStore(s => s.isClient) };
}

export const useServicesData = () => {
    const services = useStore(s => s.services);
    const isClient = useStore(s => s.isClient);
    return { services, isClient };
}

export const useLeasesData = (initialData: AppState['signedLeases']) => {
    const store = useContext(StoreContext);
    if (!store) throw new Error('useLeasesData must be used within a StoreProvider.');
    const data = useStore(s => s.signedLeases);
    const setData = (updater: (prev: AppState['signedLeases']) => AppState['signedLeases']) => {
        store.set(s => ({ ...s, signedLeases: updater(s.signedLeases) }));
    };
    return { data, setData, isClient: useStore(s => s.isClient) };
}

export const useStairspaceData = (initialData: AppState['stairspaceListings']) => {
    const store = useContext(StoreContext);
    if (!store) throw new Error('useStairspaceData must be used within a StoreProvider.');
    const data = useStore(s => s.stairspaceListings);
    const setData = (updater: (prev: AppState['stairspaceListings']) => AppState['stairspaceListings']) => {
        store.set(s => ({ ...s, stairspaceListings: updater(s.stairspaceListings) }));
    };
    return { data, setData, isClient: useStore(s => s.isClient) };
}

export const useStairspaceRequestsData = (initialData: AppState['stairspaceRequests']) => {
    const store = useContext(StoreContext);
    if (!store) throw new Error('useStairspaceRequestsData must be used within a StoreProvider.');
    const data = useStore(s => s.stairspaceRequests);
    const setData = (updater: (prev: AppState['stairspaceRequests']) => AppState['stairspaceRequests']) => {
        store.set(s => ({ ...s, stairspaceRequests: updater(s.stairspaceRequests) }));
    };
    return { data, setData, isClient: useStore(s => s.isClient) };
}
export const useStaffData = (initialData: { leadership: AppState['leadership'], staff: AppState['staff'], agentCategories: AppState['agentCategories'] }) => {
    const leadership = useStore(s => s.leadership);
    const staff = useStore(s => s.staff);
    const agentCategories = useStore(s => s.agentCategories);
    return { leadership, staff, agentCategories, isClient: useStore(s => s.isClient) };
}

export const useAgenciesData = (initialData: AppState['raahaAgencies']) => {
     const store = useContext(StoreContext);
    if (!store) throw new Error('useAgenciesData must be used within a StoreProvider.');
    const data = useStore(s => s.raahaAgencies);
    const setData = (updater: (prev: AppState['raahaAgencies']) => AppState['raahaAgencies']) => {
        store.set(s => ({ ...s, raahaAgencies: updater(s.raahaAgencies) }));
    };
    return { data, setData, isClient: useStore(s => s.isClient) };
}
export const useWorkersData = (initialData: AppState['raahaWorkers']) => {
    const store = useContext(StoreContext);
    if (!store) throw new Error('useWorkersData must be used within a StoreProvider.');
    const workers = useStore(s => s.raahaWorkers);
    const setWorkers = (updater: (prev: AppState['raahaWorkers']) => AppState['raahaWorkers']) => {
        store.set(s => ({ ...s, raahaWorkers: updater(s.raahaWorkers) }));
    };
    return { workers, setWorkers, isClient: useStore(s => s.isClient) };
}
export const useRequestsData = (initialData?: AppState['raahaRequests']) => {
    const store = useContext(StoreContext);
    if (!store) throw new Error('useRequestsData must be used within a StoreProvider.');
    const data = useStore(s => s.raahaRequests);
    const setData = (updater: (prev: AppState['raahaRequests']) => AppState['raahaRequests']) => {
        store.set(s => ({ ...s, raahaRequests: updater(s.raahaRequests) }));
    };
    return { data, setData, isClient: useStore(s => s.isClient) };
}

export const useBeautyData = (initialData?: { agencies: AppState['beautyCenters'], services: AppState['beautyServices'], appointments: AppState['beautyAppointments'] }) => {
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
export const useBeautySpecialistsData = (initialData: AppState['beautySpecialists']) => {
    const store = useContext(StoreContext);
    if (!store) throw new Error('useBeautySpecialistsData must be used within a StoreProvider.');
    const specialists = useStore(s => s.beautySpecialists);
    const setSpecialists = (updater: (prev: AppState['beautySpecialists']) => AppState['beautySpecialists']) => {
        store.set(s => ({ ...s, beautySpecialists: updater(s.beautySpecialists) }));
    };
    return { specialists, setSpecialists, isClient: useStore(s => s.isClient) };
}
export const useAssetsData = (initialData: AppState['assets']) => {
    const assets = useStore(s => s.assets);
    const isClient = useStore(s => s.isClient);
    return { assets, isClient };
};
export const useUsedItemsData = (initialData: AppState['usedItems']) => {
     const store = useContext(StoreContext);
    if (!store) throw new Error('useUsedItemsData must be used within a StoreProvider.');
    const items = useStore(s => s.usedItems);
    const setItems = (updater: (prev: AppState['usedItems']) => AppState['usedItems']) => {
        store.set(s => ({ ...s, usedItems: updater(s.usedItems) }));
    };
     return { items, setItems, isClient: useStore(s => s.isClient) };
}
export const useGiftCardsData = (initialData: AppState['giftCards']) => {
    const store = useContext(StoreContext);
    if (!store) throw new Error('useGiftCardsData must be used within a StoreProvider.');
    const data = useStore(s => s.giftCards);
    const setData = (updater: (prev: AppState['giftCards']) => AppState['giftCards']) => {
        store.set(s => ({ ...s, giftCards: updater(s.giftCards) }));
    };
    return { data, setData, isClient: useStore(s => s.isClient) };
}
export const useStudentsData = (initialData: AppState['students']) => {
    const store = useContext(StoreContext);
    if (!store) throw new Error('useStudentsData must be used within a StoreProvider.');
    const students = useStore(s => s.students);
    const setStudents = (updater: (prev: AppState['students']) => AppState['students']) => {
        store.set(s => ({ ...s, students: updater(s.students) }));
    };
    return { students, setStudents, isClient: useStore(s => s.isClient) };
}
export const useMembersData = (initialData: AppState['communityMembers']) => {
    const store = useContext(StoreContext);
    if (!store) throw new Error('useMembersData must be used within a StoreProvider.');
    const members = useStore(s => s.communityMembers);
    const setMembers = (updater: (prev: AppState['communityMembers']) => AppState['communityMembers']) => {
        store.set(s => ({ ...s, communityMembers: updater(s.communityMembers) }));
    };
    return { members, setMembers, isClient: useStore(s => s.isClient) };
}
export const useCommunitiesData = (initialData: AppState['communities']) => {
    const communities = useStore(s => s.communities);
    const isClient = useStore(s => s.isClient);
    return { communities, isClient };
};
export const useEventsData = (initialData: AppState['communityEvents']) => {
    const events = useStore(s => s.communityEvents);
    const isClient = useStore(s => s.isClient);
    return { events, isClient };
}
export const useFinancesData = (initialData: AppState['communityFinances']) => {
    const finances = useStore(s => s.communityFinances);
    const isClient = useStore(s => s.isClient);
    return { finances, isClient };
}
export const useAlumniJobsData = (initialData: AppState['alumniJobs']) => {
    const jobs = useStore(s => s.alumniJobs);
    const isClient = useStore(s => s.isClient);
    return { jobs, isClient };
}

export const usePosProductsData = (initialData?: AppState['posProducts']) => {
    const posProducts = useStore(s => s.posProducts);
    const isClient = useStore(s => s.isClient);
    return { posProducts, isClient };
};

export const usePosData = (initialData?: AppState['dailySales']) => {
    const store = useContext(StoreContext);
    if (!store) throw new Error('usePosData must be used within a StoreProvider.');
    const dailySales = useStore(s => s.dailySales);
    const setDailySales = (updater: (prev: AppState['dailySales']) => AppState['dailySales']) => {
        store.set(s => ({ ...s, dailySales: updater(s.dailySales) }));
    };
    return { dailySales, setDailySales, isClient: useStore(s => s.isClient) };
}

export const useStockItemsData = (initialData: AppState['stockItems']) => {
     const store = useContext(StoreContext);
    if (!store) throw new Error('useStockItemsData must be used within a StoreProvider.');
    const items = useStore(s => s.stockItems);
    const setItems = (updater: (prev: AppState['stockItems']) => AppState['stockItems']) => {
        store.set(s => ({ ...s, stockItems: updater(s.stockItems) }));
    };
     return { items, setItems, isClient: useStore(s => s.isClient) };
}

export const usePropertiesData = (initialData: AppState['properties']) => {
    const store = useContext(StoreContext);
    if (!store) throw new Error('usePropertiesData must be used within a StoreProvider.');
    const data = useStore(s => s.properties);
    const setData = (updater: (prev: AppState['properties']) => AppState['properties']) => {
        store.set(s => ({ ...s, properties: updater(s.properties) }));
    };
    return { data, setData, isClient: useStore(s => s.isClient) };
}

export const useBriefcaseData = (initialData: AppState['briefcase']) => {
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
    const settings = useStore(state => state.settings);
    const isClient = useStore(state => state.isClient);
    return { settings, isClient };
};

export const usePricingData = (initialData: AppState['pricing']) => {
    const store = useContext(StoreContext);
    if (!store) throw new Error('usePricingData must be used within a StoreProvider.');
    const pricing = useStore(s => s.pricing);
    const setPricing = (updater: (prev: AppState['pricing']) => AppState['pricing']) => {
        store.set(s => ({ ...s, pricing: updater(s.pricing) }));
    };
    return { pricing, setPricing, isClient: useStore(s => s.isClient) };
};
