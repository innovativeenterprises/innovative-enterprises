

'use server';

import { initialProducts, initialStoreProducts } from './products';
import { initialServices } from './services';
import { initialProviders } from './providers';
import { initialOpportunities } from './opportunities';
import { initialClients, initialTestimonials } from './clients';
import { initialPricing } from './pricing';
import { initialCanteenProducts, initialDailySales } from './pos-data';
import { initialStages } from './stages';
import { initialAssets } from './assets';
import { initialInvestors } from './investors';
import { initialCfoData } from './cfo-data';
import { initialStaffData } from './agents';
import { initialProperties } from './properties';
import { initialStairspaceListings } from './stairspace-listings';
import { initialStairspaceRequests } from './stairspace-requests';
import { initialLeases } from './leases';
import { initialStockItems } from './stock-items';
import { initialGiftCards } from './gift-cards';
import { initialStudents } from './students';
import { initialCommunities } from './communities';
import { initialEvents } from './community-events';
import { initialCommunityFinances } from './community-finances';
import { initialMembers } from './community-members';
import { initialAlumniJobs } from './alumni-jobs';
import { initialRentalAgencies } from './rental-agencies';
import { initialCars } from './cars';
import { initialCostSettings } from './cost-settings';
import { initialBeautyCenters } from './beauty-centers';
import { initialBeautyServices } from './beauty-services';
import { initialBeautyAppointments } from './beauty-appointments';
import { initialUsedItems } from './used-items';
import { initialSettings } from './settings';
import { initialKnowledgeBase } from './knowledge';
import { initialApplications } from './admissions-applications';
import { initialBriefcase } from './briefcase';
import { initialSolutions, initialIndustries, initialAiTools } from './nav-links';
import { saasProducts } from './saas-products';
import { initialBeautySpecialists } from './beauty-specialists';
import { initialRaahaAgencies } from './raaha-agencies';
import { initialRaahaWorkers } from './raaha-workers';
import { initialRaahaRequests } from './raaha-requests';
import { initialUserDocuments } from './user-documents';

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
export const getPosProducts = async () => initialCanteenProducts;
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
export const getCommunityFinances = async () => initialCommunityFinances;
export const getMembers = async () => initialMembers;
export const getAlumniJobs = async () => initialAlumniJobs;
export const getRentalAgencies = async () => initialRentalAgencies;
export const getCars = async () => initialCars;
export const getCostSettings = async () => initialCostSettings;
export const getBeautyCenters = async () => initialBeautyCenters;
export const getBeautyServices = async () => initialBeautyServices;
export const getBeautySpecialists = async () => initialBeautySpecialists;
export const getBeautyAppointments = async () => initialBeautyAppointments;
export const getUsedItems = async () => initialUsedItems;
export const getUserDocuments = async () => initialUserDocuments;

export const getSettings = async () => {
    try {
        // In a real app, this would be a Firestore call.
        // For now, we return the initial settings.
        // We add a try-catch to simulate resilient fetching.
        return initialSettings;
    } catch (error) {
        console.error("Failed to fetch settings:", error);
        return null; // Return null on error
    }
}

export const getKnowledgeBase = async () => initialKnowledgeBase;
export const getApplications = async () => initialApplications;
export const getBriefcase = async () => {
    try {
        // In a real app, this would fetch from a user-specific document in Firestore.
        // For this prototype, we'll try to get it from localStorage.
        if (typeof window !== 'undefined') {
            const savedBriefcase = localStorage.getItem('user_briefcase');
            if (savedBriefcase) {
                return JSON.parse(savedBriefcase);
            }
        }
    } catch (e) {
        console.error("Could not parse briefcase from local storage:", e);
    }
    return initialBriefcase;
};
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

export const getFirestoreData = async () => ({
    products: await getProducts(),
    storeProducts: await getStoreProducts(),
    services: await getServices(),
    providers: await getProviders(),
    opportunities: await getOpportunities(),
    clients: await getClients(),
    testimonials: await getTestimonials(),
    pricing: await getPricing(),
    posProducts: await getPosProducts(),
    dailySales: await getDailySales(),
    stages: await getStages(),
    assets: await getAssets(),
    investors: await getInvestors(),
    properties: await getProperties(),
    stairspaceListings: await getStairspaceListings(),
    stairspaceRequests: await getStairspaceRequests(),
    signedLeases: await getLeases(),
    stockItems: await getStockItems(),
    giftCards: await getGiftCards(),
    students: await getStudents(),
    communities: await getCommunities(),
    communityEvents: await getCommunityEvents(),
    communityFinances: await getCommunityFinances(),
    communityMembers: await getMembers(),
    alumniJobs: await getAlumniJobs(),
    rentalAgencies: await getRentalAgencies(),
    cars: await getCars(),
    costSettings: await getCostSettings(),
    ...await getRaahaData(),
    ...await getBeautyData(),
    settings: await getSettings(),
    knowledgeBase: await getKnowledgeBase(),
    applications: await getApplications(),
    briefcase: await getBriefcase(),
    solutions: await getSolutions(),
    industries: await getIndustries(),
    aiTools: await getAiTools(),
    saasProducts: await getSaasProducts(),
    cfoData: await getCfoData(),
    ...await getStaffData(),
    userDocuments: await getUserDocuments(),
});
