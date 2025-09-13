

'use client';

import { useSyncExternalStore } from 'react';
import { store } from '@/lib/global-store';
import type { Service } from '@/lib/services';
import type { Product } from '@/lib/products';
import type { Client, Testimonial } from '@/lib/clients';
import type { Provider } from '@/lib/providers';
import { type Agent, type AgentCategory } from '@/lib/agents';
import type { Community } from '@/lib/communities';
import type { CommunityEvent } from '@/lib/community-events';
import type { CommunityFinance } from '@/lib/community-finances';
import type { CommunityMember } from '@/lib/community-members';
import type { Opportunity } from '@/lib/opportunities';
import type { ProjectStage } from '@/lib/stages';
import type { AppSettings } from '@/lib/settings';
import type { Asset } from '@/lib/assets';
import type { Investor } from '@/lib/investors';
import type { KnowledgeDocument } from '@/lib/knowledge';
import type { Agency } from '@/lib/raaha-agencies';
import type { HireRequest } from '@/lib/raaha-requests';
import type { Worker as RaahaWorker } from '@/lib/raaha-workers';
import type { SignedLease } from '@/lib/leases';
import type { Property } from '@/lib/properties';
import type { StairspaceListing } from '@/lib/stairspace.schema';
import type { BookingRequest as StairspaceRequest } from '@/lib/stairspace-requests';
import type { BoQItem } from '@/ai/flows/boq-generator.schema';
import type { CostRate } from '@/lib/cost-settings.schema';
import type { Student } from '@/lib/students';
import type { KpiData, TransactionData, UpcomingPayment, VatPayment, CashFlowData } from '@/lib/cfo-data';
import type { Pricing } from '@/lib/pricing';


function useStoreData<T>(selector: (state: any) => T): T {
    const state = useSyncExternalStore(store.subscribe, () => selector(store.get()), () => selector(store.get()));
    return state;
}

// --- Standalone, stable setter functions ---
export const setServices = (updater: (prev: Service[]) => Service[]) => store.set(state => ({ ...state, services: updater(state.services) }));
export const setProducts = (updater: (prev: Product[]) => Product[]) => store.set(state => ({ ...state, products: updater(state.products) }));
export const setClients = (updater: (prev: Client[]) => Client[]) => store.set(state => ({ ...state, clients: updater(state.clients) }));
export const setTestimonials = (updater: (prev: Testimonial[]) => Testimonial[]) => store.set(state => ({ ...state, testimonials: updater(state.testimonials) }));
export const setProviders = (updater: (prev: Provider[]) => Provider[]) => store.set(state => ({ ...state, providers: updater(state.providers) }));
export const setLeadership = (updater: (prev: Agent[]) => Agent[]) => store.set(state => ({ ...state, leadership: updater(state.leadership) }));
export const setStaff = (updater: (prev: Agent[]) => Agent[]) => store.set(state => ({ ...state, staff: updater(state.staff) }));
export const setAgentCategories = (updater: (prev: AgentCategory[]) => AgentCategory[]) => store.set(state => ({ ...state, agentCategories: updater(state.agentCategories) }));
export const setCommunities = (updater: (prev: Community[]) => Community[]) => store.set(state => ({ ...state, communities: updater(state.communities) }));
export const setCommunityEvents = (updater: (prev: CommunityEvent[]) => CommunityEvent[]) => store.set(state => ({ ...state, communityEvents: updater(state.communityEvents) }));
export const setCommunityFinances = (updater: (prev: CommunityFinance[]) => CommunityFinance[]) => store.set(state => ({ ...state, communityFinances: updater(state.communityFinances) }));
export const setCommunityMembers = (updater: (prev: CommunityMember[]) => CommunityMember[]) => store.set(state => ({ ...state, communityMembers: updater(state.communityMembers) }));
export const setOpportunities = (updater: (prev: Opportunity[]) => Opportunity[]) => store.set(state => ({ ...state, opportunities: updater(state.opportunities) }));
export const setStages = (updater: (prev: ProjectStage[]) => ProjectStage[]) => store.set(state => ({ ...state, stages: updater(state.stages) }));
export const setSettings = (updater: (prev: AppSettings) => AppSettings) => store.set(state => ({ ...state, settings: updater(state.settings) }));
export const setAssets = (updater: (prev: Asset[]) => Asset[]) => store.set(state => ({ ...state, assets: updater(state.assets) }));
export const setInvestors = (updater: (prev: Investor[]) => Investor[]) => store.set(state => ({ ...state, investors: updater(state.investors) }));
export const setKnowledgeBase = (updater: (prev: KnowledgeDocument[]) => KnowledgeDocument[]) => store.set(state => ({ ...state, knowledgeBase: updater(state.knowledgeBase) }));
export const setRaahaAgencies = (updater: (prev: Agency[]) => Agency[]) => store.set(state => ({ ...state, raahaAgencies: updater(state.raahaAgencies) }));
export const setRaahaWorkers = (updater: (prev: RaahaWorker[]) => RaahaWorker[]) => store.set(state => ({ ...state, raahaWorkers: updater(state.raahaWorkers) }));
export const setRaahaRequests = (updater: (prev: HireRequest[]) => HireRequest[]) => store.set(state => ({ ...state, raahaRequests: updater(state.raahaRequests) }));
export const setSignedLeases = (updater: (prev: SignedLease[]) => SignedLease[]) => store.set(state => ({ ...state, signedLeases: updater(state.signedLeases) }));
export const setProperties = (updater: (prev: Property[]) => Property[]) => store.set(state => ({ ...state, properties: updater(state.properties) }));
export const setStairspaceListings = (updater: (prev: StairspaceListing[]) => StairspaceListing[]) => store.set(state => ({ ...state, stairspaceListings: updater(state.stairspaceListings) }));
export const setStairspaceRequests = (updater: (prev: StairspaceRequest[]) => StairspaceRequest[]) => store.set(state => ({ ...state, stairspaceRequests: updater(state.stairspaceRequests) }));
export const setCostSettings = (updater: (prev: CostRate[]) => CostRate[]) => store.set(state => ({...state, costSettings: updater(state.costSettings)}));
export const setPricing = (updater: (prev: Pricing[]) => Pricing[]) => store.set(state => ({...state, pricing: updater(state.pricing)}));
export const setStudents = (updater: (prev: Student[]) => Student[]) => store.set(state => ({...state, students: updater(state.students)}));


