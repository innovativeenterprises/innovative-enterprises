
'use client';
import { createContext, useContext, ReactNode, useRef } from 'react';
import { createStore, useStore } from 'zustand';
import type { CartItem } from '@/lib/pos-data.schema';
import type { BookingRequest } from '@/lib/stairspace-requests';
import type { HireRequest } from '@/lib/raaha-requests.schema';

interface AppState {
  cart: CartItem[];
  stairspaceRequests: BookingRequest[];
  raahaRequests: HireRequest[];
}

interface AppStore extends AppState {
  set: (fn: (state: AppState) => AppState) => void;
}

const defaultState: AppState = {
  cart: [],
  stairspaceRequests: [],
  raahaRequests: [],
};

const StoreContext = createContext<ReturnType<typeof createStore<AppStore>> | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const storeRef = useRef<ReturnType<typeof createStore<AppStore>>>();
  if (!storeRef.current) {
    storeRef.current = createStore<AppStore>((set) => ({
      ...defaultState,
      set,
    }));
  }
  return (
    <StoreContext.Provider value={storeRef.current}>
      {children}
    </StoreContext.Provider>
  );
}

const createDataHook = <K extends keyof AppState>(key: K) => {
  return () => {
    const store = useContext(StoreContext);
    if (!store) {
      throw new Error('useStore must be used within a StoreProvider');
    }
    const data = useStore(store, (state) => state[key]);
    const setData = (updater: (prev: AppState[K]) => AppState[K]) => {
      store.getState().set((state) => ({ ...state, [key]: updater(state[key]) }));
    };
    return { data: data as AppState[K], setData };
  };
};

export const useCartData = createDataHook('cart');
export const useStairspaceRequestsData = createDataHook('stairspaceRequests');
export const useRequestsData = createDataHook('raahaRequests');

export const useSetStore = () => {
    const store = useContext(StoreContext);
     if (!store) {
        throw new Error('useSetStore must be used within a StoreProvider');
    }
    return store.getState().set;
}

// These hooks are now simple placeholders and can be removed or adapted
// if client-side fetching for this data is needed elsewhere.
export const useProductsData = () => ({ data: [], isClient: false });
export const useStoreProductsData = () => ({ data: [], isClient: false });
export const useProvidersData = () => ({ data: [], isClient: false });
export const useOpportunitiesData = () => ({ data: [], isClient: false });
export const useServicesData = () => ({ data: [], isClient: false });
export const useCfoData = () => ({ data: null, isClient: false });
export const useAssetsData = () => ({ data: [], isClient: false });
export const usePropertiesData = () => ({ data: [], isClient: false });
export const useStairspaceListingsData = () => ({ data: [], isClient: false });
export const useLeasesData = () => ({ data: [], isClient: false });
export const useStockItemsData = () => ({ data: [], isClient: false });
export const useGiftCardsData = () => ({ data: [], isClient: false });
export const useStudentsData = () => ({ data: [], isClient: false });
export const useCommunitiesData = () => ({ data: [], isClient: false });
export const useCommunityEventsData = () => ({ data: [], isClient: false });
export const useCommunityFinancesData = () => ({ data: [], isClient: false });
export const useMembersData = () => ({ data: [], isClient: false });
export const useAlumniJobsData = () => ({ data: [], isClient: false });
export const useCarsData = () => ({ data: [], isClient: false });
export const useRentalAgenciesData = () => ({ data: [], isClient: false });
export const usePosProductsData = () => ({ data: [], isClient: false });
export const useBriefcaseData = () => ({ data: null, isClient: false, setData: () => {} });
export const useKnowledgeBaseData = () => ({ data: [], isClient: false, setData: () => {} });
export const useClientsData = () => ({ data: [], isClient: false });
export const useTestimonialsData = () => ({ data: [], isClient: false });
export const useStagesData = () => ({ data: [], isClient: false });
export const useAgenciesData = () => ({ data: [], isClient: false });
export const useWorkersData = () => ({ data: [], isClient: false });
export const useBeautyCentersData = () => ({ data: [], isClient: false });
export const useBeautySpecialistsData = () => ({ data: [], isClient: false, setData: () => {} });
export const useBeautyServicesData = () => ({ data: [], isClient: false });
export const useBeautyAppointmentsData = () => ({ data: [], isClient: false });
export const useUsedItemsData = () => ({ data: [], isClient: false });
export const useSettingsData = () => ({ data: null, isClient: false, setData: () => {} });
export const useCostSettingsData = () => ({ data: [], isClient: false });
export const usePricingData = () => ({ data: [], isClient: false });
export const useApplicationsData = () => ({ data: [], isClient: false });
export const useAiToolsData = () => ({ data: [], isClient: false });
export const useSolutionsData = () => ({ data: [], isClient: false });
export const useIndustriesData = () => ({ data: [], isClient: false });
export const useDailySalesData = () => ({ data: [], isClient: false });
export const useUserDocumentsData = () => ({ data: [], isClient: false });
export const useSaaSProductsData = () => ({ data: [], isClient: false });
export const useStaffData = () => ({ leadership: [], staff: [], agentCategories: [], isClient: false });
