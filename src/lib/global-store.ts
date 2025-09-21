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
import type { HireRequest } from './raaha-requests.schema';
import type { BeautyCenter } from './beauty-centers.schema';
import type { BeautySpecialist } from './beauty-specialists.schema';
import type { BeautyService } from './beauty-services.schema';
import type { BeautyAppointment } from './beauty-appointments';
import type { CostRate } from './cost-settings.schema';
import type { Asset } from './assets.schema';
import type { UsedItem } from './used-items.schema';
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
import type { DailySales, PosProduct, CartItem as PosCartItem } from './pos-data.schema';
import type { SaasCategory } from './saas-products.schema';
import type { StockItem } from './stock-items.schema';
import type { Pricing } from './pricing.schema';
import type { BriefcaseData } from './briefcase';
import type { ProjectStage } from './stages';
import type { Investor } from './investors.schema';
import type { KnowledgeDocument } from './knowledge.schema';
import type { Property } from './properties.schema';
import type { Solution, Industry, AiTool } from './nav-links';
import { initialSettings } from './settings';
import { initialProducts, initialStoreProducts } from './products';


// This defines the full shape of our application's state.
export interface AppState {
  settings: AppSettings;
  cart: CartItem[];
  products: Product[];
  storeProducts: Product[];
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
  beautySpecialists: BeautySpecialist[];
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
  stages: ProjectStage[];
  applications: any[]; // Replace with actual type if defined
  briefcase: BriefcaseData;
  investors: Investor[];
  knowledgeBase: KnowledgeDocument[];
  cfoData: any; // Replace with actual type if defined
  properties: Property[];
  solutions: Solution[];
  industries: Industry[];
  aiTools: AiTool[];
};

export type CartItem = AppState['cart'][0];

// Define a minimal, safe initial state that doesn't depend on other files.
export const initialState: AppState = {
  settings: initialSettings,
  cart: [],
  products: initialProducts,
  storeProducts: initialStoreProducts,
  // Initialize other fields with empty arrays or default values as needed
  providers: [],
  opportunities: [],
  services: [],
  signedLeases: [],
  stairspaceRequests: [],
  stairspaceListings: [],
  leadership: [],
  staff: [],
  agentCategories: [],
  raahaAgencies: [],
  raahaWorkers: [],
  raahaRequests: [],
  beautyCenters: [],
  beautyServices: [],
  beautySpecialists: [],
  beautyAppointments: [],
  costSettings: [],
  assets: [],
  usedItems: [],
  clients: [],
  testimonials: [],
  giftCards: [],
  students: [],
  communities: [],
  communityEvents: [],
  communityFinances: [],
  communityMembers: [],
  alumniJobs: [],
  rentalAgencies: [],
  cars: [],
  posProducts: [],
  dailySales: [],
  saasProducts: [],
  stockItems: [],
  pricing: [],
  stages: [],
  applications: [],
  briefcase: {
    recordNumber: 'GUEST',
    applicantName: 'Guest User',
    agreements: { ndaContent: '', serviceAgreementContent: '' },
    date: new Date().toISOString(),
    registrations: [],
    userDocuments: [],
    savedBoqs: [],
  },
  investors: [],
  knowledgeBase: [],
  cfoData: {},
  properties: [],
  solutions: [],
  industries: [],
  aiTools: [],
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
