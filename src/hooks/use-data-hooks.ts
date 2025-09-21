
'use client';

import { useState, useEffect } from 'react';
import { useStore, type AppState } from '@/lib/global-store.tsx';
import type { HireRequest } from "@/lib/raaha-requests.schema";
import type { Agency as RaahaAgency } from "@/lib/raaha-agencies.schema";
import type { Worker } from "@/lib/raaha-workers.schema";
import type { StairspaceListing } from '@/lib/stairspace.schema';
import type { BookingRequest } from '@/lib/stairspace-requests';
import type { Property } from '@/lib/properties.schema';
import type { SignedLease } from '@/lib/leases';
import type { Provider } from '@/lib/providers.schema';
import type { Opportunity } from '@/lib/opportunities.schema';
import type { Student } from '@/lib/students.schema';
import type { CommunityMember } from '@/lib/community-members';
import type { CommunityEvent } from '@/lib/community-events';
import type { CommunityFinance } from '@/lib/community-finances';
import type { Client, Testimonial } from '@/lib/clients.schema';
import type { GiftCard } from '@/lib/gift-cards.schema';
import type { DailySales, PosProduct, CartItem } from '@/lib/pos-data.schema';
import type { SaasCategory } from '@/lib/saas-products.schema';
import type { Pricing } from '@/lib/pricing.schema';
import type { Product } from '@/lib/products.schema';
import type { BriefcaseData } from '@/lib/briefcase';
import type { Community } from '@/lib/communities';
import type { Investor } from '@/lib/investors.schema';
import type { AppSettings } from '@/lib/settings';
import type { Agent, AgentCategory } from '@/lib/agents.schema';

function useSlice<T extends keyof AppState>(
  slice: T,
  initialData?: AppState[T]
): { data: AppState[T]; setData: (updater: (prev: AppState[T]) => AppState[T]) => void; isClient: boolean } {
  const { state, store, isClient } = useGlobalStore();

  useEffect(() => {
    if (initialData !== undefined) {
      store.set((s) => ({ ...s, [slice]: initialData }));
    }
  }, [initialData, slice, store]);

  const setData = (updater: (prev: AppState[T]) => AppState[T]) => {
    store.set((s) => ({ ...s, [slice]: updater(s[slice]) }));
  };

  return { data: state[slice], setData, isClient };
}


export const useGlobalStore = () => {
    const store = useStore();
    const [state, setState] = useState(store.get());
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
        const unsubscribe = store.subscribe(() => {
            setState(store.get());
        });
        return unsubscribe;
    }, [store]);

    return { state, store, isClient };
}

export const useRequestsData = (initialData: HireRequest[] = []) => useSlice('raahaRequests', initialData);
export const useAgenciesData = (initialData: RaahaAgency[] = []) => useSlice('raahaAgencies', initialData);
export const useWorkersData = (initialData: Worker[] = []) => useSlice('raahaWorkers', initialData);
export const useStairspaceData = (initialListings: StairspaceListing[] = []) => useSlice('stairspaceListings', initialListings);
export const useStairspaceRequestsData = (initialData: BookingRequest[] = []) => useSlice('stairspaceRequests', initialData);
export const usePropertiesData = (initialData: Property[] = []) => useSlice('properties', initialData);
export const useLeasesData = (initialData: SignedLease[] = []) => useSlice('signedLeases', initialData);
export const useProvidersData = (initialData: Provider[] = []) => useSlice('providers', initialData);
export const useOpportunitiesData = (initialOpportunities: Opportunity[] = []) => useSlice('opportunities', initialOpportunities);
export const useStudentsData = (initialData: Student[] = []) => useSlice('students', initialData);
export const useMembersData = (initialData: CommunityMember[] = []) => useSlice('communityMembers', initialData);
export const useEventsData = (initialData: CommunityEvent[] = []) => useSlice('communityEvents', initialData);
export const useFinancesData = (initialData: CommunityFinance[] = []) => useSlice('communityFinances', initialData);
export const useClientsData = (initialData: Client[] = []) => useSlice('clients', initialData);
export const useTestimonialsData = (initialData: Testimonial[] = []) => useSlice('testimonials', initialData);
export const useGiftCardsData = (initialData: GiftCard[] = []) => useSlice('giftCards', initialData);
export const useUsedItemsData = (initialItems: any[] = []) => useSlice('usedItems', initialItems);
export const useSaasProductsData = (initialData: SaasCategory[] = []) => useSlice('saasProducts', initialData);
export const usePricingData = (initialPricing: Pricing[] = []) => useSlice('pricing', initialPricing);
export const useInvestorsData = (initialData: Investor[] = []) => useSlice('investors', initialData);
export const useCommunitiesData = (initialData: Community[] = []) => useSlice('communities', initialData);
export const useProductsData = (initialProducts: Product[] = []) => useSlice('products', initialProducts);
export const useStaffData = () => useSlice('staff');
export const useLeadershipData = () => useSlice('leadership');
export const useAgentCategoriesData = () => useSlice('agentCategories');
export const useServicesData = (initialData: Service[] = []) => useSlice('services', initialData);


export const useBriefcaseData = (initialData?: BriefcaseData) => {
    const { data, setData, isClient } = useSlice('briefcase', initialData);
     useEffect(() => {
        if(initialData) {
            setData(() => initialData);
        }
    }, [initialData, setData]);
    return { data, setData, isClient };
};

export const useCartData = () => {
    const { data, setData, isClient } = useSlice('cart');
    const setCart = (updater: (currentCart: CartItem[]) => CartItem[]) => {
        setData(updater);
    };
    return { cart: data, setCart, isClient };
};


export const usePosData = () => {
     const { data, setData, isClient } = useSlice('dailySales');
     const setDailySales = (updater: (currentSales: DailySales) => DailySales) => {
        setData(updater);
    };
    return { dailySales: data, setDailySales, isClient };
};


export const useBeautyData = () => {
    const { state, store, isClient } = useGlobalStore();
    const setAgencies = (updater: (prev: any[]) => any[]) => {
        store.set(s => ({ ...s, beautyCenters: updater(s.beautyCenters) }));
    };
    const setServices = (updater: (prev: any[]) => any[]) => {
        store.set(s => ({ ...s, beautyServices: updater(s.beautyServices) }));
    };
    const setAppointments = (updater: (prev: any[]) => any[]) => {
        store.set(s => ({ ...s, beautyAppointments: updater(s.beautyAppointments) }));
    };
    
    return { 
        agencies: state.beautyCenters, 
        services: state.beautyServices, 
        appointments: state.beautyAppointments, 
        setAgencies, 
        setServices,
        setAppointments,
        isClient 
    };
};

export const useBeautySpecialistsData = (initialData: any[] = []) => {
    const [data, setData] = useState(initialData);
    const [isClient, setIsClient] = useState(false);
    useEffect(() => {
        setIsClient(true);
    }, [initialData]);

    return { specialists: data, setSpecialists: setData, isClient };
};

export const usePosProductsData = (initialData: PosProduct[] = []) => {
    const { data, setData, isClient } = useSlice('posProducts', initialData);
    return { posProducts: data, setPosProducts: setData, isClient };
}

export const useSettingsData = () => {
    const { state, isClient } = useGlobalStore();
    return { settings: state.settings!, isClient };
};
