
import type { AppSettings } from '@/lib/settings';
import type { Product } from '@/lib/products.schema';
import type { Provider } from '@/lib/providers.schema';
import type { Service } from '@/lib/services.schema';
import type { Opportunity } from '@/lib/opportunities.schema';
import type { SignedLease } from '@/lib/leases';
import type { BookingRequest } from '@/lib/stairspace-requests';
import type { StairspaceListing } from '@/lib/stairspace.schema';
import type { Agent, AgentCategory } from '@/lib/agents.schema';
import type { Agency as RaahaAgency } from '@/lib/raaha-agencies.schema';
import type { Worker as RaahaWorker } from '@/lib/raaha-workers';
import type { HireRequest } from '@/lib/raaha-requests.schema';
import type { BeautyCenter } from '@/lib/beauty-centers.schema';
import type { BeautySpecialist } from '@/lib/beauty-specialists.schema';
import type { BeautyService } from '@/lib/beauty-services.schema';
import type { BeautyAppointment } from './beauty-appointments';
import type { CostRate } from './cost-settings.schema';
import type { Asset } from './assets.schema';
import type { UsedItem } from './used-items.schema';
import { initialSettings } from '@/lib/settings';
import type { Client, Testimonial } from '@/lib/clients.schema';
import type { GiftCard } from '@/lib/gift-cards.schema';
import type { Student } from '@/lib/students.schema';
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
import { initialSolutions, initialIndustries, initialAiTools } from './nav-links';
import type { Solution, Industry, AiTool } from './nav-links';
import type { AppState as AppStateType } from './global-store';
import { saasProducts } from './saas-products';


export type AppState = AppStateType;

// This provides the default, empty state for the application.
// Actual data will be fetched by server components and passed as props.
export const getInitialState = (): Omit<AppState, 'isClient'> => ({
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
  saasProducts: initialSaasProducts,
  stockItems: initialStockItems,
  pricing: initialPricing,
  stages: initialStages,
  applications: initialApplications,
  briefcase: initialBriefcase,
  investors: initialInvestors,
  knowledgeBase: initialKnowledgeBase,
  cfoData: initialCfoData,
  properties: initialProperties,
  solutions: initialSolutions,
  industries: initialIndustries,
  aiTools: initialAiTools,
});
