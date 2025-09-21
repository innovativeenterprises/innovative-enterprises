

'use client';

import { useState, useEffect, useContext, createContext } from 'react';
import type { BriefcaseData } from '@/lib/briefcase';
import type { HireRequest } from '@/lib/raaha-requests.schema';
import type { Agency as RaahaAgency } from '@/lib/raaha-agencies';
import type { Worker as RaahaWorker } from '@/lib/raaha-workers';
import type { CartItem } from '@/lib/global-store';
import type { BeautyCenter } from '@/lib/beauty-centers.schema';
import type { BeautyService } from '@/lib/beauty-services.schema';
import type { BeautySpecialist } from '@/lib/beauty-specialists.schema';
import type { BeautyAppointment } from '@/lib/beauty-appointments';
import type { StairspaceListing } from '@/lib/stairspace.schema';
import type { BookingRequest } from '@/lib/stairspace-requests';
import type { UsedItem } from '@/lib/used-items.schema';
import type { SignedLease } from '@/lib/leases';
import type { Student } from '@/lib/students.schema';
import type { CommunityEvent } from '@/lib/community-events';
import type { JobPosting } from '@/lib/alumni-jobs';
import type { CommunityMember } from '@/lib/community-members';
import type { Product } from '@/lib/products.schema';

const createDataContext = <T,>() => {
    const DataContext = createContext<{
        data: T[];
        setData: React.Dispatch<React.SetStateAction<T[]>>;
        isClient: boolean;
    } | null>(null);

    const useData = (initialData: T[] = []) => {
        const context = useContext(DataContext);
        if (context) {
            return context;
        }
        
        // This part is for components that are not wrapped in a provider
        const [data, setData] = useState(initialData);
        const [isClient, setIsClient] = useState(false);
        useEffect(() => setIsClient(true), []);
        
        useEffect(() => {
            setData(initialData);
        }, [initialData]);

        return { data, setData, isClient };
    };

    return { DataContext, useData };
};

export const { useData: useLeasesData } = createDataContext<SignedLease>();
export const { useData: useStudentsData } = createDataContext<Student>();
export const { useData: useEventsData } = createDataContext<CommunityEvent>();
export const { useData: useAlumniJobsData } = createDataContext<JobPosting>();
export const { useData: useMembersData } = createDataContext<CommunityMember>();
export const { useData: useProductsData } = createDataContext<Product>();
export const { useData: useCartData } = createDataContext<CartItem>();
export const { useData: useBriefcaseData } = createDataContext<BriefcaseData>();
export const { useData: useAgenciesData } = createDataContext<RaahaAgency>();
export const { useData: useWorkersData } = createDataContext<RaahaWorker>();
export const { useData: useRequestsData } = createDataContext<HireRequest>();
export const { useData: useBeautyData } = createDataContext<BeautyCenter>();
export const { useData: useBeautyServicesData } = createDataContext<BeautyService>();
export const { useData: useBeautySpecialistsData } = createDataContext<BeautySpecialist>();
export const { useData: useBeautyAppointmentsData } = createDataContext<BeautyAppointment>();
export const { useData: useStairspaceData } = createDataContext<StairspaceListing>();
export const { useData: useStairspaceRequestsData } = createDataContext<BookingRequest>();
export const { useData: useUsedItemsData } = createDataContext<UsedItem>();
