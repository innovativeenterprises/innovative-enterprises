
'use client';

import { useState, useEffect } from 'react';
import { store } from '@/lib/global-store';
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

const useDataState = <T>(initialData: T[], dataKey: keyof typeof store.get) => {
    const [data, setData] = useState<T[]>(initialData);
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
        // This can be expanded to sync with global store or fetch updates
    }, []);

    const updateData = (updater: (prev: T[]) => T[]) => {
        setData(updater);
        // In a real app with global state, you'd update it here:
        // store.set(state => ({ ...state, [dataKey]: updater(state[dataKey]) }));
    };

    return { data, setData: updateData, isClient };
};

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


export const useRequestsData = (initialData: HireRequest[] = []) => useDataState<HireRequest>(initialData, 'raahaRequests');
export const useAgenciesData = (initialData: RaahaAgency[] = []) => useDataState<RaahaAgency>(initialData, 'raahaAgencies');
export const useWorkersData = (initialData: Worker[] = []) => useDataState<Worker>(initialData, 'raahaWorkers');
export const useStairspaceData = (initialListings: StairspaceListing[] = []) => useDataState(initialListings, 'stairspaceListings');
export const useStairspaceRequestsData = (initialData: BookingRequest[] = []) => useDataState<BookingRequest>(initialData, 'stairspaceRequests');
export const usePropertiesData = (initialData: Property[] = []) => useDataState<Property>(initialData, 'properties');
export const useLeasesData = (initialData: SignedLease[] = []) => useDataState<SignedLease>(initialData, 'signedLeases');
export const useProvidersData = (initialData: Provider[] = []) => useDataState<Provider>(initialData, 'providers');
export const useOpportunitiesData = (initialOpportunities: Opportunity[] = []) => useDataState(initialOpportunities, 'opportunities');
export const useStudentsData = (initialData: Student[] = []) => useDataState<Student>(initialData, 'students');
export const useMembersData = (initialData: CommunityMember[] = []) => useDataState<CommunityMember>(initialData, 'communityMembers');
export const useEventsData = (initialData: CommunityEvent[] = []) => useDataState<CommunityEvent>(initialData, 'communityEvents');
export const useFinancesData = (initialData: CommunityFinance[] = []) => useDataState<CommunityFinance>(initialData, 'communityFinances');
export const useClientsData = (initialData: Client[] = []) => useDataState<Client>(initialData, 'clients');
export const useTestimonialsData = (initialData: Testimonial[] = []) => useDataState<Testimonial>(initialData, 'testimonials');
export const useGiftCardsData = (initialData: GiftCard[] = []) => useDataState<GiftCard>(initialData, 'giftCards');
export const useUsedItemsData = (initialItems: UsedItem[] = []) => useDataState(initialItems, 'usedItems');
export const useDailySalesData = (initialData: DailySales = []) => useDataState<any>(initialData, 'dailySales');
export const useSaasProductsData = (initialData: SaasCategory[] = []) => useDataState<SaasCategory>(initialData, 'saasProducts');
export const usePricingData = (initialPricing: Pricing[] = []) => useDataState(initialPricing, 'pricing');
export const useInvestorsData = (initialData: Investor[] = []) => useDataState<Investor>(initialData, 'investors');
export const useCommunitiesData = (initialData: Community[] = []) => useDataState<Community>(initialData, 'communities');
export const usePosProductsData = (initialProducts: PosProduct[] = []) => useDataState(initialProducts, 'posProducts');

export const useBriefcaseData = (initialData?: BriefcaseData) => {
    const [data, setData] = useState<BriefcaseData | null>(initialData || null);
    const [isClient, setIsClient] = useState(false);
    useEffect(() => {
        setIsClient(true);
    }, []);
    const updateData = (updater: (prev: BriefcaseData | null) => BriefcaseData | null) => {
        setData(updater);
    };
    return { data, setData: updateData, isClient };
};

export const useProductsData = (initialProducts: Product[] = []) => {
    const [data, setData] = useState<Product[]>(initialProducts);
    const [isClient, setIsClient] = useState(false);
    useEffect(() => {
        setIsClient(true);
    }, []);
    return { data, setData, isClient };
};

export const useCartData = () => {
    const { state, store, isClient } = useGlobalStore();
    
    const cart = isClient ? state.cart : [];

    const setCart = (updater: (currentCart: CartItem[]) => CartItem[]) => {
        const currentCart = store.get().cart;
        store.set(s => ({ ...s, cart: updater(currentCart) }));
    };
    
    return { cart, setCart, isClient };
};


export const usePosData = () => {
    const { state, store, isClient } = useGlobalStore();
    const dailySales = isClient ? state.dailySales : [];
    const setDailySales = (updater: (currentSales: DailySales) => DailySales) => {
        const currentSales = store.get().dailySales;
        store.set(s => ({ ...s, dailySales: updater(currentSales) }));
    };
    return { dailySales, setDailySales, isClient };
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
