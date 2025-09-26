
'use server';

import { initialProducts, initialStoreProducts } from './products';
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
import type { Service } from "./services.schema";

// This file simulates fetching data from a database.
// In a real application, you would replace these with actual Firestore queries.

const initialServices: Service[] = [
  {
    title: "Synergy AI",
    description: "Leverage AI to automate processes, gain insights, and create intelligent products and agents.",
    icon: 'Bot',
    category: "AI Powered & Automation",
    enabled: true,
    href: '/automation'
  },
  {
    title: "Orion Cloud",
    description: "Scalable and secure cloud infrastructure solutions to power your business.",
    icon: 'Cloud',
    category: "Digital Transformations",
    enabled: true,
    href: '/services/cloud'
  },
  {
    title: "Aegis Security",
    description: "Protect your digital assets with our comprehensive cybersecurity services.",
    icon: 'Shield',
    category: "Digital Transformations",
    enabled: true,
    href: '/services/cybersecurity'
  },
  {
    title: "Business Hub",
    description: "A B2B and B2C marketplace to connect with other businesses and clients for services and job opportunities.",
    icon: 'Handshake',
    category: "Business Tech Solutions",
    enabled: true,
    href: '/business-hub'
  },
  {
    title: "Sanad Hub Platform",
    description: "A digital gateway connecting users with Sanad Service Centres across Oman for task delegation and service bidding.",
    icon: 'Briefcase',
    category: "Business Tech Solutions",
    enabled: true,
    href: '/sanad-hub'
  },
  {
    title: "Tender Response Assistant",
    description: "Let our AI analyze tender documents and generate a comprehensive, professional draft response in minutes.",
    icon: 'FileText',
    category: "AI Powered & Automation",
    enabled: true,
    href: '/tender-assistant'
  },
  {
    title: "Smart Project Management",
    description: "AI-based scheduling, resource allocation, and real-time collaboration for your most complex projects.",
    icon: 'GanttChartSquare',
    category: "AI Powered & Automation",
    enabled: false,
    href: '#'
  },
  {
    title: "InfraRent",
    description: "On-demand rental of IT equipment like servers, workstations, and networking gear for events and projects.",
    icon: 'Server',
    category: "Business Tech Solutions",
    enabled: true,
    href: '/construction-tech/asset-rentals'
  },
];


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

