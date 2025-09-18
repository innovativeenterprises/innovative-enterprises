

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
import type { Agency as RaahaAgency } from './raaha-agencies';
import type { Worker as RaahaWorker } from './raaha-workers';
import type { HireRequest } from './raaha-requests';
import type { BeautyCenter } from './beauty-centers';
import type { BeautyService } from './beauty-services';
import type { BeautyAppointment } from './beauty-appointments';
import type { CostRate } from './cost-settings.schema';
import type { Asset } from './assets.schema';
import type { UsedItem } from './used-items';


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
  raahaAgencies: RaahaAgency[];
  raahaWorkers: RaahaWorker[];
  raahaRequests: HireRequest[];
  beautyCenters: BeautyCenter[];
  beautyServices: BeautyService[];
  beautyAppointments: BeautyAppointment[];
  costSettings: CostRate[];
  assets: Asset[];
  usedItems: UsedItem[];
};

export const initialState: AppState = {
  settings: initialSettings,
  cart: [],
  products: [],
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
  beautyAppointments: [],
  costSettings: [],
  assets: [],
  usedItems: [],
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
