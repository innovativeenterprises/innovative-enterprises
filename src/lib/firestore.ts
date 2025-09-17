
import { initializeApp, getApp, getApps } from 'firebase/app';
import { getFirestore, collection, getDocs, query, orderBy, doc, getDoc } from 'firebase/firestore';
import type { Product } from './products.schema';
import type { Service } from './services.schema';
import type { Provider } from './providers.schema';
import type { Opportunity } from './opportunities.schema';
import type { Client, Testimonial } from './clients.schema';
import type { Pricing } from './pricing.schema';
import type { PosProduct, DailySales } from './pos-data.schema';
import type { ProjectStage } from './stages.schema';
import type { Asset } from './assets.schema';
import type { Investor } from './investors.schema';
import type { KpiData, TransactionData, UpcomingPayment, VatPayment, CashFlowData } from './cfo-data.schema';
import type { Agent, AgentCategory } from './agents.schema';
import type { Property } from './properties.schema';
import type { StairspaceListing } from './stairspace.schema';
import type { BookingRequest } from './stairspace-requests.schema';
import type { SignedLease } from './leases.schema';
import type { SaasCategory } from './saas-products.schema';
import type { StockItem } from './stock-items.schema';
import type { GiftCard } from './gift-cards.schema';
import type { Student } from './students.schema';
import type { Community } from './communities.schema';
import type { CommunityEvent } from './community-events.schema';
import type { CommunityFinance } from './community-finances.schema';
import type { CommunityMember } from './community-members.schema';
import type { JobPosting } from './alumni-jobs.schema';
import type { RentalAgency } from './rental-agencies.schema';
import type { Car } from './cars.schema';
import type { CostRate } from './cost-settings.schema';
import type { BeautyCenter } from './beauty-centers.schema';
import type { BeautyService } from './beauty-services.schema';
import type { BeautyAppointment } from './beauty-appointments.schema';
import type { UsedItem } from './used-items.schema';
import type { AppSettings } from './settings';
import { app } from './firebase';


const db = getFirestore(app);

const fetchCollection = async <T>(collectionName: string): Promise<T[]> => {
    try {
        const collectionRef = collection(db, collectionName);
        const snapshot = await getDocs(collectionRef);
        return snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }) as T);
    } catch (error) {
        console.error(`Error fetching ${collectionName}:`, error);
        return [];
    }
};

export const getProducts = () => fetchCollection<Product>('products');
export const getServices = () => fetchCollection<Service>('services');
export const getProviders = () => fetchCollection<Provider>('providers');
export const getOpportunities = () => fetchCollection<Opportunity>('opportunities');
export const getClients = () => fetchCollection<Client>('clients');
export const getTestimonials = () => fetchCollection<Testimonial>('testimonials');
export const getPricing = () => fetchCollection<Pricing>('pricing');
export const getPosProducts = () => fetchCollection<PosProduct>('posProducts');
export const getStages = () => fetchCollection<ProjectStage>('stages');
export const getAssets = () => fetchCollection<Asset>('assets');
export const getInvestors = () => fetchCollection<Investor>('investors');
export const getKpiData = () => fetchCollection<KpiData>('kpiData');
export const getTransactionData = () => fetchCollection<TransactionData>('transactionData');
export const getUpcomingPayments = () => fetchCollection<UpcomingPayment>('upcomingPayments');
export const getVatPayment = async (): Promise<VatPayment | null> => {
    const data = await fetchCollection<VatPayment>('vatPayment');
    return data[0] || null;
};
export const getCashFlowData = () => fetchCollection<CashFlowData>('cashFlowData');
export const getStaffData = async (): Promise<{ leadership: Agent[], staff: Agent[], agentCategories: AgentCategory[] }> => {
    const leadership = await fetchCollection<Agent>('leadership');
    const staff = await fetchCollection<Agent>('staff');
    const agentCategories = await fetchCollection<AgentCategory>('agentCategories');
    return { leadership, staff, agentCategories };
};
export const getProperties = () => fetchCollection<Property>('properties');
export const getStairspaceListings = () => fetchCollection<StairspaceListing>('stairspaceListings');
export const getStairspaceRequests = () => fetchCollection<BookingRequest>('stairspaceRequests');
export const getLeases = () => fetchCollection<SignedLease>('signedLeases');
export const getSaasProducts = () => fetchCollection<SaasCategory>('saasProducts');
export const getStockItems = () => fetchCollection<StockItem>('stockItems');
export const getGiftCards = () => fetchCollection<GiftCard>('giftCards');
export const getStudents = () => fetchCollection<Student>('students');
export const getCommunities = () => fetchCollection<Community>('communities');
export const getCommunityEvents = () => fetchCollection<CommunityEvent>('communityEvents');
export const getCommunityFinances = () => fetchCollection<CommunityFinance>('communityFinances');
export const getCommunityMembers = () => fetchCollection<CommunityMember>('communityMembers');
export const getAlumniJobs = () => fetchCollection<JobPosting>('alumniJobs');
export const getRentalAgencies = () => fetchCollection<RentalAgency>('rentalAgencies');
export const getCars = () => fetchCollection<Car>('cars');
export const getCostSettings = () => fetchCollection<CostRate>('costSettings');
export const getBeautyCenters = () => fetchCollection<BeautyCenter>('beautyCenters');
export const getBeautyServices = () => fetchCollection<BeautyService>('beautyServices');
export const getBeautyAppointments = () => fetchCollection<BeautyAppointment>('beautyAppointments');
export const getUsedItems = () => fetchCollection<UsedItem>('usedItems');
export const getDailySales = () => fetchCollection<any>('dailySales');

export const getSettings = async (): Promise<AppSettings> => {
    try {
        const docRef = doc(db, 'settings', 'app');
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            return docSnap.data() as AppSettings;
        } else {
            console.log("No such document! Returning initial settings.");
            // In a real app, you might want to initialize this document if it doesn't exist.
            // For now, we'll fall back to a static default.
            const { initialSettings } = await import('./settings');
            return initialSettings;
        }
    } catch (error) {
        console.error("Error fetching settings:", error);
         const { initialSettings } = await import('./settings');
        return initialSettings;
    }
};
