
'use server';

import type { AppState } from './initial-state';
import {
    getProducts, getStoreProducts, getServices, getProviders, getOpportunities,
    getClients, getTestimonials, getPricing, getPosProducts, getDailySales, getStages,
    getAssets, getInvestors, getProperties, getStairspaceListings, getStairspaceRequests,
    getLeases, getStockItems, getGiftCards, getStudents, getCommunities,
    getCommunityEvents, getCommunityFinances, getCommunityMembers, getAlumniJobs,
    getRentalAgencies, getCars, getCostSettings, getBeautyCenters, getBeautyServices,
    getBeautySpecialists, getBeautyAppointments, getUsedItems, getSettings,
    getKnowledgeBase, getApplications, getBriefcase, getSolutions, getIndustries,
    getAiTools, getSaasProducts, getCfoData, getStaffData, getRaahaData, getBeautyData
} from './firestore';

export async function getInitialState(): Promise<AppState | null> {
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
            isClient: false,
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
            briefcase,
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
        return null;
    }
}
