
'use client';

import { useState, useEffect } from 'react';
import type { BriefcaseData } from '@/lib/briefcase';
import type { CartItem, DailySales, PosProduct } from '@/lib/pos-data.schema';
import type { Product } from '@/lib/products.schema';
import type { Provider } from '@/lib/providers.schema';
import type { Opportunity } from '@/lib/opportunities.schema';
import type { Service } from '@/lib/services.schema';
import type { Agent, AgentCategory } from '@/lib/agents.schema';
import type { Pricing } from '@/lib/pricing.schema';
import type { AppSettings } from '@/lib/settings';
import type { SaasCategory } from '@/lib/saas-products.schema';
import type { GiftCard } from '@/lib/gift-cards.schema';
import type { Community } from '@/lib/communities';
import type { SignedLease } from '@/lib/leases';
import type { BookingRequest } from '@/lib/stairspace-requests';
import type { StairspaceListing } from '@/lib/stairspace.schema';
import type { HireRequest } from '@/lib/raaha-requests.schema';
import type { Agency as RaahaAgency } from '@/lib/raaha-agencies.schema';
import type { Worker as RaahaWorker } from '@/lib/raaha-workers.schema';
import type { BeautyCenter } from '@/lib/beauty-centers.schema';
import type { BeautyService } from '@/lib/beauty-services.schema';
import type { BeautySpecialist } from '@/lib/beauty-specialists.schema';
import type { BeautyAppointment } from '@/lib/beauty-appointments';
import type { CostRate } from '@/lib/cost-settings.schema';
import type { Asset } from '@/lib/assets.schema';
import type { UsedItem } from '@/lib/used-items.schema';
import type { Client, Testimonial } from '@/lib/clients.schema';
import type { Student } from '@/lib/students.schema';
import type { CommunityEvent } from '@/lib/community-events';
import type { CommunityFinance } from '@/lib/community-finances';
import type { CommunityMember } from '@/lib/community-members';
import type { JobPosting } from '@/lib/alumni-jobs';
import type { RentalAgency } from '@/lib/rental-agencies';
import type { Car } from '@/lib/cars.schema';
import type { StockItem } from '@/lib/stock-items.schema';
import type { ProjectStage } from '@/lib/stages';
import type { Investor } from '@/lib/investors.schema';
import type { KnowledgeDocument } from '@/lib/knowledge.schema';
import type { CfoData } from '@/lib/cfo-data.schema';
import type { Property } from '@/lib/properties.schema';
import type { Solution, Industry, AiTool } from '@/lib/nav-links';
import type { Application } from '@/lib/admissions-applications';

function createDataHook<T>(initialData: T) {
    const [data, setData] = useState<T>(initialData);
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
        setData(initialData);
    }, [initialData]);

    return { data, setData, isClient };
}


export const useCartData = (initialData: CartItem[] = []) => createDataHook(initialData);
export const useProductsData = (initialData: Product[] = []) => createDataHook(initialData);
export const useStoreProductsData = (initialData: Product[] = []) => createDataHook(initialData);
export const useSaaSProductsData = (initialData: SaasCategory[] = []) => createDataHook(initialData);
export const useProvidersData = (initialData: Provider[] = []) => createDataHook(initialData);
export const useOpportunitiesData = (initialData: Opportunity[] = []) => createDataHook(initialData);
export const useServicesData = (initialData: Service[] = []) => createDataHook(initialData);
export const useLeasesData = (initialData: SignedLease[] = []) => createDataHook(initialData);
export const useStairspaceData = (initialData: StairspaceListing[] = []) => createDataHook(initialData);
export const useStairspaceRequestsData = (initialData: BookingRequest[] = []) => createDataHook(initialData);
export const useStaffData = (initialData: { leadership: Agent[], staff: Agent[], agentCategories: AgentCategory[] }) => createDataHook(initialData);
export const useAgenciesData = (initialData: RaahaAgency[] = []) => createDataHook(initialData);
export const useWorkersData = (initialData: RaahaWorker[] = []) => createDataHook(initialData);
export const useRequestsData = (initialData: HireRequest[] = []) => createDataHook(initialData);
export const useBeautyData = (initialData: { agencies: BeautyCenter[], services: BeautyService[], appointments: BeautyAppointment[] }) => createDataHook(initialData);
export const useBeautySpecialistsData = (initialData: BeautySpecialist[] = []) => createDataHook(initialData);
export const useAssetsData = (initialData: Asset[] = []) => createDataHook(initialData);
export const useUsedItemsData = (initialData: UsedItem[] = []) => createDataHook(initialData);
export const useGiftCardsData = (initialData: GiftCard[] = []) => createDataHook(initialData);
export const useStudentsData = (initialData: Student[] = []) => createDataHook(initialData);
export const useMembersData = (initialData: CommunityMember[] = []) => createDataHook(initialData);
export const useCommunitiesData = (initialData: Community[] = []) => createDataHook(initialData);
export const useEventsData = (initialData: CommunityEvent[] = []) => createDataHook(initialData);
export const useFinancesData = (initialData: CommunityFinance[] = []) => createDataHook(initialData);
export const useAlumniJobsData = (initialData: JobPosting[] = []) => createDataHook(initialData);
export const usePosProductsData = (initialData: PosProduct[] = []) => createDataHook(initialData);
export const usePosData = (initialData: DailySales = []) => createDataHook(initialData);
export const useStockItemsData = (initialData: StockItem[] = []) => createDataHook(initialData);
export const usePropertiesData = (initialData: Property[] = []) => createDataHook(initialData);
export const useBriefcaseData = (initialData: BriefcaseData | null) => createDataHook(initialData);
export const useNavLinksData = (initialData: { solutions: Solution[], industries: Industry[], aiTools: AiTool[] }) => createDataHook(initialData);
export const useSettingsData = (initialData: AppSettings | null) => createDataHook(initialData);

export const usePricingData = (initialData: Pricing[] = []) => {
    const [data, setData] = useState<Pricing[]>(initialData);
    const [isClient, setIsClient] = useState(false);
    useEffect(() => {
        setIsClient(true);
    }, []);
    return { data, setData, isClient };
};
