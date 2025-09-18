
'use client';

import { useContext, useSyncExternalStore } from 'react';
import type { AppSettings } from '@/lib/settings';
import type { CartItem } from '@/lib/global-store';
import { initialState, type AppState, type StoreType } from '@/lib/global-store';
import { StoreContext } from '@/components/layout/store-provider';
import type { SignedLease } from '@/lib/leases';
import type { BookingRequest } from '@/lib/stairspace-requests';
import type { Product } from '@/lib/products.schema';
import type { Provider } from '@/lib/providers.schema';
import type { Opportunity } from '@/lib/opportunities.schema';
import type { Service } from '@/lib/services.schema';
import type { Agent, AgentCategory } from '@/lib/agents.schema';
import type { Agency as RaahaAgency } from '@/lib/raaha-agencies';
import type { Worker as RaahaWorker } from '@/lib/raaha-workers';
import type { HireRequest } from '@/lib/raaha-requests';
import type { StairspaceListing } from '@/lib/stairspace.schema';
import type { CostRate } from '@/lib/cost-settings.schema';
import type { BeautyCenter } from '@/lib/beauty-centers';
import type { BeautyService } from '@/lib/beauty-services';
import type { BeautyAppointment } from '@/lib/beauty-appointments';
import type { UsedItem } from '@/lib/used-items.schema';
import type { Asset } from '@/lib/assets.schema';
import type { Client, Testimonial } from '@/lib/clients.schema';


function useStoreData<T>(selector: (state: AppState) => T): T {
  const store = useContext(StoreContext);
  if (!store) {
    throw new Error('useStoreData must be used within a StoreProvider.');
  }
  const state = useSyncExternalStore(
    store.subscribe,
    () => selector(store.get()),
    () => selector(initialState)
  );
  return state;
}

// Settings
export const useSettingsData = () => {
    const store = useContext(StoreContext)!;
    const isClient = useSyncExternalStore(store.subscribe, () => true, () => false);
    const setSettings = (updater: (prev: AppState['settings']) => AppState['settings']) => store.set(state => ({...state, settings: updater(state.settings)}));
    return {
        settings: useStoreData((s) => s.settings),
        setSettings,
        isClient,
    };
};

// Cart
export const useCartData = () => {
    const store = useContext(StoreContext)!;
    const isClient = useSyncExternalStore(store.subscribe, () => true, () => false);
    const setCart = (updater: (prev: AppState['cart']) => AppState['cart']) => store.set(state => ({...state, cart: updater(state.cart)}));
    return {
        cart: useStoreData((s) => s.cart),
        setCart,
        isClient,
    };
};

// Signed Leases
export const useLeasesData = () => {
    const store = useContext(StoreContext)!;
    const isClient = useSyncExternalStore(store.subscribe, () => true, () => false);
    const setLeases = (updater: (prev: AppState['signedLeases']) => AppState['signedLeases']) => store.set(state => ({...state, signedLeases: updater(state.signedLeases)}));
    return {
        leases: useStoreData((s) => s.signedLeases),
        setLeases,
        isClient,
    };
};


// StairSpace Requests
export const useStairspaceRequestsData = () => {
    const store = useContext(StoreContext)!;
    const isClient = useSyncExternalStore(store.subscribe, () => true, () => false);
    const setStairspaceRequests = (updater: (prev: AppState['stairspaceRequests']) => AppState['stairspaceRequests']) => store.set(state => ({...state, stairspaceRequests: updater(state.stairspaceRequests)}));
    return {
        stairspaceRequests: useStoreData((s) => s.stairspaceRequests),
        setStairspaceRequests,
        isClient,
    };
};


// Products
export const useProductsData = () => {
    const store = useContext(StoreContext)!;
    const isClient = useSyncExternalStore(store.subscribe, () => true, () => false);
    const setProducts = (updater: (prev: AppState['products']) => AppState['products']) => store.set(state => ({...state, products: updater(state.products)}));
    return {
        products: useStoreData((s) => s.products),
        setProducts,
        isClient,
    };
};

