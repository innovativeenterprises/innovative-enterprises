
'use client';

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
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
};

export type StoreType = {
  state: AppState;
  setState: React.Dispatch<React.SetStateAction<AppState>>;
};

const StoreContext = createContext<StoreType | undefined>(undefined);

export function useStore() {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider.');
  }
  return context;
};

export const StoreProvider = ({ children, initialState }: { children: ReactNode, initialState: Partial<AppState> }) => {
    const [state, setState] = useState<AppState>({ 
      ...({} as AppState), // Provide a default empty state to satisfy TypeScript
      ...initialState, 
      isClient: false 
    });

    useEffect(() => {
        setState(s => ({...s, isClient: true}));
    }, []);

    return (
        <StoreContext.Provider value={{ state, setState }}>
            {children}
        </StoreContext.Provider>
    );
};
