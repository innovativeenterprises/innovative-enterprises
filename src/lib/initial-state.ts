
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
import type { Worker as RaahaWorker } from './raaha-workers';
import type { HireRequest } from './raaha-requests.schema';
import type { BeautyCenter } from './beauty-centers.schema';
import type { BeautySpecialist } from './beauty-specialists.schema';
import type { BeautyService } from './beauty-services.schema';
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
import { initialBriefcase, type BriefcaseData } from './briefcase';
import type { Application } from './admissions-applications';
import type { ProjectStage } from './stages';
import type { Investor } from './investors.schema';
import type { KnowledgeDocument } from './knowledge.schema';
import type { CfoData } from './cfo-data.schema';
import type { Property } from './properties.schema';
import type { Solution, Industry, AiTool } from './nav-links';

// This provides the default, empty state for the application.
// Actual data will be fetched by server components and passed as props.
export const getEmptyState = (): AppState => ({
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
});

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

