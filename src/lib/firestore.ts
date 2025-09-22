

'use server';

import { initialProducts, initialStoreProducts } from './products';
import { initialServices } from './services';
import { initialProviders } from './providers';
import { initialOpportunities } from './opportunities';
import { initialClients, initialTestimonials } from './clients';
import { initialPricing } from './pricing';
import { initialPosProducts, initialDailySales } from './pos-data';
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
import { initialKnowledgeBase } from './knowledge';
import { initialApplications } from './admissions-applications';
import { initialBriefcase } from './briefcase';
import { initialSolutions, initialIndustries, initialAiTools } from './nav-links';
import { saasProducts } from './saas-products';
import { initialBeautySpecialists } from './beauty-specialists';
import { initialRaahaAgencies } from './raaha-agencies';
import { initialRaahaWorkers } from './raaha-workers';
import { initialRaahaRequests } from './raaha-requests';
import { getEmptyState, type AppState } from './initial-state';

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
export const getCommunityFinances = async () => initialCommunityFinances;
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

export const getInitialState = async (): Promise<AppState> => {
    const state = getEmptyState();

    try {
        const [
            settings, products, storeProducts, providers, opportunities, services, signedLeases,
            stairspaceRequests, stairspaceListings, staffData, raahaData, beautyData,
            costSettings, assets, usedItems, clients, testimonials, giftCards, students,
            communities, communityEvents, communityFinances, communityMembers, alumniJobs,
            rentalAgencies, cars, posProducts, dailySales, saasProducts, stockItems,
            pricing, stages, applications, briefcase, investors, knowledgeBase, cfoData,
            properties, solutions, industries, aiTools
        ] = await Promise.all([
            getSettings(), getProducts(), getStoreProducts(), getProviders(), getOpportunities(),
            getServices(), getLeases(), getStairspaceRequests(), getStairspaceListings(),
            getStaffData(), getRaahaData(), getBeautyData(), getCostSettings(), getAssets(),
            getUsedItems(), getClients(), getTestimonials(), getGiftCards(), getStudents(),
            getCommunities(), getCommunityEvents(), getCommunityFinances(), getCommunityMembers(),
            getAlumniJobs(), getRentalAgencies(), getCars(), getPosProducts(), getDailySales(),
            getSaasProducts(), getStockItems(), getPricing(), getStages(), getApplications(),
            getBriefcase(), getInvestors(), getKnowledgeBase(), getCfoData(), getProperties(),
            getSolutions(), getIndustries(), getAiTools()
        ]);

        return {
            ...state,
            settings,
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
    } catch (error) {
        console.error("Failed to fetch initial state:", error);
        // Return the empty state if any of the promises fail
        return state;
    }
};
