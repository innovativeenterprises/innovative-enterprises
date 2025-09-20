
'use client';

import { useContext, useSyncExternalStore } from 'react';
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
import type { SaasCategory } from '@/lib/saas-products.schema';
import type { RentalAgency } from '@/lib/rental-agencies';


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

// Specific hooks using the central useStore function
export const useSettingsData = () => {
    const [settings, setStore, isClient] = useStore((s) => s.settings);
    const setSettings = (updater: (prev: AppState['settings']) => AppState['settings']) => setStore(state => ({...state, settings: updater(state.settings)}));
    return { settings, setSettings, isClient };
};

export const useCartData = () => {
    const [cart, setStore, isClient] = useStore((s) => s.cart);
    const setCart = (updater: (prev: AppState['cart']) => AppState['cart']) => setStore(state => ({...state, cart: updater(state.cart)}));
    return { cart, setCart, isClient };
};

export const usePosProductsData = () => {
    const [posProducts, setStore, isClient] = useStore((s) => s.posProducts);
    const setPosProducts = (updater: (prev: AppState['posProducts']) => AppState['posProducts']) => setStore(state => ({...state, posProducts: updater(state.posProducts)}));
    return { posProducts, setPosProducts, isClient };
};

export const usePosData = () => {
    const [dailySales, setStore, isClient] = useStore((s) => s.dailySales);
    const setDailySales = (updater: (prev: AppState['dailySales']) => AppState['dailySales']) => setStore(state => ({ ...state, dailySales: updater(state.dailySales) }));
    return { dailySales, setDailySales, isClient };
};

export const useLeasesData = () => {
    const [leases, setStore, isClient] = useStore((s) => s.signedLeases);
    const setLeases = (updater: (prev: AppState['signedLeases']) => AppState['signedLeases']) => setStore(state => ({...state, signedLeases: updater(state.signedLeases)}));
    return { leases, setLeases, isClient };
};

export const useStairspaceRequestsData = () => {
    const [stairspaceRequests, setStore, isClient] = useStore((s) => s.stairspaceRequests);
    const setStairspaceRequests = (updater: (prev: AppState['stairspaceRequests']) => AppState['stairspaceRequests']) => setStore(state => ({...state, stairspaceRequests: updater(state.stairspaceRequests)}));
    return { stairspaceRequests, setStairspaceRequests, isClient };
};

export const useProductsData = () => {
    const [products, setStore, isClient] = useStore((s) => s.products);
    const setProducts = (updater: (prev: AppState['products']) => AppState['products']) => setStore(state => ({...state, products: updater(state.products)}));
    return { products, setProducts, isClient };
};

export const useProvidersData = () => {
    const [providers, setStore, isClient] = useStore((s) => s.providers);
    const setProviders = (updater: (prev: AppState['providers']) => AppState['providers']) => setStore(state => ({...state, providers: updater(state.providers)}));
    return { providers, setProviders, isClient };
};

export const useOpportunitiesData = () => {
    const [opportunities, setStore, isClient] = useStore((s) => s.opportunities);
    const setOpportunities = (updater: (prev: AppState['opportunities']) => AppState['opportunities']) => setStore(state => ({...state, opportunities: updater(state.opportunities)}));
    return { opportunities, setOpportunities, isClient };
};

export const useServicesData = () => {
    const [services, setStore, isClient] = useStore((s) => s.services);
    const setServices = (updater: (prev: AppState['services']) => AppState['services']) => setStore(state => ({...state, services: updater(state.services)}));
    return { services, setServices, isClient };
};

export const useStaffData = () => {
    const [data, setStore, isClient] = useStore((s) => ({ leadership: s.leadership, staff: s.staff, agentCategories: s.agentCategories }));
    const setLeadership = (updater: (prev: AppState['leadership']) => AppState['leadership']) => setStore(state => ({...state, leadership: updater(state.leadership)}));
    const setStaff = (updater: (prev: AppState['staff']) => AppState['staff']) => setStore(state => ({...state, staff: updater(state.staff)}));
    const setAgentCategories = (updater: (prev: AppState['agentCategories']) => AppState['agentCategories']) => setStore(state => ({...state, agentCategories: updater(state.agentCategories)}));
    return { ...data, setLeadership, setStaff, setAgentCategories, isClient };
};

