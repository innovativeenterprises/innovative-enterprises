
'use client';

import { createContext, useContext, useSyncExternalStore } from 'react';
import type { AppSettings } from '@/lib/settings';
import type { CartItem } from '@/lib/global-store';
import { initialState, store, type AppState } from '@/lib/global-store';
import { StoreContext } from '@/components/layout/store-provider';

function useStoreData<T>(selector: (state: AppState) => T): T {
  const store = useContext(StoreContext);
  const state = useSyncExternalStore(
    store.subscribe,
    () => selector(store.get()),
    () => selector(initialState)
  );
  return state;
}

// Settings
export const setSettings = (updater: (prev: AppSettings) => AppSettings) => store.set((state) => ({ ...state, settings: updater(state.settings) }));
export const useSettingsData = () => ({
  settings: useStoreData((s) => s.settings),
  setSettings,
});

// Cart
export const setCart = (updater: (prev: CartItem[]) => CartItem[]) => store.set((state) => ({ ...state, cart: updater(state.cart) }));
export const useCartData = () => ({
  cart: useStoreData((s) => s.cart),
  setCart,
});
