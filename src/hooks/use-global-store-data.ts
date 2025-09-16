
'use client';

import { useSyncExternalStore } from 'react';
import { store, type AppState } from '@/lib/global-store';
import type { CartItem } from '@/lib/global-store';
import type { AppSettings } from '@/lib/settings';
import type { Service } from '@/lib/services';
import type { Product } from '@/lib/products';
import type { Client, Testimonial } from '@/lib/clients';
import type { Pricing } from '@/lib/pricing';
import type { PosProduct } from '@/lib/pos-data';
import type { ProjectStage } from '@/lib/stages';
import type { Provider } from '@/lib/providers';
import type { Asset } from '@/lib/assets';
import type { Opportunity } from '@/lib/opportunities';
import type { KnowledgeDocument } from '@/lib/knowledge';
import type { Agent, AgentCategory } from '@/lib/agents';
import type { Investor } from '@/lib/investors';
import type { CostRate } from '@/lib/cost-settings.schema';
import type { DailySales } from '@/lib/pos-data';
import type { Student } from '@/lib/students';
import type { SignedLease } from '@/lib/leases';
import type { StairspaceListing } from '@/lib/stairspace-listings';
import type { BookingRequest } from '@/lib/stairspace-requests';

// Centralized setters for client-side state mutations.
export const setSettings = (updater: (prev: AppSettings) => AppSettings) => store.set(state => ({ ...state, settings: updater(state.settings) }));
export const setCart = (updater: (prev: CartItem[]) => CartItem[]) => store.set(state => ({...state, cart: updater(state.cart)}));

// Data hooks that return the reactive state slice and a flag for client-side rendering.
export const useSettingsData = () => ({ settings: useStore(s => s.settings), setSettings, isClient: true });
export const useCartData = () => ({ cart: useStore(s => s.cart), setCart, isClient: true });

function useStore<T>(selector: (state: AppState) => T): T {
    const state = useSyncExternalStore(
        store.subscribe,
        () => selector(store.get()),
        () => selector(store.get()) // For SSR, we return the initial server state.
    );
    return state;
}
