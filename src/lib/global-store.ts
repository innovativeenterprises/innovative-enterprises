
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
import { initialProducts, type Product } from './products';
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

export interface CartItem extends Product {
  quantity: number;
}

type AppState = {
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
  cart: CartItem[];
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
  cart: [],
};

// A list of all component update functions to call when state changes.
const listeners = new Set<() => void>();

// The core of our state management. It allows getting the current state,
// setting new state, and subscribing to changes.
export const store = {
  /**
   * Returns a snapshot of the current state.
   */
  get: (): Readonly<AppState> => state,

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
