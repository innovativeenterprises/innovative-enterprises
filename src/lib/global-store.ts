

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

import { initialServices, type Service } from './services';
import { initialProducts, type Product, initialStoreProducts } from './products';
import { initialClients, type Client, initialTestimonials, type Testimonial } from './clients';
import { initialStaffData, type Agent, type AgentCategory } from './agents';
import { initialOpportunities, type Opportunity } from './opportunities';
import { initialPricing, type Pricing } from './pricing';
import { initialStages, type ProjectStage } from './stages';
import { initialSettings, type AppSettings } from './settings';
import { initialProviders, type Provider } from './providers';
import { initialAssets, type Asset } from './assets';
import { initialInvestors, type Investor } from './investors';
import { initialKnowledgeBase, type KnowledgeDocument } from './knowledge';
import { initialWorkers, type Worker as RaahaWorker } from './raaha-workers';
import { initialRequests, type HireRequest } from './raaha-requests';
import { initialAgencies, type Agency } from './raaha-agencies';
import { initialLeases, type SignedLease } from './leases';
import { initialProperties, type Property } from './properties';
import { initialStairspaceListings } from './stairspace-listings';
import { initialStairspaceRequests, type BookingRequest as StairspaceRequest } from './stairspace-requests';
import type { StairspaceListing } from './stairspace.schema';
import { type BoQItem } from '@/ai/flows/boq-generator.schema';
import { initialCostSettings } from './cost-settings';
import type { CostRate } from './cost-settings.schema';
import { initialStudents, type Student } from './students';
import type { KpiData, TransactionData, UpcomingPayment, VatPayment, CashFlowData } from './cfo-data';
import { kpiData, transactionData, upcomingPayments, vatPayment, cashFlowData } from './cfo-data';
import { initialCommunities, type Community } from './communities';
import { initialEvents, type CommunityEvent } from './community-events';
import { initialFinances, type CommunityFinance } from './community-finances';
import { initialMembers, type CommunityMember } from './community-members';


export interface CartItem extends Product {
  quantity: number;
}

export interface SavedBoQ {
    id: string;
    name: string;
    date: string;
    items: BoQItem[];
}

export type AppState = {
  services: Service[];
  products: Product[];
  clients: Client[];
  testimonials: Testimonial[];
  leadership: Agent[];
  staff: Agent[];
  agentCategories: AgentCategory[];
  opportunities: Opportunity[];
  pricing: Pricing[];
  stages: ProjectStage[];
  settings: AppSettings;
  providers: Provider[];
  assets: Asset[];
  investors: Investor[];
  knowledgeBase: KnowledgeDocument[];
  raahaWorkers: RaahaWorker[];
  raahaRequests: HireRequest[];
  raahaAgencies: Agency[];
  signedLeases: SignedLease[];
  properties: Property[];
  stairspaceListings: StairspaceListing[];
  stairspaceRequests: StairspaceRequest[];
  students: Student[];
  communities: Community[];
  communityEvents: CommunityEvent[];
  communityFinances: CommunityFinance[];
  communityMembers: CommunityMember[];
  savedBoqs: SavedBoQ[];
  cart: CartItem[];
  costSettings: CostRate[];
  kpiData: KpiData[];
  transactionData: TransactionData[];
  upcomingPayments: UpcomingPayment[];
  vatPayment: VatPayment;
  cashFlowData: { month: string; income: number; expenses: number }[];
};

// The single source of truth for our application's shared state.
let state: AppState = {
  services: initialServices,
  products: initialProducts,
  clients: initialClients,
  testimonials: initialTestimonials,
  leadership: initialStaffData.leadership,
  staff: initialStaffData.staff,
  agentCategories: initialStaffData.agentCategories,
  opportunities: initialOpportunities,
  pricing: initialPricing,
  stages: initialStages,
  settings: initialSettings,
  providers: initialProviders,
  assets: initialAssets,
  investors: initialInvestors,
  knowledgeBase: initialKnowledgeBase,
  raahaWorkers: initialWorkers,
  raahaRequests: initialRequests,
  raahaAgencies: initialAgencies,
  signedLeases: initialLeases,
  properties: initialProperties,
  stairspaceListings: initialStairspaceListings,
  stairspaceRequests: initialStairspaceRequests,
  students: initialStudents,
  communities: initialCommunities,
  communityEvents: initialEvents,
  communityFinances: initialFinances,
  communityMembers: initialMembers,
  savedBoqs: [],
  cart: [],
  costSettings: initialCostSettings,
  kpiData: kpiData,
  transactionData: transactionData,
  upcomingPayments: upcomingPayments,
  vatPayment: vatPayment,
  cashFlowData: cashFlowData,
};

// This will hold the single, cached version of the state for the server render.
let serverState: AppState | null = null;


// A list of all component update functions to call when state changes.
const listeners = new Set<() => void>();

// The core of our state management. It allows getting the current state,
// setting new state, and subscribing to changes.
export const store = {
  /**
   * Returns a snapshot of the current state.
   */
  get: (): AppState => state,
  
  /**
   * Returns a stable, cached snapshot of the initial state for SSR.
   * This function is designed to be called only on the server. It creates
   * a deep copy of the initial state once and reuses it for all subsequent
   * server-side renders to prevent infinite loops in `useSyncExternalStore`.
   */
  getSsrState: (): AppState => {
    if (serverState === null) {
        // Create a deep enough copy to be safe.
        // This is the critical fix: ensuring the server always gets the exact same object reference.
        serverState = JSON.parse(JSON.stringify(state));
    }
    return serverState;
  },


  /**
   * Updates a part of the state and notifies all listeners.
   * @param updater A function that receives the current state and returns the new state.
   */
  set: (updater: (currentState: AppState) => AppState) => {
    state = updater(state);
    // Notify all subscribed components that the state has changed.
    listeners.forEach((listener) => listener());
  },

  /**
   * Adds a listener function to be called on state changes.
   * @param listener The function to call when the state updates.
   * @returns A function to unsubscribe the listener.
   */
  subscribe: (listener: () => void) => {
    listeners.add(listener);
    // Return an unsubscribe function.
    return () => listeners.delete(listener);
  },
};

    