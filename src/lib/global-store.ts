

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
import { initialProducts } from './products';
import type { Provider } from './providers.schema';
import { initialProviders } from './providers';
import type { Service } from './services.schema';
import { initialServices } from './services';
import type { Opportunity } from './opportunities.schema';
import { initialOpportunities } from './opportunities';
import type { SignedLease } from './leases';
import { initialLeases } from './leases';
import type { BookingRequest } from './stairspace-requests';
import { initialStairspaceRequests } from './stairspace-requests';
import type { StairspaceListing } from './stairspace.schema';
import { initialStairspaceListings } from './stairspace-listings';
import type { Agent, AgentCategory } from './agents.schema';
import { initialStaffData } from './agents';
import { initialAgencies as initialRaahaAgencies } from './raaha-agencies';
import { initialWorkers as initialRaahaWorkers } from './raaha-workers';
import { initialRequests as initialRaahaRequests } from './raaha-requests';
import { initialBeautyCenters } from './beauty-centers';
import { initialBeautyServices } from './beauty-services';
import { initialBeautyAppointments } from './beauty-appointments';
import { initialCostSettings } from './cost-settings';
import { initialAssets } from './assets';
import { initialUsedItems } from './used-items';

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


export const createAppStore = (initState: AppState = initialState) => {
    let state: AppState = { ...initState };
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

// Legacy export for any components that might still be using it directly.
export const store = createAppStore();
