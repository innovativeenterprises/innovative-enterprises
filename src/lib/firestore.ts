
// This file is a placeholder for your actual Firestore data fetching logic.
// In a real application, you would use the Firebase SDK to interact with Firestore.
// For this prototype, we are using a global store to simulate a database.

import { store } from './global-store';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Simulate async data fetching by getting data from the global store
export const getProducts = async () => { await delay(50); return store.get().products; };
export const getStoreProducts = async () => { await delay(50); return store.get().storeProducts; };
export const getServices = async () => { await delay(50); return store.get().services; };
export const getProviders = async () => { await delay(50); return store.get().providers; };
export const getOpportunities = async () => { await delay(50); return store.get().opportunities; };
export const getClients = async () => { await delay(50); return store.get().clients; };
export const getTestimonials = async () => { await delay(50); return store.get().testimonials; };
export const getPricing = async () => { await delay(50); return store.get().pricing; };
export const getPosProducts = async () => { await delay(50); return store.get().posProducts; };
export const getDailySales = async () => { await delay(50); return store.get().dailySales; };
export const getStages = async () => { await delay(50); return store.get().stages; };
export const getAssets = async () => { await delay(50); return store.get().assets; };
export const getInvestors = async () => { await delay(50); return store.get().investors; };

// CFO Data from the global store
export const getKpiData = async () => { await delay(50); return store.get().cfoData.kpiData; };
export const getTransactionData = async () => { await delay(50); return store.get().cfoData.transactionData; };
export const getUpcomingPayments = async () => { await delay(50); return store.get().cfoData.upcomingPayments; };
export const getVatPayment = async () => { await delay(50); return store.get().cfoData.vatPayment; };
export const getCashFlowData = async () => { await delay(50); return store.get().cfoData.cashFlowData; };

export const getStaffData = async () => { 
    await delay(50);
    const state = store.get();
    return {
        leadership: state.leadership,
        staff: state.staff,
        agentCategories: state.agentCategories,
    };
};
export const getProperties = async () => { await delay(50); return store.get().properties; };
export const getStairspaceListings = async () => { await delay(50); return store.get().stairspaceListings; };
export const getStairspaceRequests = async () => { await delay(50); return store.get().stairspaceRequests; };
export const getLeases = async () => { await delay(50); return store.get().signedLeases; };
export const getSaasProducts = async () => { await delay(50); return store.get().saasProducts; };
export const getStockItems = async () => { await delay(50); return store.get().stockItems; };
export const getGiftCards = async () => { await delay(50); return store.get().giftCards; };
export const getStudents = async () => { await delay(50); return store.get().students; };
export const getCommunities = async () => { await delay(50); return store.get().communities; };
export const getCommunityEvents = async () => { await delay(50); return store.get().communityEvents; };
export const getCommunityFinances = async () => { await delay(50); return store.get().communityFinances; };
export const getCommunityMembers = async () => { await delay(50); return store.get().communityMembers; };
export const getAlumniJobs = async () => { await delay(50); return store.get().alumniJobs; };
export const getRentalAgencies = async () => { await delay(50); return store.get().rentalAgencies; };
export const getCars = async () => { await delay(50); return store.get().cars; };
export const getCostSettings = async () => { await delay(50); return store.get().costSettings; };
export const getBeautyCenters = async () => { await delay(50); return store.get().beautyCenters; };
export const getBeautyServices = async () => { await delay(50); return store.get().beautyServices; };
export const getBeautyAppointments = async () => { await delay(50); return store.get().beautyAppointments; };
export const getUsedItems = async () => { await delay(50); return store.get().usedItems; };
export const getSettings = async () => { await delay(50); return store.get().settings; };
export const getKnowledgeBase = async () => { await delay(50); return store.get().knowledgeBase; };
export const getApplications = async () => { await delay(50); return store.get().applications; };
export const getBriefcase = async () => { await delay(50); return store.get().briefcase; };


export const getRaahaData = async () => {
    await delay(50);
    const state = store.get();
    return {
        raahaAgencies: state.raahaAgencies,
        raahaWorkers: state.raahaWorkers,
        raahaRequests: state.raahaRequests,
    }
}

export const getBeautyData = async () => {
    await delay(50);
    const state = store.get();
    return {
        beautyCenters: state.beautyCenters,
        beautyServices: state.beautyServices,
        beautyAppointments: state.beautyAppointments,
    }
}
