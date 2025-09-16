
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
export const setClients = (updater: (prev: Client[]) => Client[]) => store.set(state => ({ ...state, clients: updater(state.clients) }));
export const setTestimonials = (updater: (prev: Testimonial[]) => Testimonial[]) => store.set(state => ({ ...state, testimonials: updater(state.testimonials) }));
export const setProducts = (updater: (prev: Product[]) => Product[]) => store.set(state => ({...state, products: updater(state.products)}));
export const setProviders = (updater: (prev: Provider[]) => Provider[]) => store.set(state => ({...state, providers: updater(state.providers)}));
export const setAssets = (updater: (prev: Asset[]) => Asset[]) => store.set(state => ({...state, assets: updater(state.assets)}));
export const setInvestors = (updater: (prev: Investor[]) => Investor[]) => store.set(state => ({...state, investors: updater(state.investors)}));
export const setCostSettings = (updater: (prev: CostRate[]) => CostRate[]) => store.set(state => ({...state, costSettings: updater(state.costSettings)}));
export const setStudents = (updater: (prev: Student[]) => Student[]) => store.set(state => ({...state, students: updater(state.students)}));
export const setPosProducts = (updater: (prev: PosProduct[]) => PosProduct[]) => store.set(state => ({...state, posProducts: updater(state.posProducts)}));
export const setDailySales = (updater: (prev: PosTransaction[]) => PosTransaction[]) => store.set(state => ({...state, dailySales: updater(state.dailySales)}));
export const setGiftCards = (updater: (prev: GiftCard[]) => GiftCard[]) => store.set(state => ({...state, giftCards: updater(state.giftCards)}));
export const setLeadership = (updater: (prev: Agent[]) => Agent[]) => store.set(state => ({...state, leadership: updater(state.leadership)}));
export const setStaff = (updater: (prev: Agent[]) => Agent[]) => store.set(state => ({...state, staff: updater(state.staff)}));
export const setAgentCategories = (updater: (prev: AgentCategory[]) => AgentCategory[]) => store.set(state => ({...state, agentCategories: updater(state.agentCategories)}));
export const setStairspaceListings = (updater: (prev: StairspaceListing[]) => StairspaceListing[]) => store.set(state => ({...state, stairspaceListings: updater(state.stairspaceListings)}));
export const setRaahaRequests = (updater: (prev: HireRequest[]) => HireRequest[]) => store.set(state => ({...state, raahaRequests: updater(state.raahaRequests)}));
export const setSignedLeases = (updater: (prev: SignedLease[]) => SignedLease[]) => store.set(state => ({...state, signedLeases: updater(state.signedLeases)}));
export const setStairspaceRequests = (updater: (prev: StairspaceRequest[]) => StairspaceRequest[]) => store.set(state => ({...state, stairspaceRequests: updater(state.stairspaceRequests)}));

// Data hooks that return the reactive state slice and a flag for client-side rendering.
export const useSettingsData = () => ({ settings: useStoreData(s => s.settings), isClient: true });
export const useCartData = () => ({ cart: useStoreData(s => s.cart), isClient: true });
export const useClientsData = () => ({ clients: useStoreData(s => s.clients), isClient: true });
export const useTestimonialsData = () => ({ testimonials: useStoreData(s => s.testimonials), isClient: true });
export const useProductsData = () => ({ products: useStoreData(s => s.products), isClient: true });
export const useProvidersData = () => ({ providers: useStoreData(s => s.providers), isClient: true });
export const useAssetsData = () => ({ assets: useStoreData(s => s.assets), isClient: true });
export const useInvestorsData = () => ({ investors: useStoreData(s => s.investors), isClient: true });
export const useAgenciesData = () => ({ agencies: useStoreData(s => s.raahaAgencies), isClient: true });
export const useWorkersData = () => ({ workers: useStoreData(s => s.raahaWorkers), isClient: true });
export const useRequestsData = () => ({ requests: useStoreData(s => s.raahaRequests), isClient: true });
export const useLeasesData = () => ({ leases: useStoreData(s => s.signedLeases), isClient: true });
export const usePropertiesData = () => ({ properties: useStoreData(s => s.properties), isClient: true });
export const useStairspaceData = () => ({ stairspaceListings: useStoreData(s => s.stairspaceListings), isClient: true });
export const useStairspaceRequestsData = () => ({ stairspaceRequests: useStoreData(s => s.stairspaceRequests), isClient: true });
export const useOpportunitiesData = () => ({ opportunities: useStoreData(s => s.opportunities), isClient: true });
export const useProjectStagesData = () => ({ stages: useStoreData(s => s.stages), isClient: true });
export const useCostSettingsData = () => ({ costSettings: useStoreData(s => s.costSettings), isClient: true });
export const useStudentsData = () => ({ students: useStoreData(s => s.students), isClient: true });
export const usePosData = () => ({ posProducts: useStoreData(s => s.posProducts), dailySales: useStoreData(s => s.dailySales), isClient: true });
export const useGiftCardsData = () => ({ giftCards: useStoreData(s => s.giftCards), isClient: true });
export const useStaffData = () => ({ leadership: useStoreData(s => s.leadership), staff: useStoreData(s => s.staff), agentCategories: useStoreData(s => s.agentCategories), isClient: true });
export const useServicesData = () => ({ services: useStoreData(s => s.services), isClient: true });
