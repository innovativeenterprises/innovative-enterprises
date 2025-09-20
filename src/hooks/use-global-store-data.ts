

'use client';

import { useContext, useSyncExternalStore, useCallback } from 'react';
import type { AppSettings } from '@/lib/settings';
import type { CartItem, PosProduct, DailySales } from '@/lib/pos-data.schema';
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
import type { HireRequest } from '@/lib/raaha-requests.schema';
import type { StairspaceListing } from '@/lib/stairspace.schema';
import type { CostRate } from '@/lib/cost-settings.schema';
import type { BeautyCenter } from '@/lib/beauty-centers.schema';
import type { BeautySpecialist } from '@/lib/beauty-specialists.schema';
import type { BeautyService } from '@/lib/beauty-services.schema';
import type { BeautyAppointment } from '@/lib/beauty-appointments';
import type { UsedItem } from '@/lib/used-items.schema';
import type { Asset } from '@/lib/assets.schema';
import type { Client, Testimonial } from '@/lib/clients.schema';
import type { Car } from '@/lib/cars.schema';
import type { GiftCard } from '@/lib/gift-cards.schema';
import type { Student } from '@/lib/students.schema';
import type { Community } from '@/lib/communities';
import type { CommunityEvent } from '@/lib/community-events';
import type { CommunityFinance } from '@/lib/community-finances';
import type { CommunityMember } from '@/lib/community-members';
import type { JobPosting } from '@/lib/alumni-jobs';
import type { BriefcaseData } from '@/lib/briefcase';
import type { Pricing } from '@/lib/pricing.schema';
import type { Investor } from '@/lib/investors.schema';
import type { KnowledgeDocument } from '@/lib/knowledge.schema';
import type { StockItem } from '@/lib/stock-items.schema';
import type { Property } from '@/lib/properties.schema';
import type { RentalAgency } from '@/lib/rental-agencies';
import { useProductsData as useProductsDataInternal } from './use-products-data-internal';
import { useSaaSProductsData as useSaaSProductsDataInternal } from './use-saas-products-data-internal';


// Centralized function to access the store and its setters
function useStore<T>(selector: (state: AppState) => T): [T, (updater: (state: AppState) => AppState) => void, boolean] {
  const store = useContext(StoreContext);
  if (!store) {
    throw new Error('useStore must be used within a StoreProvider.');
  }

  const state = useSyncExternalStore(
    store.subscribe,
    () => selector(store.get()),
    () => selector(initialState)
  );

  const isClient = useSyncExternalStore(store.subscribe, () => true, () => false);

  return [state, store.set, isClient];
}

// Corrected Generic hook factory
function createStoreHook<K extends keyof AppState>(key: K) {
    type StateSlice = AppState[K];
    type SetState = (updater: (prev: StateSlice) => StateSlice) => void;
    
    // The hook name must start with "use"
    const useHook = () => {
        const [state, setStore, isClient] = useStore((s) => s[key]);
        const set = useCallback((updater: (prev: StateSlice) => StateSlice) => {
            setStore((prevState) => ({
                ...prevState,
                [key]: updater(prevState[key]),
            }));
        }, [setStore]);

        return { [key]: state, [`set${key.charAt(0).toUpperCase() + key.slice(1)}`]: set, isClient };
    };
    
    // Assign a display name for better debugging
    useHook.displayName = `use${key.charAt(0).toUpperCase() + key.slice(1)}Data`;

    return useHook;
}

