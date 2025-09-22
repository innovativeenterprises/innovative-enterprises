
'use client';

import React, { createContext, useContext, ReactNode, useRef, useEffect } from 'react';
import type { BriefcaseData } from './briefcase';
import type { CartItem, DailySales, PosProduct } from './pos-data.schema';
import type { Product } from './products.schema';
import type { Provider } from './providers.schema';
import type { Opportunity } from './opportunities.schema';
import type { Service } from './services.schema';
import type { Agent, AgentCategory } from './agents.schema';
import type { Pricing } from './pricing.schema';
import type { AppSettings } from './settings';
import type { SaasCategory } from './saas-products.schema';
import type { GiftCard } from './gift-cards.schema';
import type { Community } from './communities';
import type { SignedLease } from './leases';
import type { BookingRequest } from './stairspace-requests';
import type { StairspaceListing } from './stairspace.schema';
import type { HireRequest } from './raaha-requests.schema';
import type { Agency as RaahaAgency } from './raaha-agencies.schema';
import type { Worker as RaahaWorker } from './raaha-workers.schema';
import type { BeautyCenter } from './beauty-centers.schema';
import type { BeautyService } from './beauty-services.schema';
import type { BeautySpecialist } from './beauty-specialists.schema';
import type { BeautyAppointment } from './beauty-appointments';
import type { CostRate } from './cost-settings.schema';
import type { Asset } from './assets.schema';
import type { UsedItem } from './used-items.schema';
import type { Client, Testimonial } from './clients.schema';
import type { Student } from './students.schema';
import type { CommunityEvent } from './community-events';
import type { CommunityFinance } from './community-finances';
import type { CommunityMember } from './community-members';
import type { JobPosting } from './alumni-jobs';
import type { RentalAgency } from './rental-agencies';
import type { Car } from './cars.schema';
import type { StockItem } from './stock-items.schema';
import type { ProjectStage } from './stages';
import type { Investor } from './investors.schema';
import type { KnowledgeDocument } from './knowledge.schema';
import type { CfoData } from './cfo-data.schema';
import type { Property } from './properties.schema';
import type { Solution, Industry, AiTool } from './nav-links';
import type { Application } from './admissions-applications';

// Define the shape of the global state
export interface AppState {
  isClient: boolean;
  settings: AppSettings;
  cart: CartItem[];
  products: Product[];
  storeProducts: Product[];
  providers: Provider[];
  opportunities: Opportunity[];
  services: Service[];
  signedLeases: SignedLease[];
  stairspaceRequests: BookingRequest[];
  stairspaceListings: StairspaceListing[];
  leadership: Agent[];
  staff: Agent[];
  agentCategories: AgentCategory[];
  raahaAgencies: RaahaAgency[];
  raahaWorkers: RaahaWorker[];
  raahaRequests: HireRequest[];
  beautyCenters: BeautyCenter[];
  beautyServices: BeautyService[];
  beautySpecialists: BeautySpecialist[];
  beautyAppointments: BeautyAppointment[];
  costSettings: CostRate[];
  assets: Asset[];
  usedItems: UsedItem[];
  clients: Client[];
  testimonials: Testimonial[];
  giftCards: GiftCard[];
  students: Student[];
  communities: Community[];
  communityEvents: CommunityEvent[];
  communityFinances: CommunityFinance[];
  communityMembers: CommunityMember[];
  alumniJobs: JobPosting[];
  rentalAgencies: RentalAgency[];
  cars: Car[];
  posProducts: PosProduct[];
  dailySales: DailySales;
  saasProducts: SaasCategory[];
  stockItems: StockItem[];
  pricing: Pricing[];
  stages: ProjectStage[];
  applications: Application[];
  briefcase: BriefcaseData | null;
  investors: Investor[];
  knowledgeBase: KnowledgeDocument[];
  cfoData: CfoData | null;
  properties: Property[];
  solutions: Solution[];
  industries: Industry[];
  aiTools: AiTool[];
}

// Define the store's API
export type StoreType = {
  get: () => AppState;
  set: (updater: (currentState: AppState) => AppState) => void;
  subscribe: (listener: () => void) => () => void;
};

// Create the context
export const StoreContext = createContext<StoreType | undefined>(undefined);

// Create the provider component
export const StoreProvider = ({ children, initialState }: { children: ReactNode, initialState: AppState }) => {
    const storeRef = useRef<StoreType>();

    if (!storeRef.current) {
        let state = { ...initialState, isClient: false }; // Start with isClient as false
        const listeners = new Set<() => void>();
        
        storeRef.current = {
            get: () => state,
            set: (updater) => {
                state = updater(state);
                listeners.forEach((l) => l());
            },
            subscribe: (listener) => {
                listeners.add(listener);
                return () => listeners.delete(listener);
            },
        };
    }
    
    // On the client, after the first render, we update the isClient flag.
    useEffect(() => {
        storeRef.current?.set(s => ({...s, isClient: true}));
    }, []);

    return (
        <StoreContext.Provider value={storeRef.current}>
            {children}
        </StoreContext.Provider>
    );
};
