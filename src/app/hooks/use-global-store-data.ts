

'use client';

import { useContext, useSyncExternalStore } from 'react';
import type { AppSettings } from '@/lib/settings';
import type { CartItem } from '@/lib/global-store';
import { initialState, store, type AppState } from '@/lib/global-store';
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
import type { UsedItem } from '@/lib/used-items';
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

export type StoreType = typeof store;

// Settings
export const setSettings = (updater: (prev: AppSettings) => AppSettings) => store.set((state) => ({ ...state, settings: updater(state.settings) }));
export const useSettingsData = () => {
    const isClient = useSyncExternalStore(store.subscribe, () => true, () => false);
    return {
        settings: useStoreData((s) => s.settings),
        setSettings,
        isClient,
    };
};

// Cart
export const setCart = (updater: (prev: CartItem[]) => CartItem[]) => store.set((state) => ({ ...state, cart: updater(state.cart) }));
export const useCartData = () => {
    const isClient = useSyncExternalStore(store.subscribe, () => true, () => false);
    return {
        cart: useStoreData((s) => s.cart),
        setCart,
        isClient,
    };
};

// Signed Leases
export const setSignedLeases = (updater: (prev: SignedLease[]) => SignedLease[]) => store.set((state) => ({ ...state, signedLeases: updater(state.signedLeases) }));
export const useLeasesData = () => {
    const isClient = useSyncExternalStore(store.subscribe, () => true, () => false);
    return {
        leases: useStoreData((s) => s.signedLeases),
        setLeases: setSignedLeases,
        isClient,
    };
};


// StairSpace Requests
export const setStairspaceRequests = (updater: (prev: BookingRequest[]) => BookingRequest[]) => store.set((state) => ({ ...state, stairspaceRequests: updater(state.stairspaceRequests) }));
export const useStairspaceRequestsData = () => {
    const isClient = useSyncExternalStore(store.subscribe, () => true, () => false);
    return {
        stairspaceRequests: useStoreData((s) => s.stairspaceRequests),
        setStairspaceRequests,
        isClient,
    };
};


// Products
export const setProducts = (updater: (prev: Product[]) => Product[]) => store.set((state) => ({ ...state, products: updater(state.products) }));
export const useProductsData = () => {
    const isClient = useSyncExternalStore(store.subscribe, () => true, () => false);
    return {
        products: useStoreData((s) => s.products),
        setProducts,
        isClient,
    };
};

// Providers
export const setProviders = (updater: (prev: Provider[]) => Provider[]) => store.set((state) => ({ ...state, providers: updater(state.providers) }));
export const useProvidersData = () => {
    const isClient = useSyncExternalStore(store.subscribe, () => true, () => false);
    return {
        providers: useStoreData((s) => s.providers),
        setProviders,
        isClient,
    };
};

// Opportunities
export const setOpportunities = (updater: (prev: Opportunity[]) => Opportunity[]) => store.set((state) => ({ ...state, opportunities: updater(state.opportunities) }));
export const useOpportunitiesData = () => {
    const isClient = useSyncExternalStore(store.subscribe, () => true, () => false);
    return {
        opportunities: useStoreData((s) => s.opportunities),
        setOpportunities,
        isClient,
    };
};

// Services
export const setServices = (updater: (prev: Service[]) => Service[]) => store.set((state) => ({ ...state, services: updater(state.services) }));
export const useServicesData = () => {
    const isClient = useSyncExternalStore(store.subscribe, () => true, () => false);
    return {
        services: useStoreData((s) => s.services),
        setServices,
        isClient,
    };
};

