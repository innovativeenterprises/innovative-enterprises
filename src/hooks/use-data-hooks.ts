

'use client';

import { useState, useEffect } from 'react';
import { store } from '@/lib/global-store';
import type { HireRequest } from '@/lib/raaha-requests.schema';
import type { Agency as RaahaAgency } from '@/lib/raaha-agencies.schema';
import type { Worker } from '@/lib/raaha-workers.schema';
import type { StairspaceListing } from '@/lib/stairspace.schema';
import type { BookingRequest } from '@/lib/stairspace-requests';
import type { Property } from '@/lib/properties.schema';
import type { SignedLease } from '@/lib/leases';
import type { Provider } from '@/lib/providers.schema';
import type { Opportunity } from '@/lib/opportunities.schema';
import type { Student } from '@/lib/students.schema';
import type { CommunityMember } from '@/lib/community-members';
import type { CommunityEvent } from '@/lib/community-events';
import type { CommunityFinance } from '@/lib/community-finances';
import type { Client, Testimonial } from '@/lib/clients.schema';
import type { GiftCard } from '@/lib/gift-cards.schema';
import type { DailySales, PosProduct } from '@/lib/pos-data.schema';
import type { UsedItem } from '@/lib/used-items.schema';
import type { SaasCategory } from '@/lib/saas-products.schema';

const useDataState = <T>(initialData: T[], dataKey: keyof typeof store.get) => {
    const [data, setData] = useState<T[]>(initialData);
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
        // This can be expanded to sync with global store or fetch updates
    }, []);

    const updateData = (updater: (prev: T[]) => T[]) => {
        setData(updater);
        // In a real app with global state, you'd update it here:
        // store.set(state => ({ ...state, [dataKey]: updater(state[dataKey]) }));
    };

    return { data, setData: updateData, isClient };
};

export const useRequestsData = (initialData: HireRequest[] = []) => useDataState<HireRequest>(initialData, 'raahaRequests');
export const useAgenciesData = (initialData: RaahaAgency[] = []) => useDataState<RaahaAgency>(initialData, 'raahaAgencies');
export const useWorkersData = (initialData: Worker[] = []) => useDataState<Worker>(initialData, 'raahaWorkers');
export const useStairspaceData = (initialData: StairspaceListing[] = []) => useDataState<StairspaceListing>(initialData, 'stairspaceListings');
export const useStairspaceRequestsData = (initialData: BookingRequest[] = []) => useDataState<BookingRequest>(initialData, 'stairspaceRequests');
export const usePropertiesData = (initialData: Property[] = []) => useDataState<Property>(initialData, 'properties');
export const useLeasesData = (initialData: SignedLease[] = []) => useDataState<SignedLease>(initialData, 'signedLeases');
export const useProvidersData = (initialData: Provider[] = []) => useDataState<Provider>(initialData, 'providers');
export const useOpportunitiesData = (initialData: Opportunity[] = []) => useDataState<Opportunity>(initialData, 'opportunities');
export const useStudentsData = (initialData: Student[] = []) => useDataState<Student>(initialData, 'students');
export const useMembersData = (initialData: CommunityMember[] = []) => useDataState<CommunityMember>(initialData, 'communityMembers');
export const useEventsData = (initialData: CommunityEvent[] = []) => useDataState<CommunityEvent>(initialData, 'communityEvents');
export const useFinancesData = (initialData: CommunityFinance[] = []) => useDataState<CommunityFinance>(initialData, 'communityFinances');
export const useClientsData = (initialData: Client[] = []) => useDataState<Client>(initialData, 'clients');
export const useTestimonialsData = (initialData: Testimonial[] = []) => useDataState<Testimonial>(initialData, 'testimonials');
export const useGiftCardsData = (initialData: GiftCard[] = []) => useDataState<GiftCard>(initialData, 'giftCards');
export const usePosData = (initialData: PosProduct[] = []) => useDataState<PosProduct>(initialData, 'posProducts');
export const useUsedItemsData = (initialData: UsedItem[] = []) => useDataState<UsedItem>(initialData, 'usedItems');
export const useDailySalesData = (initialData: DailySales = []) => useDataState<any>(initialData, 'dailySales');
export const useSaasProductsData = (initialData: SaasCategory[] = []) => useDataState<SaasCategory>(initialData, 'saasProducts');

