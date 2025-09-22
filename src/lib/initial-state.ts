
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
import { 
    getProducts, getStoreProducts, getServices, getClients, getTestimonials, 
    getPricing, getPosProducts, getDailySales, getStages, getAssets, getInvestors, 
    getProperties, getStairspaceListings, getStairspaceRequests, getLeases, 
    getStockItems, getGiftCards, getStudents, getCommunities, getCommunityEvents, 
    getCommunityFinances, getCommunityMembers, getAlumniJobs, getRentalAgencies, 
    getCars, getCostSettings, getBeautyCenters, getBeautyServices, 
    getBeautySpecialists, getBeautyAppointments, getUsedItems, getSettings, 
    getKnowledgeBase, getApplications, getBriefcase, getSolutions, getIndustries, 
    getAiTools, getSaasProducts, getCfoData, getStaffData, getRaahaData, getBeautyData 
} from './firestore';
import type { ProjectStage } from './stages';
import type { Investor } from './investors.schema';
import type { KnowledgeDocument } from './knowledge.schema';
import type { CfoData } from './cfo-data.schema';
import type { Property } from './properties.schema';
import type { Solution, Industry, AiTool } from './nav-links';
import type { AppState as AppStateType } from '@/lib/global-store';
import { initialBriefcase } from './briefcase';


export type AppState = AppStateType;

// This provides the default, empty state for the application.
// Actual data will be fetched by server components and passed as props.
export const getInitialState = async (): Promise<Omit<AppState, 'isClient'>> => {
  const [
    settings,
    products,
    storeProducts,
    providers,
    opportunities,
    services,
    signedLeases,
    stairspaceRequests,
    stairspaceListings,
    staffData,
    raahaData,
    beautyData,
    costSettings,
    assets,
    usedItems,
    clients,
    testimonials,
    giftCards,
    students,
    communities,
    communityEvents,
    communityFinances,
    communityMembers,
    alumniJobs,
    rentalAgencies,
    cars,
    posProducts,
    dailySales,
    saasProducts,
    stockItems,
    pricing,
    stages,
    applications,
    briefcase,
    investors,
    knowledgeBase,
    cfoData,
    properties,
    solutions,
    industries,
    aiTools
  ] = await Promise.all([
    getSettings(),
    getProducts(),
    getStoreProducts(),
    getProviders(),
    getOpportunities(),
    getServices(),
    getLeases(),
    getStairspaceRequests(),
    getStairspaceListings(),
    getStaffData(),
    getRaahaData(),
    getBeautyData(),
    getCostSettings(),
    getAssets(),
    getUsedItems(),
    getClients(),
    getTestimonials(),
    getGiftCards(),
    getStudents(),
    getCommunities(),
    getCommunityEvents(),
    getCommunityFinances(),
    getCommunityMembers(),
    getAlumniJobs(),
    getRentalAgencies(),
    getCars(),
    getPosProducts(),
    getDailySales(),
    getSaasProducts(),
    getStockItems(),
    getPricing(),
    getStages(),
    getApplications(),
    getBriefcase(),
    getInvestors(),
    getKnowledgeBase(),
    getCfoData(),
    getProperties(),
    getSolutions(),
    getIndustries(),
    getAiTools()
  ]);

  return {
      settings,
      cart: [],
      products,
      storeProducts,
      providers,
      opportunities,
      services,
      signedLeases,
      stairspaceRequests,
      stairspaceListings,
      leadership: staffData.leadership,
      staff: staffData.staff,
      agentCategories: staffData.agentCategories,
      raahaAgencies: raahaData.raahaAgencies,
      raahaWorkers: raahaData.raahaWorkers,
      raahaRequests: raahaData.raahaRequests,
      beautyCenters: beautyData.beautyCenters,
      beautyServices: beautyData.beautyServices,
      beautySpecialists: beautyData.beautySpecialists,
      beautyAppointments: beautyData.beautyAppointments,
      costSettings,
      assets,
      usedItems,
      clients,
      testimonials,
      giftCards,
      students,
      communities,
      communityEvents,
      communityFinances,
      communityMembers,
      alumniJobs,
      rentalAgencies,
      cars,
      posProducts,
      dailySales,
      saasProducts,
      stockItems,
      pricing,
      stages,
      applications,
      briefcase: briefcase || initialBriefcase,
      investors,
      knowledgeBase,
      cfoData,
      properties,
      solutions,
      industries,
      aiTools,
  };
};