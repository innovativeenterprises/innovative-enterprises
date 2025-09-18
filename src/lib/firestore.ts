
// This file is a placeholder for your actual Firestore data fetching logic.
// In a real application, you would use the Firebase SDK to interact with Firestore.
// For this prototype, we are using static data from local files.

import { initialProducts, initialStoreProducts } from './products';
import { initialServices } from './services';
import { initialProviders } from './providers';
import { initialOpportunities } from './opportunities';
import { initialClients, initialTestimonials } from './clients';
import { initialPricing } from './pricing';
import { initialPosProducts, initialDailySales } from './pos-data';
import { initialStages } from './stages';
import { initialAssets } from './assets';
import { initialInvestors, initialCfoData } from './investors';
import { initialStaffData } from './agents';
import { initialProperties } from './properties';
import { initialStairspaceListings } from './stairspace-listings';
import { initialStairspaceRequests } from './stairspace-requests';
import { initialLeases } from './leases';
import { saasProducts } from './saas-products';
import { initialStockItems } from './stock-items';
import { initialGiftCards } from './gift-cards';
import { initialStudents } from './students';
import { initialCommunities } from './communities';
import { initialEvents } from './community-events';
import { initialFinances } from './community-finances';
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
import { initialRaahaAgencies } from './raaha-agencies';
import { initialRaahaWorkers } from './raaha-workers';
import { initialRaahaRequests } from './raaha-requests';
import type { KnowledgeDocument } from '@/lib/knowledge.schema';
import { initialKnowledgeBase } from '@/lib/knowledge';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Simulate async data fetching
export const getProducts = async () => { await delay(50); return initialProducts; };
export const getStoreProducts = async () => { await delay(50); return initialStoreProducts; };
export const getServices = async () => { await delay(50); return initialServices; };
export const getProviders = async () => { await delay(50); return initialProviders; };
export const getOpportunities = async () => { await delay(50); return initialOpportunities; };
export const getClients = async () => { await delay(50); return initialClients; };
export const getTestimonials = async () => { await delay(50); return initialTestimonials; };
export const getPricing = async () => { await delay(50); return initialPricing; };
export const getPosProducts = async () => { await delay(50); return initialPosProducts; };
export const getDailySales = async () => { await delay(50); return initialDailySales; };
export const getStages = async () => { await delay(50); return initialStages; };
export const getAssets = async () => { await delay(50); return initialAssets; };
export const getInvestors = async () => { await delay(50); return initialInvestors; };

// CFO Data
export const getKpiData = async () => { await delay(50); return initialCfoData.kpiData; };
export const getTransactionData = async () => { await delay(50); return initialCfoData.transactionData; };
export const getUpcomingPayments = async () => { await delay(50); return initialCfoData.upcomingPayments; };
export const getVatPayment = async () => { await delay(50); return initialCfoData.vatPayment; };
export const getCashFlowData = async () => { await delay(50); return initialCfoData.cashFlowData; };

export const getStaffData = async () => { await delay(50); return initialStaffData; };
export const getProperties = async () => { await delay(50); return initialProperties; };
export const getStairspaceListings = async () => { await delay(50); return initialStairspaceListings; };
export const getStairspaceRequests = async () => { await delay(50); return initialStairspaceRequests; };
export const getLeases = async () => { await delay(50); return initialLeases; };
export const getSaasProducts = async () => { await delay(50); return saasProducts; };
export const getStockItems = async () => { await delay(50); return initialStockItems; };
export const getGiftCards = async () => { await delay(50); return initialGiftCards; };
export const getStudents = async () => { await delay(50); return initialStudents; };
export const getCommunities = async () => { await delay(50); return initialCommunities; };
export const getCommunityEvents = async () => { await delay(50); return initialEvents; };
export const getCommunityFinances = async () => { await delay(50); return initialFinances; };
export const getCommunityMembers = async () => { await delay(50); return initialMembers; };
export const getAlumniJobs = async () => { await delay(50); return initialAlumniJobs; };
export const getRentalAgencies = async () => { await delay(50); return initialRentalAgencies; };
export const getCars = async () => { await delay(50); return initialCars; };
export const getCostSettings = async () => { await delay(50); return initialCostSettings; };
export const getBeautyCenters = async () => { await delay(50); return initialBeautyCenters; };
export const getBeautyServices = async () => { await delay(50); return initialBeautyServices; };
export const getBeautyAppointments = async () => { await delay(50); return initialBeautyAppointments; };
export const getUsedItems = async () => { await delay(50); return initialUsedItems; };
export const getSettings = async () => { await delay(50); return initialSettings; };
export const getKnowledgeBase = async (): Promise<KnowledgeDocument[]> => { await delay(50); return initialKnowledgeBase; };


export const getRaahaData = async () => {
    await delay(50);
    return {
        raahaAgencies: initialRaahaAgencies,
        raahaWorkers: initialRaahaWorkers,
        raahaRequests: initialRaahaRequests,
    }
}

export const getBeautyData = async () => {
    await delay(50);
    return {
        beautyCenters: initialBeautyCenters,
        beautyServices: initialBeautyServices,
        beautyAppointments: initialBeautyAppointments,
    }
}
