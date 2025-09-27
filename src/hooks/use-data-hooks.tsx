
'use client';

import { createContext, useContext, ReactNode, useRef } from 'react';
import { createStore, useStore as useZustandStore } from 'zustand';
import type { AppState } from '@/lib/initial-state';
import { getInitialState } from '@/lib/initial-state';

export type AppStore = AppState & {
  set: (updater: (state: AppState) => Partial<AppState>) => void;
};

export const createAppStore = (initState: Partial<AppState> = {}) => {
  const initialState = { ...getInitialState(), ...initState };
  return createStore<AppStore>((set) => ({
    ...initialState,
    set: (updater) => set(updater),
  }));
};

export type StoreType = ReturnType<typeof createAppStore>;

export const StoreContext = createContext<StoreType | null>(null);

export function StoreProvider({ children, initialState }: { children: ReactNode; initialState: any }) {
    const storeRef = useRef<StoreType>();
    
    if (!storeRef.current) {
        storeRef.current = createAppStore(initialState);
        storeRef.current.setState(state => ({...state, isClient: true}));
    }

    return (
        <StoreContext.Provider value={storeRef.current}>
            {children}
        </StoreContext.Provider>
    );
};

export function useGlobalStore<T>(selector: (state: AppState) => T): T {
  const store = useContext(StoreContext)
  if (!store) {
    throw new Error('useGlobalStore must be used within a StoreProvider')
  }
  return useZustandStore(store, selector)
}

export function useSetStore() {
    const store = useContext(StoreContext);
    if (!store) {
        throw new Error('useSetStore must be used within a StoreProvider');
    }
    return store.getState().set;
}

const createDataHook = <K extends keyof AppState>(key: K) => {
  return (initialData?: AppState[K]) => {
    const store = useContext(StoreContext);
    if (!store) {
      throw new Error(`useDataHook for ${String(key)} must be used within a StoreProvider`);
    }

    if (initialData && !store.getState()[key]?.length && !store.getState().isClient) {
        store.setState({ [key]: initialData } as any);
    }
    
    const data = useZustandStore(store, (state) => state[key]);
    const setData = (updater: (prev: AppState[K]) => AppState[K]) => {
      store.getState().set((state) => ({ ...state, [key]: updater(state[key]) }));
    };
    const isClient = useZustandStore(store, (state) => state.isClient);
    return { data: data as AppState[K], setData, isClient };
  };
};

export const useCartData = createDataHook('cart');
export const useStairspaceRequestsData = createDataHook('stairspaceRequests');
export const useRequestsData = createDataHook('raahaRequests');
export const useProductsData = createDataHook('products');
export const useStoreProductsData = createDataHook('storeProducts');
export const useProvidersData = createDataHook('providers');
export const useOpportunitiesData = createDataHook('opportunities');
export const useServicesData = createDataHook('services');
export const useCfoData = createDataHook('cfoData');
export const useAssetsData = createDataHook('assets');
export const usePropertiesData = createDataHook('properties');
export const useStairspaceListingsData = createDataHook('stairspaceListings');
export const useLeasesData = createDataHook('signedLeases');
export const useStockItemsData = createDataHook('stockItems');
export const useGiftCardsData = createDataHook('giftCards');
export const useStudentsData = createDataHook('students');
export const useCommunitiesData = createDataHook('communities');
export const useCommunityEventsData = createDataHook('communityEvents');
export const useCommunityFinancesData = createDataHook('communityFinances');
export const useMembersData = createDataHook('communityMembers');
export const useAlumniJobsData = createDataHook('alumniJobs');
export const useCarsData = createDataHook('cars');
export const useRentalAgenciesData = createDataHook('rentalAgencies');
export const usePosProductsData = createDataHook('posProducts');
export const useBriefcaseData = createDataHook('briefcase');
export const useKnowledgeBaseData = createDataHook('knowledgeBase');
export const useClientsData = createDataHook('clients');
export const useTestimonialsData = createDataHook('testimonials');
export const useStagesData = createDataHook('stages');
export const useAgenciesData = createDataHook('raahaAgencies');
export const useWorkersData = createDataHook('raahaWorkers');
export const useBeautyCentersData = createDataHook('beautyCenters');
export const useBeautySpecialistsData = createDataHook('beautySpecialists');
export const useBeautyServicesData = createDataHook('beautyServices');
export const useBeautyAppointmentsData = createDataHook('beautyAppointments');
export const useUsedItemsData = createDataHook('usedItems');
export const useSettingsData = createDataHook('settings');
export const useCostSettingsData = createDataHook('costSettings');
export const usePricingData = createDataHook('pricing');
export const useApplicationsData = createDataHook('applications');
export const useAiToolsData = createDataHook('aiTools');
export const useSolutionsData = createDataHook('solutions');
export const useIndustriesData = createDataHook('industries');
export const useDailySalesData = createDataHook('dailySales');
export const useUserDocumentsData = createDataHook('userDocuments');
export const useSaaSProductsData = createDataHook('saasProducts');

export const useStaffData = () => {
    const store = useContext(StoreContext);
    if (!store) {
      throw new Error('useStaffData must be used within a StoreProvider');
    }
    const leadership = useZustandStore(store, (state) => state.leadership);
    const staff = useZustandStore(store, (state) => state.staff);
    const agentCategories = useZustandStore(store, (state) => state.agentCategories);
    const isClient = useZustandStore(store, (state) => state.isClient);
    return { leadership, staff, agentCategories, isClient };
};
