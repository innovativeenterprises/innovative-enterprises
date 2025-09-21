
'use server';

// This file is now configured to use local initial data instead of Firestore.
// This ensures the application can run without needing live database credentials,
// which is ideal for development and prototyping.

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
import type { Product } from './products.schema';
import type { Service } from './services.schema';
import type { Provider } from './providers.schema';
import type { Opportunity } from './opportunities.schema';
import type { Client, Testimonial } from './clients.schema';
import type { Pricing } from './pricing.schema';

// All `get` functions now return the initial data directly.

export const getProducts = async () => initialProducts;
export const getStoreProducts = async () => initialStoreProducts;
export const getServices = async () => initialServices;
export const getProviders = async () => initialProviders;
export const getOpportunities = async () => initialOpportunities;
export const getClients = async () => initialClients;
export const getTestimonials = async () => initialTestimonials;
export const getPricing = async (): Promise<Pricing[]> => initialPricing;
export const getPosProducts = async () => initialPosProducts;
export const getDailySales = async () => initialDailySales;
export const getStages = async () => initialStages;
export const getAssets = async () => initialAssets;
export const getInvestors = async () => initialInvestors;
export const getKpiData = async () => initialCfoData.kpiData;
export const getTransactionData = async () => initialCfoData.transactionData;
export const getUpcomingPayments = async () => initialCfoData.upcomingPayments;
export const getVatPayment = async () => initialCfoData.vatPayment;
export const getCashFlowData = async () => initialCfoData.cashFlowData;
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
export const getBeautyAppointments = async () => initialBeautyAppointments;
export const getUsedItems = async () => initialUsedItems;
export const getSettings = async () => initialSettings;
export const getKnowledgeBase = async () => initialKnowledgeBase;
export const getApplications = async () => initialApplications;
export const getBriefcase = async () => initialBriefcase;
export const getSolutions = async () => initialSolutions;
export const getIndustries = async () => initialIndustries;
export const getAiTools = async () => initialAiTools;

export const getCfoData = async () => {
    return initialCfoData;
};

export const getStaff = async () => [...initialStaffData.leadership, ...initialStaffData.staff, ...initialStaffData.agentCategories.flatMap(c => c.agents)];

export const getStaffData = async () => {
    const allStaff = await getStaff();
    const leadership = allStaff.filter(s => s.type === 'Leadership');
    const staff = allStaff.filter(s => s.type === 'Staff');
    const agents = allStaff.filter(s => s.type === 'AI Agent');

    const agentCategories = agents.reduce((acc, agent) => {
        const category = agent.category || 'Uncategorized';
        if (!acc[category]) {
            acc[category] = { category, agents: [] };
        }
        acc[category].agents.push(agent);
        return acc;
    }, {} as Record<string, any>);
    
    return {
        leadership,
        staff,
        agentCategories: Object.values(agentCategories)
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
    }
};
