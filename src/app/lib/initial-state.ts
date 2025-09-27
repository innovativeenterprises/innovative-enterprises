

import type { AppSettings } from '@/lib/settings';
import type { Product } from './products.schema';
import type { Provider } from './providers.schema';
import type { Service } from './services.schema';
import type { Opportunity } from './opportunities.schema';
import type { SignedLease } from './leases';
import type { BookingRequest } from './stairspace-requests';
import type { StairspaceListing } from './stairspace.schema';
import type { Agent, AgentCategory } from './agents.schema';
import type { Agency as RaahaAgency } from './raaha-agencies.schema';
import type { Worker as RaahaWorker } from './raaha-workers.schema';
import type { HireRequest } from './raaha-requests.schema';
import type { BeautyCenter } from './beauty-centers.schema';
import type { BeautySpecialist } from './beauty-specialists.schema';
import type { BeautyService } from './beauty-services.schema';
import type { BeautyAppointment } from './beauty-appointments';
import type { CostRate } from './cost-settings.schema';
import type { Asset } from './assets.schema';
import type { UsedItem } from './used-items.schema';
import { initialSettings } from '@/lib/settings';
import type { Client, Testimonial } from './clients.schema';
import type { GiftCard } from './gift-cards.schema';
import type { Student } from './students.schema';
import type { Community } from './communities';
import type { CommunityEvent } from './community-events';
import type { CommunityFinance } from './community-finances';
import type { CommunityMember } from './community-members';
import type { JobPosting } from './alumni-jobs';
import type { RentalAgency } from './rental-agencies';
import type { Car } from './cars.schema';
import type { DailySales, PosProduct, CartItem } from './pos-data.schema';
import type { SaasCategory } from './saas-products.schema';
import type { StockItem } from './stock-items.schema';
import type { Pricing } from './pricing.schema';
import { initialBriefcase, type BriefcaseData } from '@/lib/briefcase';
import type { Application } from './admissions-applications';
import type { ProjectStage } from './stages';
import type { Investor } from './investors.schema';
import type { KnowledgeDocument } from './knowledge.schema';
import type { CfoData } from './cfo-data.schema';
import type { Property } from './properties.schema';
import type { Solution, Industry, AiTool } from './nav-links';
import type { UserDocument } from './user-documents';
import * as firestore from '@/lib/firestore';

// Define the shape of the global state
export interface AppState {
  isClient: boolean;
  settings: AppSettings | null;
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
  userDocuments: UserDocument[];
}


// This provides the default, empty state for the application.
// Actual data will be fetched server-side in the root layout.
export const getInitialState = (): AppState => ({
  isClient: false,
  settings: initialSettings,
  cart: [],
  products: [],
  storeProducts: [],
  providers: [],
  opportunities: [],
  services: [],
  signedLeases: [],
  stairspaceRequests: [],
  stairspaceListings: [],
  leadership: [],
  staff: [],
  agentCategories: [],
  raahaAgencies: [],
  raahaWorkers: [],
  raahaRequests: [],
  beautyCenters: [],
  beautyServices: [],
  beautySpecialists: [],
  beautyAppointments: [],
  costSettings: [],
  assets: [],
  usedItems: [],
  clients: [],
  testimonials: [],
  giftCards: [],
  students: [],
  communities: [],
  communityEvents: [],
  communityFinances: [],
  communityMembers: [],
  alumniJobs: [],
  rentalAgencies: [],
  cars: [],
  posProducts: [],
  dailySales: [],
  saasProducts: [],
  stockItems: [],
  pricing: [],
  stages: [],
  applications: [],
  briefcase: initialBriefcase,
  investors: [],
  knowledgeBase: [],
  cfoData: null,
  properties: [],
  solutions: [],
  industries: [],
  aiTools: [],
  userDocuments: [],
});

// New function to fetch all data on the server.
export const getFirestoreData = async (): Promise<Partial<AppState>> => {
  const [
    products, storeProducts, services, providers, opportunities, clients, testimonials, pricing,
    posProducts, dailySales, stages, assets, investors, properties, stairspaceListings,
    stairspaceRequests, signedLeases, stockItems, giftCards, students, communities, communityEvents,
    communityFinances, communityMembers, alumniJobs, rentalAgencies, cars, costSettings, raahaData,
    beautyData, settings, knowledgeBase, applications, briefcase, solutions, industries, aiTools,
    saasProducts, cfoData, staffData, userDocuments,
  ] = await Promise.all([
    firestore.getProducts(), firestore.getStoreProducts(), firestore.getServices(), firestore.getProviders(),
    firestore.getOpportunities(), firestore.getClients(), firestore.getTestimonials(), firestore.getPricing(),
    firestore.getPosProducts(), firestore.getDailySales(), firestore.getStages(), firestore.getAssets(),
    firestore.getInvestors(), firestore.getProperties(), firestore.getStairspaceListings(), firestore.getStairspaceRequests(),
    firestore.getLeases(), firestore.getStockItems(), firestore.getGiftCards(), firestore.getStudents(),
    firestore.getCommunities(), firestore.getCommunityEvents(), firestore.getCommunityFinances(), firestore.getMembers(),
    firestore.getAlumniJobs(), firestore.getRentalAgencies(), firestore.getCars(), firestore.getCostSettings(),
    firestore.getRaahaData(), firestore.getBeautyData(), firestore.getSettings(), firestore.getKnowledgeBase(),
    firestore.getApplications(), firestore.getBriefcase(), firestore.getSolutions(), firestore.getIndustries(),
    firestore.getAiTools(), firestore.getSaasProducts(), firestore.getCfoData(), firestore.getStaffData(),
    firestore.getUserDocuments(),
  ]);

  return {
    products, storeProducts, services, providers, opportunities, clients, testimonials, pricing,
    posProducts, dailySales, stages, assets, investors, properties, stairspaceListings,
    stairspaceRequests, signedLeases, stockItems, giftCards, students, communities, communityEvents,
    communityFinances, communityMembers, alumniJobs, rentalAgencies, cars, costSettings, ...raahaData,
    ...beautyData, settings, knowledgeBase, applications, briefcase, solutions, industries, aiTools,
    saasProducts, cfoData, ...staffData, userDocuments,
  };
};