// Providers
export const useProvidersData = () => {
    const store = useContext(StoreContext)!;
    const isClient = useSyncExternalStore(store.subscribe, () => true, () => false);
    const setProviders = (updater: (prev: AppState['providers']) => AppState['providers']) => store.set(state => ({...state, providers: updater(state.providers)}));
    return {
        providers: useStoreData((s) => s.providers),
        setProviders,
        isClient,
    };
};

// Opportunities
export const useOpportunitiesData = () => {
    const store = useContext(StoreContext)!;
    const isClient = useSyncExternalStore(store.subscribe, () => true, () => false);
    const setOpportunities = (updater: (prev: AppState['opportunities']) => AppState['opportunities']) => store.set(state => ({...state, opportunities: updater(state.opportunities)}));
    return {
        opportunities: useStoreData((s) => s.opportunities),
        setOpportunities,
        isClient,
    };
};

// Services
export const useServicesData = () => {
    const store = useContext(StoreContext)!;
    const isClient = useSyncExternalStore(store.subscribe, () => true, () => false);
    const setServices = (updater: (prev: AppState['services']) => AppState['services']) => store.set(state => ({...state, services: updater(state.services)}));
    return {
        services: useStoreData((s) => s.services),
        setServices,
        isClient,
    };
};

// Staff (Leadership, Staff, Agents)
export const useStaffData = () => {
    const store = useContext(StoreContext)!;
    const isClient = useSyncExternalStore(store.subscribe, () => true, () => false);
    const setLeadership = (updater: (prev: AppState['leadership']) => AppState['leadership']) => store.set(state => ({...state, leadership: updater(state.leadership)}));
    const setStaff = (updater: (prev: AppState['staff']) => AppState['staff']) => store.set(state => ({...state, staff: updater(state.staff)}));
    const setAgentCategories = (updater: (prev: AppState['agentCategories']) => AppState['agentCategories']) => store.set(state => ({...state, agentCategories: updater(state.agentCategories)}));
    return {
        leadership: useStoreData(s => s.leadership),
        staff: useStoreData(s => s.staff),
        agentCategories: useStoreData(s => s.agentCategories),
        setLeadership,
        setStaff,
        setAgentCategories,
        isClient
    };
}


// RAAHA Data
export const useRaahaData = () => {
    const store = useContext(StoreContext)!;
    const isClient = useSyncExternalStore(store.subscribe, () => true, () => false);
    const setAgencies = (updater: (prev: AppState['raahaAgencies']) => AppState['raahaAgencies']) => store.set(state => ({ ...state, raahaAgencies: updater(state.raahaAgencies) }));
    const setWorkers = (updater: (prev: AppState['raahaWorkers']) => AppState['raahaWorkers']) => store.set(state => ({ ...state, raahaWorkers: updater(state.raahaWorkers) }));
    const setRequests = (updater: (prev: AppState['raahaRequests']) => AppState['raahaRequests']) => store.set(state => ({ ...state, raahaRequests: updater(state.raahaRequests) }));
    return {
        agencies: useStoreData(s => s.raahaAgencies),
        setAgencies,
        workers: useStoreData(s => s.raahaWorkers),
        setWorkers,
        requests: useStoreData(s => s.raahaRequests),
        setRequests,
        isClient,
    };
};

// RAAHA Worker Data
export const useWorkersData = () => {
    const store = useContext(StoreContext)!;
    const isClient = useSyncExternalStore(store.subscribe, () => true, () => false);
    const setWorkers = (updater: (prev: AppState['raahaWorkers']) => AppState['raahaWorkers']) => store.set(state => ({ ...state, raahaWorkers: updater(state.raahaWorkers) }));
    return {
        workers: useStoreData((s) => s.raahaWorkers),
        setWorkers,
        isClient,
    };
};

// RAAHA Agency Data
export const useAgenciesData = () => {
    const store = useContext(StoreContext)!;
    const isClient = useSyncExternalStore(store.subscribe, () => true, () => false);
    const setAgencies = (updater: (prev: AppState['raahaAgencies']) => AppState['raahaAgencies']) => store.set(state => ({ ...state, raahaAgencies: updater(state.raahaAgencies) }));
    return {
        agencies: useStoreData((s) => s.raahaAgencies),
        setAgencies,
        isClient,
    };
};

