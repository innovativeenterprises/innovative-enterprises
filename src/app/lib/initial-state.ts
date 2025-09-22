

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
import type { BeautyAppointment } from '@/lib/beauty-appointments';
import type { CostRate } from '@/lib/cost-settings.schema';
import type { Asset } from '@/lib/assets.schema';
import type { UsedItem } from '@/lib/used-items.schema';
import { initialSettings } from '@/lib/settings';
import type { Client, Testimonial } from '@/lib/clients.schema';
import type { GiftCard } from '@/lib/gift-cards.schema';
import type { Student } from '@/lib/students.schema';
import type { Community } from '@/lib/communities';
import type { CommunityEvent } from '@/lib/community-events';
import type { CommunityFinance } from '@/lib/community-finances';
import type { CommunityMember } from '@/lib/community-members';
import type { JobPosting } from '@/lib/alumni-jobs';
import type { RentalAgency } from '@/lib/rental-agencies';
import type { Car } from '@/lib/cars.schema';
import type { DailySales, PosProduct, CartItem } from '@/lib/pos-data.schema';
import type { SaasCategory } from '@/lib/saas-products.schema';
import type { StockItem } from '@/lib/stock-items.schema';
import type { Pricing } from '@/lib/pricing.schema';
import { initialPricing } from '@/lib/pricing';
import { initialProducts, initialStoreProducts } from '@/lib/products';
import { initialServices } from '@/lib/services';
import { initialClients, initialTestimonials } from '@/lib/clients';
import { initialPosProducts, initialDailySales } from '@/lib/pos-data';
import { initialStages } from '@/lib/stages';
import { initialCostSettings } from '@/lib/cost-settings';
import { initialProviders } from '@/lib/providers';
import { initialStaffData } from '@/lib/agents';
import { initialRaahaAgencies } from '@/lib/raaha-agencies';
import { initialRaahaWorkers } from '@/lib/raaha-workers';
import { initialRaahaRequests } from '@/lib/raaha-requests';
import { initialLeases } from '@/lib/leases';
import { initialOpportunities } from '@/lib/opportunities';
import { initialStairspaceRequests } from '@/lib/stairspace-requests';
import { initialStairspaceListings } from '@/lib/stairspace-listings';
import { initialBeautyCenters } from '@/lib/beauty-centers';
import { initialBeautyServices } from '@/lib/beauty-services';
import { initialBeautySpecialists } from '@/lib/beauty-specialists';
import { initialBeautyAppointments } from '@/lib/beauty-appointments';
import { initialAssets } from '@/lib/assets';
import { initialUsedItems } from '@/lib/used-items';
import { initialGiftCards } from '@/lib/gift-cards';
import { initialStudents } from '@/lib/students';
import { initialCommunities } from '@/lib/communities';
import { initialEvents } from '@/lib/community-events';
import { initialFinances } from '@/lib/community-finances';
import { initialMembers } from '@/lib/community-members';
import { initialAlumniJobs } from '@/lib/alumni-jobs';
import { initialRentalAgencies } from '@/lib/rental-agencies';
import { initialCars } from '@/lib/cars';
import { saasProducts as initialSaasProducts } from '@/lib/saas-products';
import { initialStockItems } from '@/lib/stock-items';
import { initialBriefcase, type BriefcaseData } from '@/lib/briefcase';
import { initialApplications } from '@/lib/admissions-applications';
import type { ProjectStage } from '@/lib/stages';
import type { Investor } from '@/lib/investors.schema';
import { initialInvestors } from '@/lib/investors';
import { initialKnowledgeBase } from '@/lib/knowledge';
import { initialCfoData } from '@/lib/cfo-data';
import type { KnowledgeDocument } from '@/lib/knowledge.schema';
import type { Property } from '@/lib/properties.schema';
import { initialProperties } from '@/lib/properties';
import { initialSolutions, initialIndustries, initialAiTools } from '@/lib/nav-links';
import type { Solution, Industry, AiTool } from '@/lib/nav-links';

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
  saasProducts: SaasCategory[];
  stockItems: StockItem[];
  pricing: Pricing[];
  stages: ProjectStage[];
  applications: typeof initialApplications;
  briefcase: BriefcaseData;
  investors: Investor[];
  knowledgeBase: KnowledgeDocument[];
  cfoData: typeof initialCfoData;
  properties: Property[];
  solutions: Solution[];
  industries: Industry[];
  aiTools: AiTool[];
};

// This provides the default, empty state for the application.
// Actual data will be fetched by server components and passed as props.
export const getInitialState = (): AppState => ({
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
