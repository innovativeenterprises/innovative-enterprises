

'use client';

import { useContext, useSyncExternalStore } from 'react';
import type { AppSettings } from '@/lib/settings';
import type { CartItem } from '@/lib/global-store';
import { initialState, type AppState, type StoreType } from '@/lib/global-store';
import { StoreContext } from '@/components/layout/store-provider';
import type { SignedLease } from '@/lib/leases';
import type { BookingRequest } from '@/lib/stairspace-requests';
import type { Product } from '@/lib/products';
import type { Provider } from '@/lib/providers';
import type { Opportunity } from '@/lib/opportunities';
import type { Service } from '@/lib/services';
import type { Agent, AgentCategory } from '@/lib/agents';
import type { Agency as RaahaAgency } from '@/lib/raaha-agencies';
import type { Worker as RaahaWorker } from '@/lib/raaha-workers';
import type { HireRequest } from '@/lib/raaha-requests';
import type { StairspaceListing } from '@/lib/stairspace.schema';
import type { CostRate } from '@/lib/cost-settings.schema';
import type { BeautyCenter } from '@/lib/beauty-centers';
import type { BeautyService } from '@/lib/beauty-services';
import type { BeautyAppointment } from '@/lib/beauty-appointments';
import type { UsedItem } from '@/lib/used-items.schema';
import type { Asset } from '@/lib/assets';


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

const useStore = () => {
    const store = useContext(StoreContext);
    if (!store) {
        throw new Error('useStore must be used within a StoreProvider.');
    }
    return store;
}

// Settings
export const useSettingsData = () => {
    const store = useStore();
    const isClient = useSyncExternalStore(store.subscribe, () => true, () => false);
    return {
        settings: useStoreData((s) => s.settings),
        setSettings: (updater: (prev: AppSettings) => AppSettings) => store.set((state) => ({ ...state, settings: updater(state.settings) })),
        isClient,
    };
};

// Cart
export const useCartData = () => {
    const store = useStore();
    const isClient = useSyncExternalStore(store.subscribe, () => true, () => false);
    return {
        cart: useStoreData((s) => s.cart),
        setCart: (updater: (prev: CartItem[]) => CartItem[]) => store.set((state) => ({ ...state, cart: updater(state.cart) })),
        isClient,
    };
};

// Signed Leases
export const useLeasesData = () => {
    const store = useStore();
    const isClient = useSyncExternalStore(store.subscribe, () => true, () => false);
    return {
        leases: useStoreData((s) => s.signedLeases),
        setLeases: (updater: (prev: SignedLease[]) => SignedLease[]) => store.set((state) => ({ ...state, signedLeases: updater(state.signedLeases) })),
        isClient,
    };
};


// StairSpace Requests
export const useStairspaceRequestsData = () => {
    const store = useStore();
    const isClient = useSyncExternalStore(store.subscribe, () => true, () => false);
    return {
        stairspaceRequests: useStoreData((s) => s.stairspaceRequests),
        setStairspaceRequests: (updater: (prev: BookingRequest[]) => BookingRequest[]) => store.set((state) => ({ ...state, stairspaceRequests: updater(state.stairspaceRequests) })),
        isClient,
    };
};


// Products
export const useProductsData = () => {
    const store = useStore();
    const isClient = useSyncExternalStore(store.subscribe, () => true, () => false);
    return {
        products: useStoreData((s) => s.products),
        setProducts: (updater: (prev: Product[]) => Product[]) => store.set((state) => ({ ...state, products: updater(state.products) })),
        isClient,
    };
};

// Providers
export const useProvidersData = () => {
    const store = useStore();
    const isClient = useSyncExternalStore(store.subscribe, () => true, () => false);
    return {
        providers: useStoreData((s) => s.providers),
        setProviders: (updater: (prev: Provider[]) => Provider[]) => store.set((state) => ({ ...state, providers: updater(state.providers) })),
        isClient,
    };
};

// Opportunities
export const useOpportunitiesData = () => {
    const store = useStore();
    const isClient = useSyncExternalStore(store.subscribe, () => true, () => false);
    return {
        opportunities: useStoreData((s) => s.opportunities),
        setOpportunities: (updater: (prev: Opportunity[]) => Opportunity[]) => store.set((state) => ({ ...state, opportunities: updater(state.opportunities) })),
        isClient,
    };
};

// Services
export const useServicesData = () => {
    const store = useStore();
    const isClient = useSyncExternalStore(store.subscribe, () => true, () => false);
    return {
        services: useStoreData((s) => s.services),
        setServices: (updater: (prev: Service[]) => Service[]) => store.set((state) => ({ ...state, services: updater(state.services) })),
        isClient,
    };
};

// Staff (Leadership, Staff, Agents)
export const useStaffData = () => {
    const store = useStore();
    const isClient = useSyncExternalStore(store.subscribe, () => true, () => false);
    return {
        leadership: useStoreData(s => s.leadership),
        staff: useStoreData(s => s.staff),
        agentCategories: useStoreData(s => s.agentCategories),
        setLeadership: (updater: (prev: AppState['leadership']) => AppState['leadership']) => store.set(state => ({...state, leadership: updater(state.leadership)})),
        setStaff: (updater: (prev: AppState['staff']) => AppState['staff']) => store.set(state => ({...state, staff: updater(state.staff)})),
        setAgentCategories: (updater: (prev: AppState['agentCategories']) => AppState['agentCategories']) => store.set(state => ({...state, agentCategories: updater(state.agentCategories)})),
        isClient
    };
}


