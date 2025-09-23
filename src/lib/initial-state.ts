

import { getProducts, getStoreProducts, getServices, getProviders, getOpportunities, getClients, getTestimonials, getPricing, getPosProducts, getDailySales, getStages, getAssets, getInvestors, getProperties, getStairspaceListings, getStairspaceRequests, getLeases, getStockItems, getGiftCards, getStudents, getCommunities, getCommunityEvents, getCommunityFinances, getCommunityMembers, getAlumniJobs, getRentalAgencies, getCars, getCostSettings, getBeautyCenters, getBeautyServices, getBeautySpecialists, getBeautyAppointments, getUsedItems, getSettings, getKnowledgeBase, getApplications, getBriefcase, getSolutions, getIndustries, getAiTools, getSaasProducts, getCfoData, getStaffData, getRaahaData, getBeautyData } from './firestore';
import { initialSettings } from './settings';
import { initialBriefcase } from './briefcase';
import type { AppState as AppStateType } from './global-store';


export type AppState = AppStateType;

// This provides the default, empty state for the application.
// Actual data will be fetched by server components and passed as props.
export const getEmptyState = (): Omit<AppState, 'isClient'> => ({
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
