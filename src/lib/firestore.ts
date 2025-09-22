
'use server';

import { initialProducts, initialStoreProducts, saasProducts } from '@/lib/products';
import { initialServices } from '@/lib/services';
import { initialProviders } from '@/lib/providers';
import { initialOpportunities } from '@/lib/opportunities';
import { initialClients, initialTestimonials } from '@/lib/clients';
import { initialPricing } from '@/lib/pricing';
import { initialPosProducts, initialDailySales } from '@/lib/pos-data';
import { initialStages } from '@/lib/stages';
import { initialAssets } from '@/lib/assets';
import { initialInvestors } from '@/lib/investors';
import { initialCfoData } from '@/lib/cfo-data';
import { initialStaffData } from '@/lib/agents';
import { initialProperties } from '@/lib/properties';
import { initialStairspaceListings } from '@/lib/stairspace-listings';
import { initialStairspaceRequests } from '@/lib/stairspace-requests';
import { initialLeases } from '@/lib/leases';
import { initialStockItems } from '@/lib/stock-items';
import { initialGiftCards } from '@/lib/gift-cards';
import { initialStudents } from '@/lib/students';
import { initialCommunities } from '@/lib/communities';
import { initialEvents } from '@/lib/community-events';
import { initialFinances } from '@/lib/community-finances';
import { initialMembers } from '@/lib/community-members';
import { initialAlumniJobs } from '@/lib/alumni-jobs';
import { initialRentalAgencies } from '@/lib/rental-agencies';
import { initialCars } from '@/lib/cars';
import { initialCostSettings } from '@/lib/cost-settings';
import { initialBeautyCenters } from '@/lib/beauty-centers';
import { initialBeautyServices } from '@/lib/beauty-services';
import { initialBeautyAppointments } from '@/lib/beauty-appointments';
import { initialUsedItems } from '@/lib/used-items';
import { initialSettings } from '@/lib/settings';
import { initialKnowledgeBase } from '@/lib/knowledge';
import { initialApplications } from '@/lib/admissions-applications';
import { initialBriefcase } from '@/lib/briefcase';
import { initialSolutions, initialIndustries, initialAiTools } from '@/lib/nav-links';
import { initialBeautySpecialists } from '@/lib/beauty-specialists';
import { getInitialState } from '@/lib/initial-state';
import { initialRaahaAgencies } from '@/lib/raaha-agencies';
import { initialRaahaWorkers } from '@/lib/raaha-workers';
import { initialRaahaRequests } from '@/lib/raaha-requests';

// This file simulates fetching data from a database.
// In a real application, you would replace these with actual Firestore queries.

export const getProducts = async () => initialProducts;
export const getStoreProducts = async () => initialStoreProducts;
export const getServices = async () => initialServices;
export const getProviders = async () => initialProviders;
export const getOpportunities = async () => initialOpportunities;
export const getClients = async () => initialClients;
export const getTestimonials = async () => initialTestimonials;
export const getPricing = async () => initialPricing;
export const getPosProducts = async () => initialPosProducts;
export const getDailySales = async () => initialDailySales;
export const getStages = async () => initialStages;
export const getAssets = async () => initialAssets;
export const getInvestors = async () => initialInvestors;
export const getProperties = async () => initialProperties;
export const getStairspaceListings = async () => initialStairspaceListings;
export const getStairspaceRequests = async () => initialStairspaceRequests;
export const getLeases = async () => initialLeases;
export const getStockItems = async () => initialStockItems;
export const getGiftCards = async () => initialGiftCards;
export const getStudents = async () => initialStudents;
export const getCommunities = async () => initialCommunities;
export const getCommunityEvents = async () => initialEvents;
export const getCommunityFinances = async () => initialFinances;
export const getCommunityMembers = async () => initialMembers;
export const getAlumniJobs = async () => initialAlumniJobs;
export const getRentalAgencies = async () => initialRentalAgencies;
export const getCars = async () => initialCars;
export const getCostSettings = async () => initialCostSettings;
export const getBeautyCenters = async () => initialBeautyCenters;
export const getBeautyServices = async () => initialBeautyServices;
export const getBeautySpecialists = async () => initialBeautySpecialists;
export const getBeautyAppointments = async () => initialBeautyAppointments;
export const getUsedItems = async () => initialUsedItems;
export const getSettings = async () => initialSettings;
export const getKnowledgeBase = async () => initialKnowledgeBase;
export const getApplications = async () => initialApplications;
export const getBriefcase = async () => initialBriefcase;
export const getSolutions = async () => initialSolutions;
export const getIndustries = async () => initialIndustries;
export const getAiTools = async () => initialAiTools;
export const getSaasProducts = async () => saasProducts;
export const getCfoData = async () => initialCfoData;

export const getStaffData = async () => {
    return {
        leadership: initialStaffData.leadership,
        staff: initialStaffData.staff,
        agentCategories: initialStaffData.agentCategories,
    };
};

export const getRaahaData = async () => {
  return {
    raahaAgencies: initialRaahaAgencies,
    raahaWorkers: initialRaahaWorkers,
    raahaRequests: initialRaahaRequests,
  }
}
export const getBeautyData = async () => {
    return {
        beautyCenters: initialBeautyCenters,
        beautyServices: initialBeautyServices,
        beautyAppointments: initialBeautyAppointments,
        beautySpecialists: initialBeautySpecialists,
    }
};

export { getInitialState };
