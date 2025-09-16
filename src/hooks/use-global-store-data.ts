
'use client';

import { useContext, useSyncExternalStore } from 'react';
import { store, type AppState, initialState } from '@/lib/global-store';
import { StoreContext } from '@/components/layout/store-provider';
import type { AppSettings } from '@/lib/settings';
import type { CartItem } from '@/lib/global-store';
import type { BeautyCenter } from '@/lib/beauty-centers';
import type { BeautyService } from '@/lib/beauty-services';
import type { BeautyAppointment } from '@/lib/beauty-appointments';
import type { HireRequest } from '@/lib/raaha-requests';
import type { Worker } from '@/lib/raaha-workers';
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

// Beauty Hub: Agencies
export const setBeautyCenters = (updater: (prev: BeautyCenter[]) => BeautyCenter[]) => store.set((state) => ({ ...state, beautyCenters: updater(state.beautyCenters) }));
export const useBeautyCentersData = () => ({
  agencies: useStoreData((s) => s.beautyCenters),
  setAgencies: setBeautyCenters,
  isClient: true,
});

// Beauty Hub: Services
export const setBeautyServices = (updater: (prev: BeautyService[]) => BeautyService[]) => store.set((state) => ({ ...state, beautyServices: updater(state.beautyServices) }));
export const useBeautyServicesData = () => ({
  services: useStoreData((s) => s.beautyServices),
  setServices: setBeautyServices,
  isClient: true,
});

// Beauty Hub: Appointments
export const setBeautyAppointments = (updater: (prev: BeautyAppointment[]) => BeautyAppointment[]) => store.set((state) => ({ ...state, beautyAppointments: updater(state.beautyAppointments) }));
export const useBeautyAppointmentsData = () => ({
  appointments: useStoreData((s) => s.beautyAppointments),
  setAppointments: setBeautyAppointments,
  isClient: true,
});

// RAAHA Requests
export const setRaahaRequests = (updater: (prev: HireRequest[]) => HireRequest[]) => store.set((state) => ({ ...state, raahaRequests: updater(state.raahaRequests) }));
export const useRequestsData = () => ({
  requests: useStoreData((s) => s.raahaRequests),
  setRaahaRequests,
  isClient: true,
});

// RAAHA Workers
export const setWorkers = (updater: (prev: Worker[]) => Worker[]) => store.set((state) => ({ ...state, raahaWorkers: updater(state.raahaWorkers) }));
export const useWorkersData = () => ({
  workers: useStoreData((s) => s.raahaWorkers),
  setWorkers,
  isClient: true,
});

// StairSpace Requests
export const setStairspaceRequests = (updater: (prev: BookingRequest[]) => BookingRequest[]) => store.set((state) => ({ ...state, stairspaceRequests: updater(state.stairspaceRequests) }));
export const useStairspaceRequestsData = () => ({
  stairspaceRequests: useStoreData((s) => s.stairspaceRequests),
  setStairspaceRequests,
  isClient: true,
});
