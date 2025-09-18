

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

// Settings
export const useSettingsData = () => {
    const store = useContext(StoreContext)!;
    const isClient = useSyncExternalStore(store.subscribe, () => true, () => false);
    const settings = useStoreData((s) => s.settings);
    const setSettings = (updater: (prev: AppSettings) => AppSettings) => store.set((state) => ({ ...state, settings: updater(state.settings) }));
    return { settings, setSettings, isClient };
};

// Cart
export const useCartData = () => {
    const store = useContext(StoreContext)!;
    const isClient = useSyncExternalStore(store.subscribe, () => true, () => false);
    const cart = useStoreData((s) => s.cart);
    const setCart = (updater: (prev: CartItem[]) => CartItem[]) => store.set((state) => ({ ...state, cart: updater(state.cart) }));
    return { cart, setCart, isClient };
};

// Signed Leases
export const useLeasesData = () => {
    const store = useContext(StoreContext)!;
    const isClient = useSyncExternalStore(store.subscribe, () => true, () => false);
    const leases = useStoreData((s) => s.signedLeases);
    const setLeases = (updater: (prev: SignedLease[]) => SignedLease[]) => store.set((state) => ({ ...state, signedLeases: updater(state.signedLeases) }));
    return { leases, setLeases, isClient };
};

// StairSpace Requests
export const useStairspaceRequestsData = () => {
    const store = useContext(StoreContext)!;
    const isClient = useSyncExternalStore(store.subscribe, () => true, () => false);
    const stairspaceRequests = useStoreData((s) => s.stairspaceRequests);
    const setStairspaceRequests = (updater: (prev: BookingRequest[]) => BookingRequest[]) => store.set((state) => ({ ...state, stairspaceRequests: updater(state.stairspaceRequests) }));
    return { stairspaceRequests, setStairspaceRequests, isClient };
};

// Products
export const useProductsData = () => {
    const store = useContext(StoreContext)!;
    const isClient = useSyncExternalStore(store.subscribe, () => true, () => false);
    const products = useStoreData((s) => s.products);
    const setProducts = (updater: (prev: Product[]) => Product[]) => store.set((state) => ({ ...state, products: updater(state.products) }));
    return { products, setProducts, isClient };
};

// Providers
export const useProvidersData = () => {
    const store = useContext(StoreContext)!;
    const isClient = useSyncExternalStore(store.subscribe, () => true, () => false);
    const providers = useStoreData((s) => s.providers);
    const setProviders = (updater: (prev: Provider[]) => Provider[]) => store.set((state) => ({ ...state, providers: updater(state.providers) }));
    return { providers, setProviders, isClient };
};

// Opportunities
export const useOpportunitiesData = () => {
    const store = useContext(StoreContext)!;
    const isClient = useSyncExternalStore(store.subscribe, () => true, () => false);
    const opportunities = useStoreData((s) => s.opportunities);
    const setOpportunities = (updater: (prev: Opportunity[]) => Opportunity[]) => store.set((state) => ({ ...state, opportunities: updater(state.opportunities) }));
    return { opportunities, setOpportunities, isClient };
};

// Services
export const useServicesData = () => {
    const store = useContext(StoreContext)!;
    const isClient = useSyncExternalStore(store.subscribe, () => true, () => false);
    const services = useStoreData((s) => s.services);
    const setServices = (updater: (prev: Service[]) => Service[]) => store.set((state) => ({ ...state, services: updater(state.services) }));
    return { services, setServices, isClient };
};

// Staff (Leadership, Staff, Agents)
export const useStaffData = () => {
    const store = useContext(StoreContext)!;
    const isClient = useSyncExternalStore(store.subscribe, () => true, () => false);
    const leadership = useStoreData(s => s.leadership);
    const staff = useStoreData(s => s.staff);
    const agentCategories = useStoreData(s => s.agentCategories);
    const setLeadership = (updater: (prev: AppState['leadership']) => AppState['leadership']) => store.set(state => ({...state, leadership: updater(state.leadership)}));
    const setStaff = (updater: (prev: AppState['staff']) => AppState['staff']) => store.set(state => ({...state, staff: updater(state.staff)}));
    const setAgentCategories = (updater: (prev: AppState['agentCategories']) => AppState['agentCategories']) => store.set(state => ({...state, agentCategories: updater(state.agentCategories)}));
    return { leadership, setLeadership, staff, setStaff, agentCategories, setAgentCategories, isClient };
}