// RAAHA Data
export const useRaahaData = () => {
    const store = useStore();
    const isClient = useSyncExternalStore(store.subscribe, () => true, () => false);
    return {
        agencies: useStoreData(s => s.raahaAgencies),
        setAgencies: (updater: (prev: RaahaAgency[]) => RaahaAgency[]) => store.set(state => ({ ...state, raahaAgencies: updater(state.raahaAgencies) })),
        workers: useStoreData(s => s.raahaWorkers),
        setWorkers: (updater: (prev: RaahaWorker[]) => RaahaWorker[]) => store.set(state => ({ ...state, raahaWorkers: updater(state.raahaWorkers) })),
        requests: useStoreData(s => s.raahaRequests),
        setRequests: (updater: (prev: HireRequest[]) => HireRequest[]) => store.set(state => ({ ...state, raahaRequests: updater(state.raahaRequests) })),
        isClient,
    };
};

// StairSpace Data
export const useStairspaceData = () => {
    const store = useStore();
    const isClient = useSyncExternalStore(store.subscribe, () => true, () => false);
    return {
        stairspaceListings: useStoreData((s) => s.stairspaceListings),
        setStairspaceListings: (updater: (prev: StairspaceListing[]) => StairspaceListing[]) => store.set((state) => ({ ...state, stairspaceListings: updater(state.stairspaceListings) })),
        isClient,
    };
};

// Cost Settings
export const useCostSettingsData = () => {
    const store = useStore();
    const isClient = useSyncExternalStore(store.subscribe, () => true, () => false);
    return {
        costSettings: useStoreData((s) => s.costSettings),
        setCostSettings: (updater: (prev: CostRate[]) => CostRate[]) => store.set((state) => ({ ...state, costSettings: updater(state.costSettings) })),
        isClient,
    };
};

// Beauty Hub Data
export const useBeautyData = () => {
    const store = useStore();
    const isClient = useSyncExternalStore(store.subscribe, () => true, () => false);
    return {
        agencies: useStoreData(s => s.beautyCenters),
        services: useStoreData(s => s.beautyServices),
        appointments: useStoreData(s => s.beautyAppointments),
        setAgencies: (updater: (prev: AppState['beautyCenters']) => AppState['beautyCenters']) => store.set(state => ({...state, beautyCenters: updater(state.beautyCenters)})),
        setServices: (updater: (prev: AppState['beautyServices']) => AppState['beautyServices']) => store.set(state => ({...state, beautyServices: updater(state.beautyServices)})),
        setAppointments: (updater: (prev: AppState['beautyAppointments']) => AppState['beautyAppointments']) => store.set(state => ({...state, beautyAppointments: updater(state.beautyAppointments)})),
        isClient,
    };
};

// RAAHA Worker Data
export const useWorkersData = () => {
    const store = useStore();
    const isClient = useSyncExternalStore(store.subscribe, () => true, () => false);
    return {
        workers: useStoreData((s) => s.raahaWorkers),
        setWorkers: (updater: (prev: RaahaWorker[]) => RaahaWorker[]) => store.set(state => ({ ...state, raahaWorkers: updater(state.raahaWorkers) })),
        isClient,
    };
};

// RAAHA Agency Data
export const useAgenciesData = () => {
    const store = useStore();
    const isClient = useSyncExternalStore(store.subscribe, () => true, () => false);
    return {
        agencies: useStoreData((s) => s.raahaAgencies),
        setAgencies: (updater: (prev: RaahaAgency[]) => RaahaAgency[]) => store.set(state => ({ ...state, raahaAgencies: updater(state.raahaAgencies) })),
        isClient,
    };
};

// RAAHA Request Data
export const useRequestsData = () => {
    const store = useStore();
    const isClient = useSyncExternalStore(store.subscribe, () => true, () => false);
    return {
        requests: useStoreData((s) => s.raahaRequests),
        setRaahaRequests: (updater: (prev: HireRequest[]) => HireRequest[]) => store.set(state => ({ ...state, raahaRequests: updater(state.raahaRequests) })),
        isClient,
    };
};

// Assets
export const useAssetsData = () => {
    const store = useStore();
    const isClient = useSyncExternalStore(store.subscribe, () => true, () => false);
    return {
        assets: useStoreData((s) => s.assets),
        setAssets: (updater: (prev: Asset[]) => Asset[]) => store.set(state => ({ ...state, assets: updater(state.assets) })),
        isClient,
    };
};

// Used Items
export const useUsedItemsData = () => {
    const store = useStore();
    const isClient = useSyncExternalStore(store.subscribe, () => true, () => false);
    return {
        items: useStoreData((s) => s.usedItems),
        setItems: (updater: (prev: UsedItem[]) => UsedItem[]) => store.set((state) => ({ ...state, usedItems: updater(state.usedItems) })),
        isClient,
    };
};
