
'use client';

import { useSyncExternalStore } from 'react';
import { store, type AppState, initialState } from '@/lib/global-store';
import type { CartItem } from '@/lib/global-store';
import type { AppSettings } from '@/lib/settings';
import type { Service } from '@/lib/services';
import type { Agent, AgentCategory } from '@/lib/agents';
import type { Product } from '@/lib/products';
import type { Provider } from '@/lib/providers';
import type { Asset } from '@/lib/assets';
import type { Investor } from '@/lib/investors';
import type { KnowledgeDocument } from '@/lib/knowledge';
import type { Worker as RaahaWorker } from '@/lib/raaha-workers';
import type { HireRequest } from '@/lib/raaha-requests';
import type { Agency } from '@/lib/raaha-agencies';
import type { SignedLease } from '@/lib/leases';
import type { Property } from '@/lib/properties';
import type { StairspaceListing } from '@/lib/stairspace.schema';
import type { BookingRequest as StairspaceRequest } from '@/lib/stairspace-requests';
import type { CostRate } from '@/lib/cost-settings.schema';
import type { Student } from '@/lib/students';
import type { Transaction as PosTransaction, PosProduct } from '@/lib/pos-data';
import type { GiftCard } from '@/lib/gift-cards';
import type { Client, Testimonial } from '@/lib/clients';

/**
 * Custom hook to safely subscribe to the global store and select a slice of state.
 * It uses useSyncExternalStore, which is the officially recommended way to handle
 * external stores with React 18+ and server-side rendering to prevent hydration mismatches.
 */
function useStoreData<T>(selector: (state: AppState) => T): T {
  const state = useSyncExternalStore(
    store.subscribe,
    () => selector(store.get()),
    () => selector(initialState) // Return initial state for the server render
  );
  return state;
}

// Centralized setters for client-side state mutations.
export const setSettings = (updater: (prev: AppSettings) => AppSettings) => store.set(state => ({ ...state, settings: updater(state.settings) }));
export const setCart = (updater: (prev: CartItem[]) => CartItem[]) => store.set(state => ({...state, cart: updater(state.cart)}));
export const setRaahaRequests = (updater: (prev: HireRequest[]) => HireRequest[]) => store.set(state => ({...state, raahaRequests: updater(state.raahaRequests)}));
export const setSignedLeases = (updater: (prev: SignedLease[]) => SignedLease[]) => store.set(state => ({...state, signedLeases: updater(state.signedLeases)}));
export const setStairspaceRequests = (updater: (prev: StairspaceRequest[]) => StairspaceRequest[]) => store.set(state => ({...state, stairspaceRequests: updater(state.stairspaceRequests)}));
export const setDailySales = (updater: (prev: PosTransaction[]) => PosTransaction[]) => store.set(state => ({...state, dailySales: updater(state.dailySales)}));

// Data hooks that return the reactive state slice and a flag for client-side rendering.
export const useSettingsData = () => ({ settings: useStoreData(s => s.settings), isClient: true });
export const useCartData = () => ({ cart: useStoreData(s => s.cart), isClient: true });
export const useRequestsData = () => ({ requests: useStoreData(s => s.raahaRequests), setRequests: setRaahaRequests, isClient: true });
export const useLeasesData = () => ({ leases: useStoreData(s => s.signedLeases), setLeases: setSignedLeases, isClient: true });
export const useStairspaceRequestsData = () => ({ stairspaceRequests: useStoreData(s => s.stairspaceRequests), setStairspaceRequests, isClient: true });
