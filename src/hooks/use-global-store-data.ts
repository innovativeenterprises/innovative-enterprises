
'use client';

import { useSyncExternalStore } from 'react';
import { store, type AppState, initialState } from '@/lib/global-store';
import type { CartItem } from '@/lib/global-store';
import type { AppSettings } from '@/lib/settings';

/**
 * Custom hook to safely subscribe to the global store and select a slice of state.
 * It uses useSyncExternalStore for React 18+ to prevent hydration mismatches.
 */
function useStoreData<T>(selector: (state: AppState) => T): T {
  const state = useSyncExternalStore(
    store.subscribe,
    () => selector(store.get()),
    () => selector(initialState) // Return initial state for the server render
  );
  return state;
}

// Centralized setters to be used within the custom hooks
export const setSettings = (updater: (prev: AppSettings) => void) => store.set(state => ({ ...state, settings: updater(state.settings) }));
export const setCart = (updater: (prev: CartItem[]) => CartItem[]) => store.set(state => ({...state, cart: updater(state.cart)}));


// Data hooks that return the reactive state slice and a flag for client-side rendering.
export const useSettingsData = () => ({ settings: useStoreData(s => s.settings), isClient: true });
export const useCartData = () => ({ cart: useStoreData(s => s.cart), isClient: true });
