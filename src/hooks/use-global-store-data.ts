
'use client';

import { useContext, useSyncExternalStore } from 'react';
import { store, type AppState, initialState } from '@/lib/global-store';
import { StoreContext } from '@/components/layout/store-provider';
import type { AppSettings } from '@/lib/settings';
import type { CartItem } from '@/lib/global-store';
import type { SignedLease } from '@/lib/leases';
import type { BookingRequest as StairspaceBookingRequest } from '@/lib/stairspace-requests';


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
  isClient: true,
});

// Cart
export const setCart = (updater: (prev: CartItem[]) => CartItem[]) => store.set((state) => ({ ...state, cart: updater(state.cart) }));
export const useCartData = () => ({
  cart: useStoreData((s) => s.cart),
  setCart,
  isClient: true,
});

// Leases
export const setSignedLeases = (updater: (prev: SignedLease[]) => SignedLease[]) => store.set((state) => ({ ...state, leases: updater(state.leases) }));
export const useLeasesData = () => ({
  leases: useStoreData((s) => s.leases),
  setLeases: setSignedLeases,
  isClient: true,
});

// Stairspace Requests
export const setStairspaceRequests = (updater: (prev: StairspaceBookingRequest[]) => StairspaceBookingRequest[]) => store.set((state) => ({ ...state, stairspaceRequests: updater(state.stairspaceRequests) }));
export const useStairspaceRequestsData = () => ({
  stairspaceRequests: useStoreData((s) => s.stairspaceRequests),
  setStairspaceRequests,
  isClient: true,
});
