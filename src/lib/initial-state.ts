

import type { AppSettings } from './settings';
import type { Product } from './products.schema';
import type { Provider } from './providers.schema';
import type { Service } from './services.schema';
import type { Opportunity } from './opportunities.schema';
import type { SignedLease } from './leases';
import type { BookingRequest } from './stairspace-requests';
import type { StairspaceListing } from './stairspace.schema';
import type { Agent, AgentCategory } from './agents.schema';
import type { Agency as RaahaAgency } from './raaha-agencies';
import type { Worker as RaahaWorker } from './raaha-workers';
import type { HireRequest } from './raaha-requests.schema';
import type { BeautyCenter } from './beauty-centers.schema';
import type { BeautySpecialist } from './beauty-specialists.schema';
import type { BeautyService } from './beauty-services.schema';
import type { BeautyAppointment } from './beauty-appointments';
import type { CostRate } from './cost-settings.schema';
import type { Asset } from './assets.schema';
import type { UsedItem } from './used-items.schema';
import { initialSettings } from './settings';
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
import type { StockItem } from './stock-items.schema';
import type { Pricing } from './pricing.schema';
import { initialPricing } from './pricing';
import { initialProducts, initialStoreProducts } from './products';
import { initialServices } from './services';
import { initialClients, initialTestimonials } from './clients';
import { initialPosProducts, initialDailySales } from './pos-data';
import { initialStages } from './stages';
import { initialCostSettings } from './cost-settings';
import { initialProviders } from './providers';
import { initialStaffData } from './agents';
import { initialRaahaAgencies } from './raaha-agencies';
import { initialRaahaWorkers } from './raaha-workers';
import { initialRaahaRequests } from './raaha-requests';
import { initialLeases } from './leases';
import { initialOpportunities } from './opportunities';
import { initialStairspaceRequests } from './stairspace-requests';
import { initialStairspaceListings } from './stairspace-listings';
import { initialBeautyCenters } from './beauty-centers';
import { initialBeautyServices } from './beauty-services';
import { initialBeautySpecialists } from './beauty-specialists';
import { initialBeautyAppointments } from './beauty-appointments';
import { initialAssets } from './assets';
import { initialUsedItems } from './used-items';
import { initialGiftCards } from './gift-cards';
import { initialStudents } from './students';
import { initialCommunities } from './communities';
import { initialEvents } from './community-events';
import { initialFinances } from './community-finances';
import { initialMembers } from './community-members';
import { initialAlumniJobs } from './alumni-jobs';
import { initialRentalAgencies } from './rental-agencies';
import { initialCars } from './cars';
import { saasProducts as initialSaasProducts } from './saas-products';
import { initialStockItems } from './stock-items';
import { initialBriefcase, type BriefcaseData } from './briefcase';
import { initialApplications } from './admissions-applications';
import type { ProjectStage } from './stages';
import type { Investor } from './investors.schema';
import { initialInvestors } from './investors';
import { initialKnowledgeBase } from './knowledge';
import { initialCfoData } from './cfo-data';
import type { KnowledgeDocument } from './knowledge.schema';
import type { Property } from './properties.schema';
import { initialProperties } from './properties';
import type { SaasCategory } from './saas-products.schema';
import { initialSolutions, initialIndustries, initialAiTools } from './nav-links';
import type { Solution, Industry, AiTool } from './nav-links';

export interface AppState {
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
  stockItems: StockItem[];
  pricing: Pricing[];
  stages: ProjectStage[];
  applications: typeof initialApplications;
  briefcase: BriefcaseData;
  investors: Investor[];
  knowledgeBase: KnowledgeDocument[];
  cfoData: typeof initialCfoData;
  properties: Property[];
  saasProducts: SaasCategory[];
  solutions: Solution[];
  industries: Industry[];
  aiTools: AiTool[];
};

export const initialState: AppState = {
  settings: initialSettings,
  cart: [],
  products: initialProducts,
  storeProducts: initialStoreProducts,
  providers: initialProviders,
  opportunities: initialOpportunities,
  services: initialServices,
  signedLeases: initialLeases,
  stairspaceRequests: initialStairspaceRequests,
  stairspaceListings: initialStairspaceListings,
  leadership: initialStaffData.leadership,
  staff: initialStaffData.staff,
  agentCategories: initialStaffData.agentCategories,
  raahaAgencies: initialRaahaAgencies,
  raahaWorkers: initialRaahaWorkers,
  raahaRequests: initialRaahaRequests,
  beautyCenters: initialBeautyCenters,
  beautyServices: initialBeautyServices,
  beautySpecialists: initialBeautySpecialists,
  beautyAppointments: initialBeautyAppointments,
  costSettings: initialCostSettings,
  assets: initialAssets,
  usedItems: initialUsedItems,
  clients: initialClients,
  testimonials: initialTestimonials,
  giftCards: initialGiftCards,
  students: initialStudents,
  communities: initialCommunities,
  communityEvents: initialEvents,
  communityFinances: initialFinances,
  communityMembers: initialMembers,
  alumniJobs: initialAlumniJobs,
  rentalAgencies: initialRentalAgencies,
  cars: initialCars,
  posProducts: initialPosProducts,
  dailySales: initialDailySales,
  stockItems: initialStockItems,
  pricing: initialPricing,
  stages: initialStages,
  applications: initialApplications,
  briefcase: initialBriefcase,
  investors: initialInvestors,
  knowledgeBase: initialKnowledgeBase,
  cfoData: initialCfoData,
  properties: initialProperties,
  saasProducts: initialSaasProducts,
  solutions: initialSolutions,
  industries: initialIndustries,
  aiTools: initialAiTools,
};

  