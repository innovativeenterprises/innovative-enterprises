
'use client';

import { useStore, type AppState } from '@/lib/global-store';

// A generic hook for managing a slice of the global state
const useDataSlice = <T, K extends keyof AppState>(
    sliceName: K,
    initialData?: T[]
) => {
    const { state, setState } = useStore();

    // The state is already initialized in the provider, so we just use it.
    // The initialData from props is used on the server to populate the store.
    // On the client, the store is the single source of truth.
    const data = state[sliceName] as T[];
    const setData = (updater: (prev: T[]) => T[]) => {
        setState(s => ({ ...s, [sliceName]: updater(s[sliceName] as T[]) }));
    };

    return { data, setData, isClient: state.isClient };
};

export { useStore };

// Specific hooks for each data slice
export const useCartData = () => {
    const { state, setState } = useStore();
    const setCart = (updater: (prev: typeof state.cart) => typeof state.cart) => {
        setState(s => ({ ...s, cart: updater(s.cart) }));
    };
    return { cart: state.cart, setCart, isClient: state.isClient };
};

export const useProductsData = (initialData?: AppState['products']) => useDataSlice('products', initialData);
export const useSaaSProductsData = (initialData?: AppState['saasProducts']) => useDataSlice('saasProducts', initialData);
export const useProvidersData = (initialData?: AppState['providers']) => useDataSlice('providers', initialData);
export const useOpportunitiesData = (initialData?: AppState['opportunities']) => useDataSlice('opportunities', initialData);
export const useServicesData = (initialData?: AppState['services']) => useDataSlice('services', initialData);
export const useLeasesData = (initialData?: AppState['signedLeases']) => useDataSlice('signedLeases', initialData);
export const useStairspaceData = (initialData?: AppState['stairspaceListings']) => {
    const slice = useDataSlice('stairspaceListings', initialData);
    return {
        stairspaceListings: slice.data,
        setStairspaceListings: slice.setData,
        isClient: slice.isClient,
    }
}
export const useStairspaceRequestsData = (initialData?: AppState['stairspaceRequests']) => {
     const slice = useDataSlice('stairspaceRequests', initialData);
    return {
        data: slice.data,
        setData: slice.setData,
        isClient: slice.isClient,
    }
}
export const useStaffData = (initialData?: { leadership: AppState['leadership'], staff: AppState['staff'], agentCategories: AppState['agentCategories'] }) => {
    const { state } = useStore();
    return {
        leadership: state.leadership,
        staff: state.staff,
        agentCategories: state.agentCategories,
        isClient: state.isClient,
    }
}
export const useAgenciesData = (initialData?: AppState['raahaAgencies']) => useDataSlice('raahaAgencies', initialData);
export const useWorkersData = (initialData?: AppState['raahaWorkers']) => useDataSlice('raahaWorkers', initialData);
export const useRequestsData = (initialData?: AppState['raahaRequests']) => useDataSlice('raahaRequests', initialData);
export const useBeautyData = (initialAgencies?: any[], initialServices?: any[], initialAppointments?: any[]) => {
    const { state, setState } = useStore();
    const setAgencies = (updater: (prev: any[]) => any[]) => setState(s => ({...s, beautyCenters: updater(s.beautyCenters)}));
    const setServices = (updater: (prev: any[]) => any[]) => setState(s => ({...s, beautyServices: updater(s.beautyServices)}));
    const setAppointments = (updater: (prev: any[]) => any[]) => setState(s => ({...s, beautyAppointments: updater(s.beautyAppointments)}));
    return { 
        agencies: state.beautyCenters, 
        setAgencies,
        services: state.beautyServices,
        setServices,
        appointments: state.beautyAppointments,
        setAppointments,
        isClient: state.isClient,
    };
}
export const useBeautySpecialistsData = (initialData?: AppState['beautySpecialists']) => useDataSlice('beautySpecialists', initialData);
export const useUsedItemsData = (initialData?: AppState['usedItems']) => {
     const slice = useDataSlice('usedItems', initialData);
     return {
        items: slice.data,
        setItems: slice.setData,
        isClient: slice.isClient,
     }
}
export const useGiftCardsData = (initialData?: AppState['giftCards']) => useDataSlice('giftCards', initialData);
export const useStudentsData = (initialData?: AppState['students']) => useDataSlice('students', initialData);
export const useMembersData = (initialData?: AppState['communityMembers']) => useDataSlice('communityMembers', initialData);
export const useCommunitiesData = (initialData?: AppState['communities']) => useDataSlice('communities', initialData);
export const useEventsData = (initialData?: AppState['communityEvents']) => useDataSlice('communityEvents', initialData);
export const useFinancesData = (initialData?: AppState['communityFinances']) => useDataSlice('communityFinances', initialData);
export const useAlumniJobsData = (initialData?: AppState['alumniJobs']) => useDataSlice('alumniJobs', initialData);
export const usePosProductsData = (initialData?: AppState['posProducts']) => {
    const slice = useDataSlice('posProducts', initialData);
    return {
        posProducts: slice.data,
        setPosProducts: slice.setData,
        isClient: slice.isClient,
    }
}
export const usePosData = (initialData?: AppState['dailySales']) => {
    const salesSlice = useDataSlice('dailySales', initialData);
    return {
        dailySales: salesSlice.data,
        setDailySales: salesSlice.setData,
        isClient: salesSlice.isClient,
    }
}
export const useStockItemsData = (initialData?: AppState['stockItems']) => {
     const slice = useDataSlice('stockItems', initialData);
     return {
        items: slice.data,
        setItems: slice.setData,
        isClient: slice.isClient,
     }
}
export const usePropertiesData = (initialData?: AppState['properties']) => useDataSlice('properties', initialData);
export const useBriefcaseData = (initialData?: AppState['briefcase']) => {
    const { state, setState } = useStore();
    return {
        data: state.briefcase,
        setData: (updater: (prev: typeof state.briefcase) => typeof state.briefcase) => {
            setState(s => ({ ...s, briefcase: updater(s.briefcase) }));
        },
        isClient: state.isClient
    }
};
export const useNavLinksData = () => {
     const { state } = useStore();
    return {
        solutions: state.solutions,
        industries: state.industries,
        aiTools: state.aiTools,
    }
};

export const useSettingsData = () => {
    const { state } = useStore();
    return { settings: state.settings, isClient: state.isClient };
}

export const usePricingData = (initialData?: AppState['pricing']) => useDataSlice('pricing', initialData);