// Specific hooks using the corrected factory
export const useSettingsData = createStoreHook('settings');
export const useCartData = createStoreHook('cart');
export const usePosProductsData = createStoreHook('posProducts');
export const usePosData = createStoreHook('dailySales');
export const useLeasesData = createStoreHook('signedLeases');
export const useStairspaceRequestsData = createStoreHook('stairspaceRequests');
export const useProductsData = useProductsDataInternal;
export const useProvidersData = createStoreHook('providers');
export const useOpportunitiesData = createStoreHook('opportunities');
export const useServicesData = createStoreHook('services');
export const useStaffData = () => {
    const [data, setStore, isClient] = useStore((s) => ({ leadership: s.leadership, staff: s.staff, agentCategories: s.agentCategories }));
    const setLeadership = useCallback((updater: (prev: AppState['leadership']) => AppState['leadership']) => setStore(state => ({...state, leadership: updater(state.leadership)})), [setStore]);
    const setStaff = useCallback((updater: (prev: AppState['staff']) => AppState['staff']) => setStore(state => ({...state, staff: updater(state.staff)})), [setStore]);
    const setAgentCategories = useCallback((updater: (prev: AppState['agentCategories']) => AppState['agentCategories']) => setStore(state => ({...state, agentCategories: updater(state.agentCategories)})), [setStore]);
    return { ...data, setLeadership, setStaff, setAgentCategories, isClient };
};
export const useRaahaData = () => {
    const [data, setStore, isClient] = useStore(s => ({ agencies: s.raahaAgencies, workers: s.raahaWorkers, requests: s.raahaRequests }));
    const setAgencies = useCallback((updater: (prev: AppState['raahaAgencies']) => AppState['raahaAgencies']) => setStore(state => ({ ...state, raahaAgencies: updater(state.raahaAgencies) })), [setStore]);
    const setWorkers = useCallback((updater: (prev: AppState['raahaWorkers']) => AppState['raahaWorkers']) => setStore(state => ({ ...state, raahaWorkers: updater(state.raahaWorkers) })), [setStore]);
    const setRequests = useCallback((updater: (prev: AppState['raahaRequests']) => AppState['raahaRequests']) => setStore(state => ({ ...state, raahaRequests: updater(state.raahaRequests) })), [setStore]);
    return { ...data, setAgencies, setWorkers, setRequests, isClient };
};
export const useWorkersData = createStoreHook('raahaWorkers');
export const useAgenciesData = createStoreHook('raahaAgencies');
export const useRequestsData = createStoreHook('raahaRequests');
export const useCostSettingsData = createStoreHook('costSettings');
export const useBeautyData = () => {
    const [data, setStore, isClient] = useStore(s => ({ agencies: s.beautyCenters, services: s.beautyServices, specialists: s.beautySpecialists, appointments: s.beautyAppointments }));
    const setAgencies = useCallback((updater: (prev: AppState['beautyCenters']) => AppState['beautyCenters']) => setStore(state => ({...state, beautyCenters: updater(state.beautyCenters)})), [setStore]);
    const setServices = useCallback((updater: (prev: AppState['beautyServices']) => AppState['beautyServices']) => setStore(state => ({...state, beautyServices: updater(state.beautyServices)})), [setStore]);
    const setSpecialists = useCallback((updater: (prev: AppState['beautySpecialists']) => AppState['beautySpecialists']) => setStore(state => ({...state, beautySpecialists: updater(state.beautySpecialists)})), [setStore]);
    const setAppointments = useCallback((updater: (prev: AppState['beautyAppointments']) => AppState['beautyAppointments']) => setStore(state => ({...state, beautyAppointments: updater(state.beautyAppointments)})), [setStore]);
    return { ...data, setAgencies, setServices, setSpecialists, setAppointments, isClient };
};
export const useBeautySpecialistsData = createStoreHook('beautySpecialists');
export const useAssetsData = createStoreHook('assets');
export const useUsedItemsData = createStoreHook('usedItems');
export const useClientsData = createStoreHook('clients');
export const useTestimonialsData = createStoreHook('testimonials');
export const useCarsData = createStoreHook('cars');
export const useRentalAgenciesData = createStoreHook('rentalAgencies');
export const useGiftCardsData = createStoreHook('giftCards');
export const useStudentsData = createStoreHook('students');
export const useMembersData = createStoreHook('communityMembers');
export const useEventsData = createStoreHook('communityEvents');
export const useCommunityFinancesData = createStoreHook('communityFinances');
export const useCommunitiesData = createStoreHook('communities');
export const useAlumniJobsData = createStoreHook('alumniJobs');
export const useBriefcaseData = createStoreHook('briefcase');
export const usePricingData = createStoreHook('pricing');
export const useSolutionsData = createStoreHook('solutions');
export const useIndustriesData = createStoreHook('industries');
export const useAiToolsData = createStoreHook('aiTools');
export const useInvestorsData = createStoreHook('investors');
export const usePropertiesData = createStoreHook('properties');
export const useStairspaceData = createStoreHook('stairspaceListings');
export const useStockItemsData = createStoreHook('stockItems');
export const useKnowledgeData = createStoreHook('knowledgeBase');
export const useCfoData = createStoreHook('cfoData');
export const useSaaSProductsData = useSaaSProductsDataInternal;
export const useApplicationsData = createStoreHook('applications');
export const useStagesData = createStoreHook('stages');

  