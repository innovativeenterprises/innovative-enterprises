

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
  clients: Client[];
  testimonials: Testimonial[];
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
  clients: [],
  testimonials: [],
};


export const createAppStore = (initState: Partial<AppState> = {}) => {
    // This was the error. It was merging the server data with stale empty arrays.
    // The correct approach is to use the server data as the complete initial state.
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