export const useRaahaData = () => {
    const [data, setStore, isClient] = useStore(s => ({ agencies: s.raahaAgencies, workers: s.raahaWorkers, requests: s.raahaRequests }));
    const setAgencies = (updater: (prev: AppState['raahaAgencies']) => AppState['raahaAgencies']) => setStore(state => ({ ...state, raahaAgencies: updater(state.raahaAgencies) }));
    const setWorkers = (updater: (prev: AppState['raahaWorkers']) => AppState['raahaWorkers']) => setStore(state => ({ ...state, raahaWorkers: updater(state.raahaWorkers) }));
    const setRequests = (updater: (prev: AppState['raahaRequests']) => AppState['raahaRequests']) => setStore(state => ({ ...state, raahaRequests: updater(state.raahaRequests) }));
    return { ...data, setAgencies, setWorkers, setRequests, isClient };
};

export const useWorkersData = () => {
    const [workers, setStore, isClient] = useStore((s) => s.raahaWorkers);
    const setWorkers = (updater: (prev: AppState['raahaWorkers']) => AppState['raahaWorkers']) => setStore(state => ({ ...state, raahaWorkers: updater(state.raahaWorkers) }));
    return { workers, setWorkers, isClient };
};

export const useAgenciesData = () => {
    const [agencies, setStore, isClient] = useStore((s) => s.raahaAgencies);
    const setAgencies = (updater: (prev: AppState['raahaAgencies']) => AppState['raahaAgencies']) => setStore(state => ({ ...state, raahaAgencies: updater(state.raahaAgencies) }));
    return { agencies, setAgencies, isClient };
};

export const useRequestsData = () => {
    const [requests, setStore, isClient] = useStore((s) => s.raahaRequests);
    const setRaahaRequests = (updater: (prev: AppState['raahaRequests']) => AppState['raahaRequests']) => setStore(state => ({ ...state, raahaRequests: updater(state.raahaRequests) }));
    return { requests, setRaahaRequests, isClient };
};

export const useStairspaceData = () => {
    const [stairspaceListings, setStore, isClient] = useStore((s) => s.stairspaceListings);
    const setStairspaceListings = (updater: (prev: AppState['stairspaceListings']) => AppState['stairspaceListings']) => setStore((state) => ({ ...state, stairspaceListings: updater(state.stairspaceListings) }));
    return { stairspaceListings, setStairspaceListings, isClient };
};

export const useCostSettingsData = () => {
    const [costSettings, setStore, isClient] = useStore((s) => s.costSettings);
    const setCostSettings = (updater: (prev: AppState['costSettings']) => AppState['costSettings']) => setStore((state) => ({ ...state, costSettings: updater(state.costSettings) }));
    return { costSettings, setCostSettings, isClient };
};

export const useBeautyData = () => {
    const [data, setStore, isClient] = useStore(s => ({ agencies: s.beautyCenters, services: s.beautyServices, appointments: s.beautyAppointments }));
    const setAgencies = (updater: (prev: AppState['beautyCenters']) => AppState['beautyCenters']) => setStore(state => ({...state, beautyCenters: updater(state.beautyCenters)}));
    const setServices = (updater: (prev: AppState['beautyServices']) => AppState['beautyServices']) => setStore(state => ({...state, beautyServices: updater(state.beautyServices)}));
    const setAppointments = (updater: (prev: AppState['beautyAppointments']) => AppState['beautyAppointments']) => setStore(state => ({...state, beautyAppointments: updater(state.beautyAppointments)}));
    return { ...data, setAgencies, setServices, setAppointments, isClient };
};

