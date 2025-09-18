
/**
 * @fileOverview A simple global state management store for the prototype.
 *
 * This avoids the need for a full state management library like Redux or Zustand
 * for this prototype application. It uses a simple listener pattern to update
 * components when the state changes.
 *
 * This file is NOT part of the user's visible code but is a necessary
 * architectural piece to make the prototype function correctly across pages.
 */

import type { AppSettings } from './settings';
import type { Product } from './products.schema';
import type { Provider } from './providers.schema';
import type { Service } from './services.schema';
import type { Opportunity } from './opportunities.schema';
import type { SignedLease } from './leases';
import type { BookingRequest } from './stairspace-requests';
import type { StairspaceListing } from './stairspace.schema';
import type { Agent, AgentCategory } from './agents.schema';
import type { Agency as RaahaAgency } from './raaha-agencies';
import type { Worker as RaahaWorker } from './raaha-workers';
import type { HireRequest } from './raaha-requests';
import type { BeautyCenter } from './beauty-centers';
import type { BeautyService } from './beauty-services';
import type { BeautyAppointment } from './beauty-appointments';
import type { CostRate } from './cost-settings.schema';
import type { Asset } from './assets.schema';
import type { UsedItem } from './used-items.schema';
import { initialSettings } from './settings';
import type { Client, Testimonial } from './clients.schema';
import type { GiftCard } from './gift-cards.schema';
import type { Student } from './students.schema';
import type { Community } from './communities';
import type { CommunityEvent } from './community-events';
import type { CommunityFinance } from './community-finances';
import type { CommunityMember } from './community-members';
import type { JobPosting } from './alumni-jobs';
import type { RentalAgency } from './rental-agencies';
import type { Car } from './cars.schema';
import type { DailySales, PosProduct } from './pos-data.schema';
import type { SaasCategory } from './saas-products.schema';
import type { StockItem } from './stock-items.schema';
import type { Pricing } from './pricing.schema';
import { initialPricing } from './pricing';
import { initialProducts } from './products';
import { initialServices } from './services';
import { initialClients, initialTestimonials } from './clients';
import { initialPosProducts, initialDailySales } from './pos-data';
import { initialStages } from './stages';
import { getCostSettings, getProviders } from './firestore';
import { initialCostSettings } from './cost-settings';
import { initialProviders } from './providers';
import { initialStaffData } from './agents';
import { initialRaahaAgencies } from './raaha-agencies';
import { initialRaahaWorkers } from './raaha-workers';
import { initialRaahaRequests } from './raaha-requests';
import { initialLeases } from './leases';
import { initialOpportunities } from './opportunities';
import { initialStairspaceRequests } from './stairspace-requests';
import { initialStairspaceListings } from './stairspace-listings';
import { initialBeautyCenters } from './beauty-centers';
import { initialBeautyServices } from './beauty-services';
import { initialBeautyAppointments } from './beauty-appointments';
import { initialAssets } from './assets';
import { initialUsedItems } from './used-items';
import { initialGiftCards } from './gift-cards';
import { initialStudents } from './students';
import { initialCommunities } from './communities';
import { initialEvents } from './community-events';
import { initialFinances } from './community-finances';
import { initialMembers } from './community-members';
import { initialAlumniJobs } from './alumni-jobs';
import { initialRentalAgencies } from './rental-agencies';
import { initialCars } from './cars';
import { saasProducts } from './saas-products';
import { initialStockItems } from './stock-items';


export interface CartItem extends PosProduct {
  quantity: number;
}

export type AppState = {
  settings: AppSettings;
  cart: CartItem[];
  // All data previously held in the global store is now fetched by
  // individual server components. The hooks remain to allow client
  // components to optimistically update the UI, but the initial state is empty.
  products: Product[];
  providers: Provider[];
  opportunities: Opportunity[];
  services: Service[];
  signedLeases: SignedLease[];
  stairspaceRequests: BookingRequest[];
  stairspaceListings: StairspaceListing[];
  leadership: Agent[];
  staff: Agent[];
  agentCategories: AgentCategory[];
  raahaAgencies: RaahaAgency[];
  raahaWorkers: RaahaWorker[];
  raahaRequests: HireRequest[];
  beautyCenters: BeautyCenter[];
  beautyServices: BeautyService[];
  beautyAppointments: BeautyAppointment[];
  costSettings: CostRate[];
  assets: Asset[];
  usedItems: UsedItem[];
  clients: Client[];
  testimonials: Testimonial[];
  giftCards: GiftCard[];
  students: Student[];
  communities: Community[];
  communityEvents: CommunityEvent[];
  communityFinances: CommunityFinance[];
  communityMembers: CommunityMember[];
  alumniJobs: JobPosting[];
  rentalAgencies: RentalAgency[];
  cars: Car[];
  posProducts: PosProduct[];
  dailySales: DailySales;
  saasProducts: SaasCategory[];
  stockItems: StockItem[];
  pricing: Pricing[];
};

export const initialState: AppState = {
  settings: initialSettings,
  cart: [],
  products: initialProducts,
  providers: initialProviders,
  opportunities: initialOpportunities,
  services: initialServices,
  signedLeases: initialLeases,
  stairspaceRequests: initialStairspaceRequests,
  stairspaceListings: initialStairspaceListings,
  leadership: initialStaffData.leadership,
  staff: initialStaffData.staff,
  agentCategories: initialStaffData.agentCategories,
  raahaAgencies: initialRaahaAgencies,
  raahaWorkers: initialRaahaWorkers,
  raahaRequests: initialRaahaRequests,
  beautyCenters: initialBeautyCenters,
  beautyServices: initialBeautyServices,
  beautyAppointments: initialBeautyAppointments,
  costSettings: initialCostSettings,
  assets: initialAssets,
  usedItems: initialUsedItems,
  clients: initialClients,
  testimonials: initialTestimonials,
  giftCards: initialGiftCards,
  students: initialStudents,
  communities: initialCommunities,
  communityEvents: initialEvents,
  communityFinances: initialFinances,
  communityMembers: initialMembers,
  alumniJobs: initialAlumniJobs,
  rentalAgencies: initialRentalAgencies,
  cars: initialCars,
  posProducts: initialPosProducts,
  dailySales: initialDailySales,
  saasProducts: saasProducts,
  stockItems: initialStockItems,
  pricing: initialPricing,
};


export const createAppStore = (initState: Partial<AppState> = {}) => {
    let state: AppState = { ...initialState, ...initState };
    const listeners = new Set<() => void>();

    return {
        get: (): AppState => state,
        set: (updater: (currentState: AppState) => AppState) => {
            state = updater(state);
            listeners.forEach((listener) => listener());
        },
        subscribe: (listener: () => void) => {
            listeners.add(listener);
            return () => listeners.delete(listener);
        },
    };
}

export type StoreType = ReturnType<typeof createAppStore>;

export const store = createAppStore(initialState);
