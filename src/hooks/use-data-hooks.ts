
'use client';

import { useState, useEffect, useContext } from 'react';
import { StoreContext } from '@/lib/global-store';
import type { BriefcaseData } from '@/lib/briefcase';
import type { CartItem, DailySales, PosProduct } from '@/lib/pos-data.schema';
import type { Product } from '@/lib/products.schema';
import type { Provider } from '@/lib/providers.schema';
import type { Opportunity } from '@/lib/opportunities.schema';
import type { Service } from '@/lib/services.schema';
import type { Agent, AgentCategory } from '@/lib/agents.schema';
import type { Pricing } from '@/lib/pricing.schema';
import type { AppSettings } from '@/lib/settings';
import type { SaasCategory } from '@/lib/saas-products.schema';
import type { GiftCard } from '@/lib/gift-cards.schema';
import type { Community } from '@/lib/communities';
import type { SignedLease } from '@/lib/leases';
import type { BookingRequest } from '@/lib/stairspace-requests';
import type { StairspaceListing } from '@/lib/stairspace.schema';
import type { HireRequest } from '@/lib/raaha-requests.schema';
import type { Agency as RaahaAgency } from '@/lib/raaha-agencies.schema';
import type { Worker as RaahaWorker } from '@/lib/raaha-workers';
import type { BeautyCenter } from '@/lib/beauty-centers.schema';
import type { BeautyService } from '@/lib/beauty-services.schema';
import type { BeautySpecialist } from '@/lib/beauty-specialists.schema';
import type { BeautyAppointment } from '@/lib/beauty-appointments';
import type { CostRate } from '@/lib/cost-settings.schema';
import type { Asset } from '@/lib/assets.schema';
import type { UsedItem } from '@/lib/used-items.schema';
import type { Client, Testimonial } from '@/lib/clients.schema';
import type { Student } from '@/lib/students.schema';
import type { CommunityEvent } from '@/lib/community-events';
import type { CommunityFinance } from '@/lib/community-finances';
import type { CommunityMember } from '@/lib/community-members';
import type { JobPosting } from '@/lib/alumni-jobs';
import type { RentalAgency } from '@/lib/rental-agencies';
import type { Car } from '@/lib/cars.schema';
import type { StockItem } from '@/lib/stock-items.schema';
import type { ProjectStage } from '@/lib/stages';
import type { Investor } from '@/lib/investors.schema';
import type { KnowledgeDocument } from '@/lib/knowledge.schema';
import type { CfoData } from '@/lib/cfo-data.schema';
import type { Property } from '@/lib/properties.schema';
import type { Solution, Industry, AiTool } from '@/lib/nav-links';
import type { Application } from '@/lib/admissions-applications';

const useStore = () => {
  const store = useContext(StoreContext);
  if (!store) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return store;
};

const createDataHook = <T>(sliceSelector: (state: any) => T) => () => {
    const store = useStore();
    const [data, setData] = useState<T>(sliceSelector(store.get()));
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
        const unsubscribe = store.subscribe(() => {
            setData(sliceSelector(store.get()));
        });
        return unsubscribe;
    }, [store, sliceSelector]);

    const setSliceData = (updater: (prev: T) => T) => {
        store.set((state) => {
            const currentSlice = sliceSelector(state);
            const newSlice = updater(currentSlice);
            
            // This is a simplified way to update the correct slice.
            // It relies on the selector pointing to a top-level key.
            // A more robust solution might use keys or lenses.
            const key = Object.keys(state).find(k => sliceSelector(state) === (state as any)[k]);
            if(key) {
                return { ...state, [key]: newSlice };
            }
            return state;
        });
    };

    return { data, setData: setSliceData, isClient };
};

export const useProductsData = createDataHook((state) => state.products);
export const useStoreProductsData = createDataHook((state) => state.storeProducts);
export const useSaaSProductsData = createDataHook((state) => state.saasProducts);
export const useProvidersData = createDataHook((state) => state.providers);
export const useOpportunitiesData = createDataHook((state) => state.opportunities);
export const useServicesData = createDataHook((state) => state.services);
export const useLeasesData = createDataHook((state) => state.signedLeases);
export const useStairspaceData = createDataHook((state) => state.stairspaceListings);
export const useStairspaceRequestsData = createDataHook((state) => state.stairspaceRequests);
export const useStaffData = createDataHook((state) => ({ leadership: state.leadership, staff: state.staff, agentCategories: state.agentCategories }));
export const useAgenciesData = createDataHook((state) => state.raahaAgencies);
export const useWorkersData = createDataHook((state) => state.raahaWorkers);
export const useRequestsData = createDataHook((state) => state.raahaRequests);
export const useBeautyData = createDataHook((state) => ({ agencies: state.beautyCenters, services: state.beautyServices, appointments: state.beautyAppointments, isClient: state.isClient, setAgencies: (updater: any) => {}, setServices: (updater: any) => {}, setAppointments: (updater: any) => {} }));
export const useBeautySpecialistsData = createDataHook((state) => state.beautySpecialists);
export const useAssetsData = createDataHook((state) => state.assets);
export const useUsedItemsData = createDataHook((state) => state.usedItems);
export const useGiftCardsData = createDataHook((state) => state.giftCards);
export const useStudentsData = createDataHook((state) => state.students);
export const useMembersData = createDataHook((state) => state.communityMembers);
export const useCommunitiesData = createDataHook((state) => state.communities);
export const useEventsData = createDataHook((state) => state.communityEvents);
export const useFinancesData = createDataHook((state) => state.communityFinances);
export const useAlumniJobsData = createDataHook((state) => state.alumniJobs);
export const usePosProductsData = createDataHook((state) => state.posProducts);
export const usePosData = createDataHook((state) => state.dailySales);
export const useStockItemsData = createDataHook((state) => state.stockItems);
export const usePropertiesData = createDataHook((state) => state.properties);
export const useBriefcaseData = createDataHook((state) => state.briefcase);
export const useNavLinksData = createDataHook((state) => ({ solutions: state.solutions, industries: state.industries, aiTools: state.aiTools }));
export const useSettingsData = createDataHook((state) => state.settings);
export const usePricingData = createDataHook((state) => state.pricing);
export const useCartData = createDataHook((state) => state.cart);
