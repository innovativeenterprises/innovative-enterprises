
'use client';

import { createContext, useContext, useSyncExternalStore } from 'react';
import type { AppSettings } from '@/lib/settings';
import type { CartItem } from '@/lib/global-store';
import { initialState, store, type AppState } from '@/lib/global-store';
import { StoreContext } from '@/components/layout/store-provider';
import type { SignedLease } from '@/lib/leases';
import type { BookingRequest } from '@/lib/stairspace-requests';

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
export const useSettingsData = () => {
    const isClient = useSyncExternalStore(store.subscribe, () => true, () => false);
    return {
        settings: useStoreData((s) => s.settings),
        setSettings,
        isClient,
    };
};

// Cart
export const setCart = (updater: (prev: CartItem[]) => CartItem[]) => store.set((state) => ({ ...state, cart: updater(state.cart) }));
export const useCartData = () => {
    const isClient = useSyncExternalStore(store.subscribe, () => true, () => false);
    return {
        cart: useStoreData((s) => s.cart),
        setCart,
        isClient,
    };
};

// Signed Leases
export const setSignedLeases = (updater: (prev: SignedLease[]) => SignedLease[]) => store.set((state) => ({ ...state, signedLeases: updater(state.signedLeases) }));
export const useLeasesData = () => {
    const isClient = useSyncExternalStore(store.subscribe, () => true, () => false);
    return {
        leases: useStoreData((s) => s.signedLeases),
        setLeases: setSignedLeases,
        isClient,
    };
};

// StairSpace Requests
export const setStairspaceRequests = (updater: (prev: BookingRequest[]) => BookingRequest[]) => store.set((state) => ({ ...state, stairspaceRequests: updater(state.stairspaceRequests) }));
export const useStairspaceRequestsData = () => {
    const isClient = useSyncExternalStore(store.subscribe, () => true, () => false);
    return {
        stairspaceRequests: useStoreData((s) => s.stairspaceRequests),
        setStairspaceRequests,
        isClient,
    };
};
