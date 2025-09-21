

'use server';

import * as admin from 'firebase-admin';
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


if (!admin.apps.length) {
    try {
        admin.initializeApp();
    } catch (error: any) {
        console.error('Firebase Admin Initialization Error:', error.message);
        // If initializeApp() fails, it's likely due to missing credentials.
        // The app can proceed with local data, but Firestore will be unavailable.
    }
}


const db = admin.firestore();
let isSeeding: Promise<void> | null = null;

async function seedCollection<T>(collectionName: string, data: T[]) {
    try {
        const collectionRef = db.collection(collectionName);
        const snapshot = await collectionRef.limit(1).get();
        if (snapshot.empty) {
            console.log(`Seeding '${collectionName}'...`);
            const batch = db.batch();
            data.forEach((item: any) => {
                const docRef = item.id ? collectionRef.doc(String(item.id)) : collectionRef.doc();
                batch.set(docRef, item);
            });
            await batch.commit();
            console.log(`Seeding for '${collectionName}' complete.`);
        }
    } catch (error) {
        console.warn(`Warning: Could not seed collection '${collectionName}'. Firestore may be unavailable. Error:`, (error as Error).message);
    }
}

async function seedSingleDoc<T>(docPath: string, data: T) {
    try {
        const docRef = db.doc(docPath);
        const snapshot = await docRef.get();
        if (!snapshot.exists) {
            console.log(`Seeding single document '${docPath}'...`);
            await docRef.set(data as any);
            console.log(`Seeding for '${docPath}' complete.`);
        }
    } catch (error) {
        console.warn(`Warning: Could not seed document '${docPath}'. Firestore may be unavailable. Error:`, (error as Error).message);
    }
}

async function seedDatabase() {
  if (isSeeding) {
    return isSeeding;
  }
  isSeeding = (async () => {
    try {
        await seedCollection('products', initialProducts);
        await seedCollection('storeProducts', initialStoreProducts);
        await seedCollection('services', initialServices);
        await seedCollection('providers', initialProviders);
        await seedCollection('opportunities', initialOpportunities);
        await seedCollection('clients', initialClients);
        await seedCollection('testimonials', initialTestimonials);
        await seedCollection('pricing', initialPricing);
        await seedCollection('posProducts', initialPosProducts);
        await seedCollection('dailySales', initialDailySales);
        await seedCollection('stages', initialStages);
        await seedCollection('assets', initialAssets);
        await seedCollection('investors', initialInvestors);
        await seedCollection('properties', initialProperties);
        await seedCollection('stairspaceListings', initialStairspaceListings);
        await seedCollection('stairspaceRequests', initialStairspaceRequests);
        await seedCollection('signedLeases', initialLeases);
        await seedCollection('stockItems', initialStockItems);
        await seedCollection('giftCards', initialGiftCards);
        await seedCollection('students', initialStudents);
        await seedCollection('communities', initialCommunities);
        await seedCollection('communityEvents', initialEvents);
        await seedCollection('communityFinances', initialFinances);
        await seedCollection('communityMembers', initialMembers);
        await seedCollection('alumniJobs', initialAlumniJobs);
        await seedCollection('rentalAgencies', initialRentalAgencies);
        await seedCollection('cars', initialCars);
        await seedCollection('costSettings', initialCostSettings);
        await seedCollection('beautyCenters', initialBeautyCenters);
        await seedCollection('beautyServices', initialBeautyServices);
        await seedCollection('beautyAppointments', initialBeautyAppointments);
        await seedCollection('usedItems', initialUsedItems);
        await seedCollection('knowledgeBase', initialKnowledgeBase);
        await seedCollection('applications', initialApplications);
        await seedCollection('solutions', initialSolutions);
        await seedCollection('industries', initialIndustries);
        await seedCollection('aiTools', initialAiTools);

        await seedSingleDoc('site/settings', initialSettings);
        await seedSingleDoc('cfo/dashboard', initialCfoData);
        await seedSingleDoc('singleton/briefcase', initialBriefcase);
        
        const staffRef = db.collection('staff');
        const staffSnapshot = await staffRef.limit(1).get();
        if(staffSnapshot.empty) {
             console.log(`Seeding 'staff'...`);
             const batch = db.batch();
             initialStaffData.leadership.forEach(item => batch.set(staffRef.doc(), item));
             initialStaffData.staff.forEach(item => batch.set(staffRef.doc(), item));
             initialStaffData.agentCategories.forEach(cat => {
                 cat.agents.forEach(agent => {
                     const agentWithCategory = {...agent, category: cat.category };
                     batch.set(staffRef.doc(), agentWithCategory)
                 });
             });
             await batch.commit();
        }

    } catch (error) {
        console.error("Error seeding database:", error);
    }
  })();
  return isSeeding;
}

async function getCollection<T>(collectionName: string, fallbackData: T[]): Promise<T[]> {
  try {
    await seedDatabase();
    const snapshot = await db.collection(collectionName).get();
    if (snapshot.empty) return fallbackData;
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as T));
  } catch (error) {
      console.warn(`Warning: Could not fetch collection '${collectionName}'. Returning initial data. Error:`, (error as Error).message);
      // Fallback to initial data if Firestore fails
      return fallbackData;
  }
}

async function getDoc<T>(docPath: string, fallbackData: T): Promise<T> {
    try {
        await seedDatabase();
        const docRef = db.doc(docPath);
        const snapshot = await docRef.get();
        if (snapshot.exists) {
            return snapshot.data() as T;
        }
        return fallbackData;
    } catch (error) {
        console.warn(`Warning: Could not fetch document '${docPath}'. Returning initial data. Error:`, (error as Error).message);
        return fallbackData;
    }
}