export const useAssetsData = () => {
    const [assets, setStore, isClient] = useStore((s) => s.assets);
    const setAssets = (updater: (prev: AppState['assets']) => AppState['assets']) => setStore(state => ({ ...state, assets: updater(state.assets) }));
    return { assets, setAssets, isClient };
};

export const useUsedItemsData = () => {
    const [items, setStore, isClient] = useStore((s) => s.usedItems);
    const setItems = (updater: (prev: AppState['usedItems']) => AppState['usedItems']) => setStore((state) => ({ ...state, usedItems: updater(state.usedItems) }));
    return { items, setItems, isClient };
};

export const useClientsData = () => {
    const [clients, setStore, isClient] = useStore((s) => s.clients);
    const setClients = (updater: (prev: AppState['clients']) => AppState['clients']) => setStore((state) => ({ ...state, clients: updater(state.clients) }));
    return { clients, setClients, isClient };
}

export const useTestimonialsData = () => {
    const [testimonials, setStore, isClient] = useStore((s) => s.testimonials);
    const setTestimonials = (updater: (prev: AppState['testimonials']) => AppState['testimonials']) => setStore((state) => ({ ...state, testimonials: updater(state.testimonials) }));
    return { testimonials, setTestimonials, isClient };
}

export const useCarsData = () => {
    const [cars, setStore, isClient] = useStore((s) => s.cars);
    const setCars = (updater: (prev: AppState['cars']) => AppState['cars']) => setStore((state) => ({ ...state, cars: updater(state.cars) }));
    return { cars, setCars, isClient };
}

export const useRentalAgenciesData = () => {
    const [rentalAgencies, setStore, isClient] = useStore((s) => s.rentalAgencies);
    const setRentalAgencies = (updater: (prev: AppState['rentalAgencies']) => AppState['rentalAgencies']) => setStore((state) => ({ ...state, rentalAgencies: updater(state.rentalAgencies) }));
    return { rentalAgencies, setRentalAgencies, isClient };
}

export const useGiftCardsData = () => {
    const [giftCards, setStore, isClient] = useStore((s) => s.giftCards);
    const setGiftCards = (updater: (prev: AppState['giftCards']) => AppState['giftCards']) => setStore((state) => ({ ...state, giftCards: updater(state.giftCards) }));
    return { giftCards, setGiftCards, isClient };
}

export const useStudentsData = () => {
    const [students, setStore, isClient] = useStore((s) => s.students);
    const setStudents = (updater: (prev: AppState['students']) => AppState['students']) => setStore((state) => ({ ...state, students: updater(state.students) }));
    return { students, setStudents, isClient };
}

export const useMembersData = () => {
    const [members, setStore, isClient] = useStore((s) => s.communityMembers);
    const setMembers = (updater: (prev: AppState['communityMembers']) => AppState['communityMembers']) => setStore((state) => ({ ...state, communityMembers: updater(state.communityMembers) }));
    return { members, setMembers, isClient };
}

export const useEventsData = () => {
    const [events, setStore, isClient] = useStore((s) => s.communityEvents);
    const setEvents = (updater: (prev: AppState['communityEvents']) => AppState['communityEvents']) => setStore((state) => ({ ...state, communityEvents: updater(state.communityEvents) }));
    return { events, setEvents, isClient };
}

export const useCommunityFinancesData = () => {
    const [finances, setStore, isClient] = useStore((s) => s.communityFinances);
    const setFinances = (updater: (prev: AppState['communityFinances']) => AppState['communityFinances']) => setStore((state) => ({ ...state, communityFinances: updater(state.communityFinances) }));
    return { finances, setFinances, isClient };
};

export const useAlumniJobsData = () => {
    const [jobs, setStore, isClient] = useStore((s) => s.alumniJobs);
    const setAlumniJobs = (updater: (prev: AppState['alumniJobs']) => AppState['alumniJobs']) => setStore((state) => ({ ...state, alumniJobs: updater(state.alumniJobs) }));
    return { jobs, setAlumniJobs, isClient };
};

