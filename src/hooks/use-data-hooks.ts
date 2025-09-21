
'use client';

import { useState, useEffect } from 'react';
import { store, type AppState } from '@/lib/global-store.tsx';
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

function useSlice<T extends keyof AppState>(
  slice: T
): { data: AppState[T]; setData: (updater: (prev: AppState[T]) => AppState[T]) => void; isClient: boolean } {
  const { state, store, isClient } = useGlobalStore();

  const setData = (updater: (prev: AppState[T]) => AppState[T]) => {
    const currentSlice = store.get()[slice];
    store.set((s) => ({ ...s, [slice]: updater(currentSlice) }));
  };

  return { data: state[slice], setData, isClient };
}

export const useRequestsData = (initialData: HireRequest[] = []) => useSlice('raahaRequests');
export const useAgenciesData = (initialData: RaahaAgency[] = []) => useSlice('raahaAgencies');
export const useWorkersData = (initialData: Worker[] = []) => useSlice('raahaWorkers');
export const useStairspaceData = (initialListings: StairspaceListing[] = []) => useSlice('stairspaceListings');
export const useStairspaceRequestsData = (initialData: BookingRequest[] = []) => useSlice('stairspaceRequests');
export const usePropertiesData = (initialData: Property[] = []) => useSlice('properties');
export const useLeasesData = (initialData: SignedLease[] = []) => useSlice('signedLeases');
export const useProvidersData = (initialData: Provider[] = []) => useSlice('providers');
export const useOpportunitiesData = (initialOpportunities: Opportunity[] = []) => useSlice('opportunities');
export const useStudentsData = (initialData: Student[] = []) => useSlice('students');
export const useMembersData = (initialData: CommunityMember[] = []) => useSlice('communityMembers');
export const useEventsData = (initialData: CommunityEvent[] = []) => useSlice('communityEvents');
export const useFinancesData = (initialData: CommunityFinance[] = []) => useSlice('communityFinances');
export const useClientsData = (initialData: Client[] = []) => useSlice('clients');
export const useTestimonialsData = (initialData: Testimonial[] = []) => useSlice('testimonials');
export const useGiftCardsData = (initialData: GiftCard[] = []) => useSlice('giftCards');
export const useUsedItemsData = (initialItems: any[] = []) => useSlice('usedItems');
export const useDailySalesData = (initialData: DailySales = []) => useSlice('dailySales');
export const useSaasProductsData = (initialData: SaasCategory[] = []) => useSlice('saasProducts');
export const usePricingData = (initialPricing: Pricing[] = []) => useSlice('pricing');
export const useInvestorsData = (initialData: Investor[] = []) => useSlice('investors');
export const useCommunitiesData = (initialData: Community[] = []) => useSlice('communities');
export const usePosProductsData = (initialProducts: PosProduct[] = []) => useSlice('posProducts');
export const useProductsData = (initialProducts: Product[] = []) => useSlice('products');

export const useBriefcaseData = (initialData?: BriefcaseData) => {
    const { data, setData, isClient } = useSlice('briefcase');
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

export const useStaffData = () => {
    const { state, isClient } = useGlobalStore();
    return { 
        leadership: state.leadership, 
        staff: state.staff, 
        agentCategories: state.agentCategories, 
        isClient 
    };
};