// RAAHA Request Data
export const useRequestsData = () => {
    const store = useContext(StoreContext)!;
    const isClient = useSyncExternalStore(store.subscribe, () => true, () => false);
    const setRaahaRequests = (updater: (prev: AppState['raahaRequests']) => AppState['raahaRequests']) => store.set(state => ({ ...state, raahaRequests: updater(state.raahaRequests) }));
    return {
        requests: useStoreData((s) => s.raahaRequests),
        setRaahaRequests,
        isClient,
    };
};


// StairSpace Data
export const useStairspaceData = () => {
    const store = useContext(StoreContext)!;
    const isClient = useSyncExternalStore(store.subscribe, () => true, () => false);
    const setStairspaceListings = (updater: (prev: AppState['stairspaceListings']) => AppState['stairspaceListings']) => store.set((state) => ({ ...state, stairspaceListings: updater(state.stairspaceListings) }));
    return {
        stairspaceListings: useStoreData((s) => s.stairspaceListings),
        setStairspaceListings,
        isClient,
    };
};

// Cost Settings
export const useCostSettingsData = () => {
    const store = useContext(StoreContext)!;
    const isClient = useSyncExternalStore(store.subscribe, () => true, () => false);
    const setCostSettings = (updater: (prev: AppState['costSettings']) => AppState['costSettings']) => store.set((state) => ({ ...state, costSettings: updater(state.costSettings) }));
    return {
        costSettings: useStoreData((s) => s.costSettings),
        setCostSettings,
        isClient,
    };
};

// Beauty Hub Data
export const useBeautyData = () => {
    const store = useContext(StoreContext)!;
    const isClient = useSyncExternalStore(store.subscribe, () => true, () => false);
    const setAgencies = (updater: (prev: AppState['beautyCenters']) => AppState['beautyCenters']) => store.set(state => ({...state, beautyCenters: updater(state.beautyCenters)}));
    const setServices = (updater: (prev: AppState['beautyServices']) => AppState['beautyServices']) => store.set(state => ({...state, beautyServices: updater(state.beautyServices)}));
    const setAppointments = (updater: (prev: AppState['beautyAppointments']) => AppState['beautyAppointments']) => store.set(state => ({...state, beautyAppointments: updater(state.beautyAppointments)}));
    return {
        agencies: useStoreData(s => s.beautyCenters),
        services: useStoreData(s => s.beautyServices),
        appointments: useStoreData(s => s.beautyAppointments),
        setAgencies,
        setServices,
        setAppointments,
        isClient,
    };
};

// Assets
export const useAssetsData = () => {
    const store = useContext(StoreContext)!;
    const isClient = useSyncExternalStore(store.subscribe, () => true, () => false);
    const setAssets = (updater: (prev: AppState['assets']) => AppState['assets']) => store.set(state => ({ ...state, assets: updater(state.assets) }));
    return {
        assets: useStoreData((s) => s.assets),
        setAssets,
        isClient,
    };
};

// Used Items
export const useUsedItemsData = () => {
    const store = useContext(StoreContext)!;
    const isClient = useSyncExternalStore(store.subscribe, () => true, () => false);
    const setItems = (updater: (prev: AppState['usedItems']) => AppState['usedItems']) => store.set((state) => ({ ...state, usedItems: updater(state.usedItems) }));
    return {
        items: useStoreData((s) => s.usedItems),
        setItems,
        isClient,
    };
};

// Clients
export const useClientsData = () => {
    const store = useContext(StoreContext)!;
    const isClient = useSyncExternalStore(store.subscribe, () => true, () => false);
    const setClients = (updater: (prev: AppState['clients']) => AppState['clients']) => store.set((state) => ({ ...state, clients: updater(state.clients) }));
    return {
        clients: useStoreData((s) => s.clients),
        setClients,
        isClient,
    };
}

// Testimonials
export const useTestimonialsData = () => {
    const store = useContext(StoreContext)!;
    const isClient = useSyncExternalStore(store.subscribe, () => true, () => false);
    const setTestimonials = (updater: (prev: AppState['testimonials']) => AppState['testimonials']) => store.set((state) => ({ ...state, testimonials: updater(state.testimonials) }));
    return {
        testimonials: useStoreData((s) => s.testimonials),
        setTestimonials,
        isClient,
    };
}
