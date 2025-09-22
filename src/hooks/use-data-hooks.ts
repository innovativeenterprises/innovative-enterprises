
'use client';
import { useStore } from '@/lib/global-store';
import { useEffect } from 'react';

// A generic hook for managing a slice of the global state
const useDataSlice = <T,>(
    sliceName: keyof ReturnType<typeof useStore>['state'],
    initialData?: T[]
) => {
    const { state, setState } = useStore();

    const data = state[sliceName] as T[];
    const setData = (updater: (prev: T[]) => T[]) => {
        setState(s => ({ ...s, [sliceName]: updater(s[sliceName] as T[]) }));
    };

    useEffect(() => {
        if (initialData && state.isClient && (state[sliceName] as T[]).length === 0) {
           setData(() => initialData);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [initialData, state.isClient]);

    return { data, setData, isClient: state.isClient };
};

// Specific hooks for each data slice
export const useCartData = () => {
    const { state, setState } = useStore();
    const setCart = (updater: (prev: typeof state.cart) => typeof state.cart) => {
        setState(s => ({ ...s, cart: updater(s.cart) }));
    };
    return { cart: state.cart, setCart, isClient: state.isClient };
};

export const useProductsData = (initialData?: any[]) => useDataSlice('products', initialData);
export const useSaaSProductsData = () => useDataSlice('saasProducts');
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
    const { state } = useStore();
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
export const useBeautySpecialistsData = () => useDataSlice('beautySpecialists');
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
export const useCommunitiesData = () => useDataSlice('communities');
export const useEventsData = () => useDataSlice('communityEvents');
export const useFinancesData = () => useDataSlice('communityFinances');
export const useAlumniJobsData = () => useDataSlice('alumniJobs');
export const usePosProductsData = () => useDataSlice('posProducts');
export const usePosData = () => {
    const salesSlice = useDataSlice('dailySales');
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
export const useBriefcaseData = () => {
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

export const usePricingData = (initialData?: any[]) => useDataSlice('pricing', initialData);