// RAAHA Data
export const useRaahaData = () => {
    const store = useContext(StoreContext)!;
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

// RAAHA Worker Data
export const useWorkersData = () => {
    const store = useContext(StoreContext)!;
    const isClient = useSyncExternalStore(store.subscribe, () => true, () => false);
    const workers = useStoreData((s) => s.raahaWorkers);
    const setWorkers = (updater: (prev: RaahaWorker[]) => RaahaWorker[]) => store.set(state => ({ ...state, raahaWorkers: updater(state.raahaWorkers) }));
    return { workers, setWorkers, isClient };
};

// RAAHA Agency Data
export const useAgenciesData = () => {
    const store = useContext(StoreContext)!;
    const isClient = useSyncExternalStore(store.subscribe, () => true, () => false);
    const agencies = useStoreData((s) => s.raahaAgencies);
    const setAgencies = (updater: (prev: RaahaAgency[]) => RaahaAgency[]) => store.set(state => ({ ...state, raahaAgencies: updater(state.raahaAgencies) }));
    return { agencies, setAgencies, isClient };
};

// RAAHA Request Data
export const useRequestsData = () => {
    const store = useContext(StoreContext)!;
    const isClient = useSyncExternalStore(store.subscribe, () => true, () => false);
    const requests = useStoreData((s) => s.raahaRequests);
    const setRaahaRequests = (updater: (prev: HireRequest[]) => HireRequest[]) => store.set(state => ({ ...state, raahaRequests: updater(state.raahaRequests) }));
    return { requests, setRaahaRequests, isClient };
};


// StairSpace Data
export const useStairspaceData = () => {
    const store = useContext(StoreContext)!;
    const isClient = useSyncExternalStore(store.subscribe, () => true, () => false);
    const stairspaceListings = useStoreData((s) => s.stairspaceListings);
    const setStairspaceListings = (updater: (prev: StairspaceListing[]) => StairspaceListing[]) => store.set((state) => ({ ...state, stairspaceListings: updater(state.stairspaceListings) }));
    return { stairspaceListings, setStairspaceListings, isClient };
};

// Cost Settings
export const useCostSettingsData = () => {
    const store = useContext(StoreContext)!;
    const isClient = useSyncExternalStore(store.subscribe, () => true, () => false);
    const costSettings = useStoreData((s) => s.costSettings);
    const setCostSettings = (updater: (prev: CostRate[]) => CostRate[]) => store.set((state) => ({ ...state, costSettings: updater(state.costSettings) }));
    return { costSettings, setCostSettings, isClient };
};

// Beauty Hub Data
export const useBeautyData = () => {
    const store = useContext(StoreContext)!;
    const isClient = useSyncExternalStore(store.subscribe, () => true, () => false);
    const agencies = useStoreData(s => s.beautyCenters);
    const services = useStoreData(s => s.beautyServices);
    const appointments = useStoreData(s => s.beautyAppointments);
    const setAgencies = (updater: (prev: AppState['beautyCenters']) => AppState['beautyCenters']) => store.set(state => ({...state, beautyCenters: updater(state.beautyCenters)}));
    const setServices = (updater: (prev: AppState['beautyServices']) => AppState['beautyServices']) => store.set(state => ({...state, beautyServices: updater(state.beautyServices)}));
    const setAppointments = (updater: (prev: AppState['beautyAppointments']) => AppState['beautyAppointments']) => store.set(state => ({...state, beautyAppointments: updater(state.beautyAppointments)}));
    return { agencies, services, appointments, setAgencies, setServices, setAppointments, isClient };
};


// Assets
export const useAssetsData = () => {
    const store = useContext(StoreContext)!;
    const isClient = useSyncExternalStore(store.subscribe, () => true, () => false);
    const assets = useStoreData((s) => s.assets);
    const setAssets = (updater: (prev: Asset[]) => Asset[]) => store.set(state => ({ ...state, assets: updater(state.assets) }));
    return { assets, setAssets, isClient };
};

// Used Items
export const useUsedItemsData = () => {
    const store = useContext(StoreContext)!;
    const isClient = useSyncExternalStore(store.subscribe, () => true, () => false);
    const items = useStoreData((s) => s.usedItems);
    const setItems = (updater: (prev: UsedItem[]) => UsedItem[]) => store.set((state) => ({ ...state, usedItems: updater(state.usedItems) }));
    return { items, setItems, isClient };
};
