
'use client';

import { useContext, useSyncExternalStore } from 'react';
import { StoreContext, type AppState, type StoreType } from '@/lib/global-store';

// This is the core hook that safely accesses the store.
// It uses useSyncExternalStore to subscribe to changes and handle server/client rendering.
export const useStore = <T>(selector: (state: AppState) => T): T => {
    const store = useContext(StoreContext);
    if (!store) {
        throw new Error('useStore must be used within a StoreProvider.');
    }
    
    // The useSyncExternalStore hook correctly subscribes to the external store.
    // The third argument, getServerSnapshot, is crucial for SSR. It ensures the server render
    // uses the same initial snapshot of the data as the client, preventing hydration mismatches.
    const state = useSyncExternalStore(
      store.subscribe,
      () => selector(store.get()), // getSnapshot on the client
      () => selector(store.get())  // getServerSnapshot on the server
    );

    return state;
};

// All other hooks are simplified to just use the core useStore hook.
// They no longer need to manage their own state or use useEffect.

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
    const products = useStore(s => s.products);
    const storeProducts = useStore(s => s.storeProducts);
    return { products, storeProducts, isClient: useStore(s => s.isClient) };
}

export const useSaaSProductsData = () => {
    const data = useStore(s => s.saasProducts);
    return { data, isClient: useStore(s => s.isClient) };
};

export const useProvidersData = () => {
    const data = useStore(s => s.providers);
    return { data, isClient: useStore(s => s.isClient) };
}

export const useOpportunitiesData = () => {
    const data = useStore(s => s.opportunities);
    return { data, isClient: useStore(s => s.isClient) };
}

export const useServicesData = () => {
    const services = useStore(s => s.services);
    return { services, isClient: useStore(s => s.isClient) };
}

export const useLeasesData = () => {
    const data = useStore(s => s.signedLeases);
    return { data, isClient: useStore(s => s.isClient) };
}

export const useStairspaceData = () => {
    const stairspaceListings = useStore(s => s.stairspaceListings);
    return { stairspaceListings, isClient: useStore(s => s.isClient) };
}

export const useStairspaceRequestsData = () => {
    const data = useStore(s => s.stairspaceRequests);
    return { data, isClient: useStore(s => s.isClient) };
}

export const useStaffData = () => {
    const leadership = useStore(s => s.leadership);
    const staff = useStore(s => s.staff);
    const agentCategories = useStore(s => s.agentCategories);
    return { leadership, staff, agentCategories, isClient: useStore(s => s.isClient) };
}

export const useAgenciesData = () => {
    const data = useStore(s => s.raahaAgencies);
    return { data, isClient: useStore(s => s.isClient) };
}

export const useWorkersData = () => {
    const workers = useStore(s => s.raahaWorkers);
    return { workers, isClient: useStore(s => s.isClient) };
}

export const useRequestsData = () => {
    const data = useStore(s => s.raahaRequests);
    return { data, isClient: useStore(s => s.isClient) };
}

export const useBeautyData = () => {
    const agencies = useStore(s => s.beautyCenters);
    const services = useStore(s => s.beautyServices);
    const appointments = useStore(s => s.beautyAppointments);
    return { 
        agencies,
        services,
        appointments,
        isClient: useStore(s => s.isClient),
    };
}
export const useBeautySpecialistsData = () => {
    const specialists = useStore(s => s.beautySpecialists);
    return { specialists, isClient: useStore(s => s.isClient) };
}
export const useAssetsData = () => {
    const assets = useStore(s => s.assets);
    return { assets, isClient: useStore(s => s.isClient) };
};

export const useUsedItemsData = () => {
    const items = useStore(s => s.usedItems);
    return { items, isClient: useStore(s => s.isClient) };
}

export const useGiftCardsData = () => {
    const data = useStore(s => s.giftCards);
    return { data, isClient: useStore(s => s.isClient) };
}

export const useStudentsData = () => {
    const students = useStore(s => s.students);
    return { students, isClient: useStore(s => s.isClient) };
}

export const useMembersData = () => {
    const members = useStore(s => s.communityMembers);
    return { members, isClient: useStore(s => s.isClient) };
}

export const useCommunitiesData = () => {
    const communities = useStore(s => s.communities);
    return { communities, isClient: useStore(s => s.isClient) };
};
export const useEventsData = () => {
    const events = useStore(s => s.communityEvents);
    return { events, isClient: useStore(s => s.isClient) };
}
export const useFinancesData = () => {
    const finances = useStore(s => s.communityFinances);
    return { finances, isClient: useStore(s => s.isClient) };
}
export const useAlumniJobsData = () => {
    const jobs = useStore(s => s.alumniJobs);
    return { jobs, isClient: useStore(s => s.isClient) };
}

export const usePosProductsData = () => {
    const posProducts = useStore(s => s.posProducts);
    return { posProducts, isClient: useStore(s => s.isClient) };
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
    const items = useStore(s => s.stockItems);
    return { items, isClient: useStore(s => s.isClient) };
}

export const usePropertiesData = () => {
    const data = useStore(s => s.properties);
    return { data, isClient: useStore(s => s.isClient) };
}

export const useBriefcaseData = () => {
    const data = useStore(s => s.briefcase);
    return { data, isClient: useStore(s => s.isClient) };
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

export const usePricingData = () => {
    const pricing = useStore(s => s.pricing);
    return { pricing, isClient: useStore(s => s.isClient) };
};
