
'use client';

import { useStore } from '@/lib/global-store';
import { useEffect } from 'react';

// A generic hook for managing a slice of the global state
const useDataSlice = <T, K extends keyof ReturnType<typeof useStore>['state']>(
    sliceName: K,
    initialData?: T[]
) => {
    const { state, setState, isClient } = useStore();

    const data = state[sliceName] as T[];
    const setData = (updater: (prev: T[]) => T[]) => {
        setState(s => ({ ...s, [sliceName]: updater(s[sliceName] as T[]) }));
    };

    useEffect(() => {
        if (initialData && isClient && (state[sliceName] as T[]).length === 0) {
           setData(() => initialData);
        }
    }, [initialData, isClient, sliceName, state, setData]);

    return { data, setData, isClient };
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

export const useProductsData = (initialData?: any[]) => useDataSlice('products', initialData);
export const useSaaSProductsData = (initialData?: any[]) => useDataSlice('saasProducts', initialData);
export const useProvidersData = (initialData?: any[]) => useDataSlice('providers', initialData);
export const useOpportunitiesData = (initialData?: any[]) => useDataSlice('opportunities', initialData);
export const useServicesData = (initialData?: any[]) => useDataSlice('services', initialData);
export const useLeasesData = (initialData?: any[]) => useDataSlice('signedLeases', initialData);
export const useStairspaceData = (initialData?: any[]) => {
    const slice = useDataSlice('stairspaceListings', initialData);
    return {
        stairspaceListings: slice.data,
        setStairspaceListings: slice.setData,
        isClient: slice.isClient,
    }
}
export const useStairspaceRequestsData = (initialData?: any[]) => {
     const slice = useDataSlice('stairspaceRequests', initialData);
    return {
        stairspaceRequests: slice.data,
        setStairspaceRequests: slice.setData,
        isClient: slice.isClient,
    }
}
export const useStaffData = (initialData?: any) => {
    const { state, setState, isClient } = useStore();
    useEffect(() => {
        if (initialData && isClient && state.leadership.length === 0) {
            setState(s => ({ 
                ...s, 
                leadership: initialData.leadership,
                staff: initialData.staff,
                agentCategories: initialData.agentCategories,
             }));
        }
    }, [initialData, isClient, setState, state.leadership.length]);

    return {
        leadership: state.leadership,
        staff: state.staff,
        agentCategories: state.agentCategories,
        isClient: state.isClient,
    }
}
export const useAgenciesData = (initialData?: any[]) => useDataSlice('raahaAgencies', initialData);
export const useWorkersData = (initialData?: any[]) => useDataSlice('raahaWorkers', initialData);
export const useRequestsData = (initialData?: any[]) => useDataSlice('raahaRequests', initialData);
export const useBeautyData = (initialAgencies?: any[], initialServices?: any[], initialAppointments?: any[]) => {
    const { state, setState, isClient } = useStore();
    useEffect(() => {
        if(isClient && !state.beautyCenters.length) {
            setState(s => ({
                ...s,
                beautyCenters: initialAgencies || [],
                beautyServices: initialServices || [],
                beautyAppointments: initialAppointments || [],
            }))
        }
    }, [isClient, setState, initialAgencies, initialServices, initialAppointments, state.beautyCenters.length]);
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
export const useBeautySpecialistsData = (initialData?: any[]) => useDataSlice('beautySpecialists', initialData);
export const useUsedItemsData = (initialData?: any[]) => {
     const slice = useDataSlice('usedItems', initialData);
     return {
        items: slice.data,
        setItems: slice.setData,
        isClient: slice.isClient,
     }
}
export const useGiftCardsData = (initialData?: any[]) => useDataSlice('giftCards', initialData);
export const useStudentsData = (initialData?: any[]) => useDataSlice('students', initialData);
export const useMembersData = (initialData?: any[]) => useDataSlice('communityMembers', initialData);
export const useCommunitiesData = (initialData?: any[]) => useDataSlice('communities', initialData);
export const useEventsData = (initialData?: any[]) => useDataSlice('communityEvents', initialData);
export const useFinancesData = (initialData?: any[]) => useDataSlice('communityFinances', initialData);
export const useAlumniJobsData = (initialData?: any[]) => useDataSlice('alumniJobs', initialData);
export const usePosProductsData = (initialData?: any[]) => useDataSlice('posProducts', initialData);
export const usePosData = (initialData?: any[]) => {
    const salesSlice = useDataSlice('dailySales', initialData);
    return {
        dailySales: salesSlice.data,
        setDailySales: salesSlice.setData,
        isClient: salesSlice.isClient,
    }
}
export const useStockItemsData = (initialData?: any[]) => {
     const slice = useDataSlice('stockItems', initialData);
     return {
        items: slice.data,
        setItems: slice.setData,
        isClient: slice.isClient,
     }
}
export const usePropertiesData = (initialData?: any[]) => useDataSlice('properties', initialData);
export const useBriefcaseData = (initialData?: any) => {
    const { state, setState, isClient } = useStore();
     useEffect(() => {
        if (initialData && isClient && !state.briefcase) {
           setState(s => ({ ...s, briefcase: initialData }));
        }
    }, [initialData, isClient, setState, state.briefcase]);
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

export const usePricingData = (initialData?: any[]) => useDataSlice('pricing', initialData);
