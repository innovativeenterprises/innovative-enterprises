
'use client';
import { useGlobalStore } from '@/lib/global-store';
import { useEffect } from 'react';

// A generic hook for managing a slice of the global state
const useDataSlice = <T,>(
    sliceName: keyof ReturnType<typeof useGlobalStore>['state'],
    initialData?: T[]
) => {
    const { state, store } = useGlobalStore();

    const data = state[sliceName] as T[];
    const setData = (updater: (prev: T[]) => T[]) => {
        store.set(s => ({ ...s, [sliceName]: updater(s[sliceName] as T[]) }));
    };

    useEffect(() => {
        if (initialData) {
            setData(() => initialData);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [initialData]);

    return { data, setData, isClient: state.isClient };
};

// Specific hooks for each data slice
export const useCartData = () => useDataSlice('cart');
export const useProductsData = (initialData?: any[]) => useDataSlice('products', initialData);
export const useSaaSProductsData = () => useDataSlice('saasProducts');
export const useProvidersData = (initialData?: any[]) => useDataSlice('providers', initialData);
export const useOpportunitiesData = (initialData?: any[]) => useDataSlice('opportunities', initialData);
export const useServicesData = (initialData?: any[]) => useDataSlice('services', initialData);
export const useLeasesData = (initialData?: any[]) => useDataSlice('signedLeases', initialData);
export const useStairspaceData = (initialData?: any[]) => useDataSlice('stairspaceListings', initialData);
export const useStairspaceRequestsData = (initialData?: any[]) => useDataSlice('stairspaceRequests', initialData);
export const useStaffData = (initialData?: any) => {
    const { state } = useGlobalStore();
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
    const agenciesSlice = useDataSlice('beautyCenters', initialAgencies);
    const servicesSlice = useDataSlice('beautyServices', initialServices);
    const appointmentsSlice = useDataSlice('beautyAppointments', initialAppointments);
    return { 
        agencies: agenciesSlice.data, 
        setAgencies: agenciesSlice.setData,
        services: servicesSlice.data,
        setServices: servicesSlice.setData,
        appointments: appointmentsSlice.data,
        setAppointments: appointmentsSlice.setData,
        isClient: agenciesSlice.isClient, // Use one isClient flag
    };
}
export const useBeautySpecialistsData = () => useDataSlice('beautySpecialists');
export const useUsedItemsData = (initialData?: any[]) => useDataSlice('usedItems', initialData);
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
export const useStockItemsData = (initialData?: any[]) => useDataSlice('stockItems', initialData);
export const usePropertiesData = (initialData?: any[]) => useDataSlice('properties', initialData);
export const useBriefcaseData = () => {
    const { state, store } = useGlobalStore();
    return {
        data: state.briefcase,
        setData: (updater: (prev: typeof state.briefcase) => typeof state.briefcase) => {
            store.set(s => ({ ...s, briefcase: updater(s.briefcase) }));
        },
        isClient: state.isClient
    }
};
export const useNavLinksData = () => {
     const { state } = useGlobalStore();
    return {
        solutions: state.solutions,
        industries: state.industries,
        aiTools: state.aiTools,
    }
};

export const usePricingData = (initialData?: any[]) => useDataSlice('pricing', initialData);