// Staff (Leadership, Staff, Agents)
export const setLeadership = (updater: (prev: AppState['leadership']) => AppState['leadership']) => store.set(state => ({...state, leadership: updater(state.leadership)}));
export const setStaff = (updater: (prev: AppState['staff']) => AppState['staff']) => store.set(state => ({...state, staff: updater(state.staff)}));
export const setAgentCategories = (updater: (prev: AppState['agentCategories']) => AppState['agentCategories']) => store.set(state => ({...state, agentCategories: updater(state.agentCategories)}));
export const useStaffData = () => {
    const isClient = useSyncExternalStore(store.subscribe, () => true, () => false);
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
export const setRaahaAgencies = (updater: (prev: RaahaAgency[]) => RaahaAgency[]) => store.set(state => ({ ...state, raahaAgencies: updater(state.raahaAgencies) }));
export const setRaahaWorkers = (updater: (prev: RaahaWorker[]) => RaahaWorker[]) => store.set(state => ({ ...state, raahaWorkers: updater(state.raahaWorkers) }));
export const setRaahaRequests = (updater: (prev: HireRequest[]) => HireRequest[]) => store.set(state => ({ ...state, raahaRequests: updater(state.raahaRequests) }));

export const useRaahaData = () => {
    const isClient = useSyncExternalStore(store.subscribe, () => true, () => false);
    return {
        agencies: useStoreData(s => s.raahaAgencies),
        setAgencies: setRaahaAgencies,
        workers: useStoreData(s => s.raahaWorkers),
        setWorkers: setRaahaWorkers,
        requests: useStoreData(s => s.raahaRequests),
        setRequests: setRaahaRequests,
        isClient,
    };
};

// StairSpace Data
export const setStairspaceListings = (updater: (prev: StairspaceListing[]) => StairspaceListing[]) => store.set((state) => ({ ...state, stairspaceListings: updater(state.stairspaceListings) }));
export const useStairspaceData = () => {
    const isClient = useSyncExternalStore(store.subscribe, () => true, () => false);
    return {
        stairspaceListings: useStoreData((s) => s.stairspaceListings),
        setStairspaceListings,
        isClient,
    };
};

// Cost Settings
export const setCostSettings = (updater: (prev: CostRate[]) => CostRate[]) => store.set((state) => ({ ...state, costSettings: updater(state.costSettings) }));
export const useCostSettingsData = () => {
    const isClient = useSyncExternalStore(store.subscribe, () => true, () => false);
    return {
        costSettings: useStoreData((s) => s.costSettings),
        setCostSettings,
        isClient,
    };
};

// Beauty Hub Data
export const setBeautyCenters = (updater: (prev: AppState['beautyCenters']) => AppState['beautyCenters']) => store.set(state => ({...state, beautyCenters: updater(state.beautyCenters)}));
export const setBeautyServices = (updater: (prev: AppState['beautyServices']) => AppState['beautyServices']) => store.set(state => ({...state, beautyServices: updater(state.beautyServices)}));
export const setBeautyAppointments = (updater: (prev: AppState['beautyAppointments']) => AppState['beautyAppointments']) => store.set(state => ({...state, beautyAppointments: updater(state.beautyAppointments)}));
export const useBeautyData = () => {
    const isClient = useSyncExternalStore(store.subscribe, () => true, () => false);
    return {
        agencies: useStoreData(s => s.beautyCenters),
        services: useStoreData(s => s.beautyServices),
        appointments: useStoreData(s => s.beautyAppointments),
        setAgencies: setBeautyCenters,
        setServices: setBeautyServices,
        setAppointments: setBeautyAppointments,
        isClient,
    };
};

// RAAHA Worker Data
export const useWorkersData = () => {
    const isClient = useSyncExternalStore(store.subscribe, () => true, () => false);
    return {
        workers: useStoreData((s) => s.raahaWorkers),
        setWorkers: setRaahaWorkers,
        isClient,
    };
};

// RAAHA Agency Data
export const useAgenciesData = () => {
    const isClient = useSyncExternalStore(store.subscribe, () => true, () => false);
    return {
        agencies: useStoreData((s) => s.raahaAgencies),
        setAgencies: setRaahaAgencies,
        isClient,
    };
};

// RAAHA Request Data
export const useRequestsData = () => {
    const isClient = useSyncExternalStore(store.subscribe, () => true, () => false);
    return {
        requests: useStoreData((s) => s.raahaRequests),
        setRaahaRequests: setRaahaRequests,
        isClient,
    };
};

// Assets
export const useAssetsData = () => {
    const isClient = useSyncExternalStore(store.subscribe, () => true, () => false);
    return {
        assets: useStoreData((s) => s.assets),
        setAssets: (updater: (prev: Asset[]) => Asset[]) => store.set(state => ({ ...state, assets: updater(state.assets) })),
        isClient,
    };
};

// Used Items
export const setUsedItems = (updater: (prev: UsedItem[]) => UsedItem[]) => store.set((state) => ({ ...state, usedItems: updater(state.usedItems) }));
export const useUsedItemsData = () => {
    const isClient = useSyncExternalStore(store.subscribe, () => true, () => false);
    return {
        items: useStoreData((s) => s.usedItems),
        setItems: setUsedItems,
        isClient,
    };
};