// --- Data Hooks ---
export const useServicesData = () => ({ services: useStoreData(state => state.services), isClient: true });
export const useProductsData = () => ({ products: useStoreData(state => state.products), isClient: true });
export const useClientsData = () => ({ clients: useStoreData(state => state.clients), testimonials: useStoreData(state => state.testimonials), isClient: true });
export const useProvidersData = () => ({ providers: useStoreData(state => state.providers), isClient: true });
export const useStaffData = () => ({ leadership: useStoreData(state => state.leadership), staff: useStoreData(state => state.staff), agentCategories: useStoreData(state => state.agentCategories), isClient: true });
export const useCommunitiesData = () => ({ communities: useStoreData(state => state.communities), isClient: true });
export const useCommunityHubData = () => ({ events: useStoreData(state => state.communityEvents), finances: useStoreData(state => state.communityFinances), isClient: true });
export const useMembersData = () => ({ members: useStoreData(state => state.communityMembers), isClient: true });
export const useProjectStagesData = () => ({ stages: useStoreData(state => state.stages), isClient: true });
export const useSettingsData = () => ({ settings: useStoreData(state => state.settings), isClient: true });
export const useAssetsData = () => ({ assets: useStoreData(state => state.assets), isClient: true });
export const useInvestorsData = () => ({ investors: useStoreData(state => state.investors), isClient: true });
export const useKnowledgeData = () => ({ knowledgeBase: useStoreData(state => state.knowledgeBase), isClient: true });
export const useAgenciesData = () => ({ agencies: useStoreData(state => state.raahaAgencies), isClient: true });
export const useWorkersData = () => ({ workers: useStoreData(state => state.raahaWorkers), isClient: true });
export const useRequestsData = () => ({ requests: useStoreData(state => state.raahaRequests), isClient: true });
export const useLeasesData = () => ({ leases: useStoreData(state => state.signedLeases), isClient: true });
export const usePropertiesData = () => ({ properties: useStoreData(state => state.properties), isClient: true });
export const useStairspaceData = () => ({ stairspaceListings: useStoreData(state => state.stairspaceListings), isClient: true });
export const useStairspaceRequestsData = () => ({ stairspaceRequests: useStoreData(state => state.stairspaceRequests), isClient: true });
export const useOpportunitiesData = () => ({ opportunities: useStoreData(state => state.opportunities), isClient: true });
export const useCostSettingsData = () => ({ costSettings: useStoreData(state => state.costSettings), isClient: true });
export const usePricingData = () => ({ pricing: useStoreData(state => state.pricing), isClient: true });
export const useCfoData = () => ({ kpiData: useStoreData(s => s.kpiData), transactionData: useStoreData(s => s.transactionData), upcomingPayments: useStoreData(s => s.upcomingPayments), vatPayment: useStoreData(s => s.vatPayment), cashFlowData: useStoreData(s => s.cashFlowData), isClient: true });
export const useStudentsData = () => ({ students: useStoreData(state => state.students), isClient: true });
