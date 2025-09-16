/**
 * @fileOverview A simple global state management store for the prototype.
 *
 * This avoids the need for a full state management library like Redux or Zustand
 * for this prototype application. It uses a simple listener pattern to update
 * components when the state changes.
 */

import { initialSettings, type AppSettings } from './settings';
import type { Product } from './products';
import { initialBeautyCenters, type BeautyCenter } from './beauty-centers';
import { initialBeautyServices, type BeautyService } from './beauty-services';
import { initialBeautyAppointments, type BeautyAppointment } from './beauty-appointments';
import { initialWorkers, type Worker } from './raaha-workers';
import { initialRequests, type HireRequest } from './raaha-requests';
import { initialStairspaceRequests, type BookingRequest } from './stairspace-requests';

export interface CartItem extends Product {
  quantity: number;
}

export type AppState = {
  settings: AppSettings;
  cart: CartItem[];
};

export const initialState: AppState = {
  settings: initialSettings,
  cart: [],
};

let state: AppState = { ...initialState };
const listeners = new Set<() => void>();

export const store = {
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