export const useBriefcaseData = () => {
    const [briefcase, setStore, isClient] = useStore((s) => s.briefcase);
    const setBriefcase = (updater: (prev: AppState['briefcase']) => AppState['briefcase']) => setStore((state) => ({ ...state, briefcase: updater(state.briefcase) }));
    return { briefcase, setBriefcase, isClient };
};

export const usePricingData = () => {
    const [pricing, setStore, isClient] = useStore((s) => s.pricing);
    const setPricing = (updater: (prev: AppState['pricing']) => AppState['pricing']) => setStore((state) => ({ ...state, pricing: updater(state.pricing) }));
    return { pricing, setPricing, isClient };
};

export const useSolutionsData = () => {
    const [solutions, setStore, isClient] = useStore((s) => s.solutions);
    const setSolutions = (updater: (prev: AppState['solutions']) => AppState['solutions']) => setStore((state) => ({ ...state, solutions: updater(state.solutions) }));
    return { solutions, setSolutions, isClient };
}

export const useIndustriesData = () => {
    const [industries, setStore, isClient] = useStore((s) => s.industries);
    const setIndustries = (updater: (prev: AppState['industries']) => AppState['industries']) => setStore((state) => ({ ...state, industries: updater(state.industries) }));
    return { industries, setIndustries, isClient };
}

export const useAiToolsData = () => {
    const [aiTools, setStore, isClient] = useStore((s) => s.aiTools);
    const setAiTools = (updater: (prev: AppState['aiTools']) => AppState['aiTools']) => setStore((state) => ({ ...state, aiTools: updater(state.aiTools) }));
    return { aiTools, setAiTools, isClient };
}

export const useInvestorsData = () => {
    const [investors, setStore, isClient] = useStore((s) => s.investors);
    const setInvestors = (updater: (prev: AppState['investors']) => AppState['investors']) => setStore((state) => ({ ...state, investors: updater(state.investors) }));
    return { investors, setInvestors, isClient };
}

export const usePropertiesData = () => {
    const [properties, setStore, isClient] = useStore((s) => s.properties);
    const setProperties = (updater: (prev: AppState['properties']) => AppState['properties']) => setStore(state => ({ ...state, properties: updater(state.properties) }));
    return { properties, setProperties, isClient };
};

export const useStockItemsData = () => {
    const [stockItems, setStore, isClient] = useStore((s) => s.stockItems);
    const setStockItems = (updater: (prev: AppState['stockItems']) => AppState['stockItems']) => setStore(state => ({ ...state, stockItems: updater(state.stockItems) }));
    return { stockItems, setStockItems, isClient };
};

export const useKnowledgeData = () => {
    const [knowledgeBase, setStore, isClient] = useStore((s) => s.knowledgeBase);
    const setKnowledgeBase = (updater: (prev: AppState['knowledgeBase']) => AppState['knowledgeBase']) => setStore(state => ({ ...state, knowledgeBase: updater(state.knowledgeBase) }));
    return { knowledgeBase, setKnowledgeBase, isClient };
};

export const useCfoData = () => {
    const [cfoData, setStore, isClient] = useStore((s) => s.cfoData);
    const setCfoData = (updater: (prev: AppState['cfoData']) => AppState['cfoData']) => setStore(state => ({ ...state, cfoData: updater(state.cfoData) }));
    return { cfoData, setCfoData, isClient };
};

export const useSaaSProductsData = () => {
    const [saasProducts, setStore, isClient] = useStore((s) => s.saasProducts);
    const setSaaSProducts = (updater: (prev: AppState['saasProducts']) => AppState['saasProducts']) => setStore(state => ({ ...state, saasProducts: updater(state.saasProducts) }));
    return { saasProducts, setSaaSProducts, isClient };
};

export const useApplicationsData = () => {
    const [applications, setStore, isClient] = useStore((s) => s.applications);
    const setApplications = (updater: (prev: AppState['applications']) => AppState['applications']) => setStore((state) => ({ ...state, applications: updater(state.applications) }));
    return { applications, setApplications, isClient };
};
