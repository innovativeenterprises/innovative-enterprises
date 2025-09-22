
'use client';

/**
 * @fileOverview A simple global state management store for the prototype.
 *
 * This avoids the need for a full state management library like Redux or Zustand
 * for this prototype application. It uses a simple listener pattern to update
 * components when the state changes.
 */
import type { BriefcaseData } from './briefcase';
import type { CartItem, DailySales, PosProduct } from './pos-data.schema';
import type { Product } from './products.schema';
import type { Provider } from './providers.schema';
import type { Opportunity } from './opportunities.schema';
import type { Service } from './services.schema';
import type { Agent, AgentCategory } from './agents.schema';
import type { Pricing } from './pricing.schema';
import type { AppSettings } from './settings';
import type { SaasCategory } from './saas-products.schema';
import type { GiftCard } from './gift-cards.schema';
import type { Community } from './communities';
import { getInitialState, type AppState } from './initial-state';

export const createAppStore = (initState: Partial<AppState> = {}) => {
    const initialState = getInitialState();
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

export const store = createAppStore();
