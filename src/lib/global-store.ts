

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

import { initialSettings, type AppSettings } from './settings';
import type { Product } from './products.schema';
import type { Provider } from './providers.schema';
import type { Service } from './services.schema';
import type { Opportunity } from './opportunities.schema';
import type { SignedLease } from './leases.schema';
import type { BookingRequest } from './stairspace-requests.schema';
import type { StairspaceListing } from './stairspace.schema';
import type { Agent, AgentCategory } from './agents.schema';
import { initialAgencies as initialRaahaAgencies } from './raaha-agencies';
import { initialWorkers as initialRaahaWorkers } from './raaha-workers';
import { initialRequests as initialRaahaRequests } from './raaha-requests';
import { initialBeautyCenters } from './beauty-centers';
import { initialBeautyServices } from './beauty-services';
import { initialBeautyAppointments } from './beauty-appointments';
import { initialCostSettings } from './cost-settings';
import { initialAssets } from './assets';
import { initialUsedItems } from './used-items';
import { initialProducts } from './products';
import { initialProviders } from './providers';
import { initialOpportunities } from './opportunities';
import { initialServices } from './services';
import { initialLeases } from './leases';
import { initialStairspaceRequests } from './stairspace-requests';
import { initialStairspaceListings } from './stairspace-listings';
import { initialStaffData } from './agents';


export interface CartItem extends Product {
  quantity: number;
}

export type AppState = {
  settings: AppSettings;
  cart: CartItem[];
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
  raahaAgencies: typeof initialRaahaAgencies;
  raahaWorkers: typeof initialRaahaWorkers;
  raahaRequests: typeof initialRaahaRequests;
  beautyCenters: typeof initialBeautyCenters;
  beautyServices: typeof initialBeautyServices;
  beautyAppointments: typeof initialBeautyAppointments;
  costSettings: typeof initialCostSettings;
  assets: typeof initialAssets;
  usedItems: typeof initialUsedItems;
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
};

// The single source of truth for our application's shared state.
let state: AppState = { ...initialState };

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