export const getProducts = async () => getCollection<Product>('products', initialProducts);
export const getStoreProducts = async () => getCollection<Product>('storeProducts', initialStoreProducts);
export const getServices = async () => getCollection<Service>('services', initialServices);
export const getProviders = async () => getCollection<Provider>('providers', initialProviders);
export const getOpportunities = async () => getCollection<Opportunity>('opportunities', initialOpportunities);
export const getClients = async () => getCollection<any>('clients', initialClients);
export const getTestimonials = async () => getCollection<any>('testimonials', initialTestimonials);
export const getPricing = async (): Promise<Pricing[]> => getCollection<Pricing>('pricing', initialPricing);
export const getPosProducts = async () => getCollection<any>('posProducts', initialPosProducts);
export const getDailySales = async () => getCollection<any>('dailySales', initialDailySales);
export const getStages = async () => getCollection<any>('stages', initialStages);
export const getAssets = async () => getCollection<any>('assets', initialAssets);
export const getInvestors = async () => getCollection<any>('investors', initialInvestors);
export const getKpiData = async () => (await getDoc<any>('cfo/dashboard', initialCfoData))?.kpiData || [];
export const getTransactionData = async () => (await getDoc<any>('cfo/dashboard', initialCfoData))?.transactionData || [];
export const getUpcomingPayments = async () => (await getDoc<any>('cfo/dashboard', initialCfoData))?.upcomingPayments || [];
export const getVatPayment = async () => (await getDoc<any>('cfo/dashboard', initialCfoData))?.vatPayment || {};
export const getCashFlowData = async () => (await getDoc<any>('cfo/dashboard', initialCfoData))?.cashFlowData || [];
export const getProperties = async () => getCollection<any>('properties', initialProperties);
export const getStairspaceListings = async () => getCollection<any>('stairspaceListings', initialStairspaceListings);
export const getStairspaceRequests = async () => getCollection<any>('stairspaceRequests', initialStairspaceRequests);
export const getLeases = async () => getCollection<any>('signedLeases', initialLeases);
export const getStockItems = async () => getCollection<any>('stockItems', initialStockItems);
export const getGiftCards = async () => getCollection<any>('giftCards', initialGiftCards);
export const getStudents = async () => getCollection<any>('students', initialStudents);
export const getCommunities = async () => getCollection<any>('communities', initialCommunities);
export const getCommunityEvents = async () => getCollection<any>('communityEvents', initialEvents);
export const getCommunityFinances = async () => getCollection<any>('communityFinances', initialFinances);
export const getCommunityMembers = async () => getCollection<any>('communityMembers', initialMembers);
export const getAlumniJobs = async () => getCollection<any>('alumniJobs', initialAlumniJobs);
export const getRentalAgencies = async () => getCollection<any>('rentalAgencies', initialRentalAgencies);
export const getCars = async () => getCollection<any>('cars', initialCars);
export const getCostSettings = async () => getCollection<any>('costSettings', initialCostSettings);
export const getBeautyCenters = async () => getCollection<any>('beautyCenters', initialBeautyCenters);
export const getBeautyServices = async () => getCollection<any>('beautyServices', initialBeautyServices);
export const getBeautyAppointments = async () => getCollection<any>('beautyAppointments', initialBeautyAppointments);
export const getUsedItems = async () => getCollection<any>('usedItems', initialUsedItems);
export const getSettings = async () => getDoc<any>('site/settings', initialSettings);
export const getKnowledgeBase = async () => getCollection<any>('knowledgeBase', initialKnowledgeBase);
export const getApplications = async () => getCollection<any>('applications', initialApplications);
export const getBriefcase = async () => getDoc<any>('singleton/briefcase', initialBriefcase);
export const getSolutions = async () => getCollection<any>('solutions', initialSolutions);
export const getIndustries = async () => getCollection<any>('industries', initialIndustries);
export const getAiTools = async () => getCollection<any>('aiTools', initialAiTools);

export const getCfoData = async () => {
    const data = await getDoc<any>('cfo/dashboard', initialCfoData);
    return data || initialCfoData;
};

export const getStaff = async () => getCollection<any>('staff', [...initialStaffData.leadership, ...initialStaffData.staff, ...initialStaffData.agentCategories.flatMap(c => c.agents)]);

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
  await seedDatabase();
  return {
    raahaAgencies: await getCollection<any>('raahaAgencies', initialRaahaAgencies),
    raahaWorkers: await getCollection<any>('raahaWorkers', initialRaahaWorkers),
    raahaRequests: await getCollection<any>('raahaRequests', initialRaahaRequests),
  }
}
export const getBeautyData = async () => {
    await seedDatabase();
    return {
        beautyCenters: await getCollection<any>('beautyCenters', initialBeautyCenters),
        beautyServices: await getCollection<any>('beautyServices', initialBeautyServices),
        beautyAppointments: await getCollection<any>('beautyAppointments', initialBeautyAppointments),
    }
};

// Server actions to update data
export async function setFirestoreCollection(collectionName: string, data: any[]) {
    try {
        await seedDatabase();
        const collectionRef = db.collection(collectionName);
        const snapshot = await collectionRef.get();
        const batch = db.batch();

        // Delete existing documents
        snapshot.docs.forEach(doc => {
            batch.delete(doc.ref);
        });
        
        // Add new documents
        data.forEach(item => {
            const docRef = item.id ? collectionRef.doc(String(item.id)) : collectionRef.doc();
            batch.set(docRef, item);
        });

        await batch.commit();
    } catch(e) {
        console.error("Firestore update failed:", (e as Error).message);
    }
}
