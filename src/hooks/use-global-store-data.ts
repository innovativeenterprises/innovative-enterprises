

'use client';

import { useSyncExternalStore } from 'react';
import { store, type AppState, initialState } from '@/lib/global-store';
import type { CartItem } from '@/lib/global-store';
import type { AppSettings } from '@/lib/settings';

/**
 * Custom hook to safely subscribe to the global store and select a slice of state.
 * It uses useSyncExternalStore, which is the officially recommended way to handle
 * external stores with React 18+ and server-side rendering to prevent hydration mismatches.
 */
function useStore<T>(selector: (state: AppState) => T): T {
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

// Data hooks that return the reactive state slice and a flag for client-side rendering.
export const useSettingsData = () => ({ settings: useStore(s => s.settings), isClient: true });
export const useCartData = () => ({ cart: useStore(s => s.cart), isClient: true });
