

'use client';

import { useState, useEffect } from 'react';
import useGlobalStore from './use-global-store-data';
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
import type { Property } from '@/lib/properties.schema';

const createDataContext = <T, K extends keyof AppState>(
  dataKey: K,
  initialDataProp: T[] = []
) => {
  const useData = (initialData: T[] = initialDataProp) => {
    const { state, store } = useGlobalStore();
    const [isClient, setIsClient] = useState(false);
    
    useEffect(() => {
        setIsClient(true);
        // This effect ensures that the store is hydrated with server-provided data
        // only once on the client, preventing mismatches during re-renders.
        if(initialData && initialData.length > 0) {
            store.set(s => ({ ...s, [dataKey]: initialData }));
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);


    const setData = (updater: (currentData: T[]) => T[]) => {
      const currentData = store.get()[dataKey] as T[];
      store.set((s) => ({ ...s, [dataKey]: updater(currentData) }));
    };

    const data = isClient ? state[dataKey] as T[] : initialData;

    return { data, setData, isClient };
  };

  return { useData };
};


// Assuming AppState is imported or defined in useGlobalStore
import type { AppState } from '@/lib/global-store';


export const { useData: useLeasesData } = createDataContext<SignedLease, 'signedLeases'>('signedLeases');
export const { useData: useStudentsData } = createDataContext<Student, 'students'>('students');
export const { useData: useEventsData } = createDataContext<CommunityEvent, 'communityEvents'>('communityEvents');
export const { useData: useAlumniJobsData } = createDataContext<JobPosting, 'alumniJobs'>('alumniJobs');
export const { useData: useMembersData } = createDataContext<CommunityMember, 'communityMembers'>('communityMembers');
export const { useData: useAgenciesData } = createDataContext<RaahaAgency, 'raahaAgencies'>('raahaAgencies');
export const { useData: useWorkersData } = createDataContext<RaahaWorker, 'raahaWorkers'>('raahaWorkers');
export const { useData: useRequestsData } = createDataContext<HireRequest, 'raahaRequests'>('raahaRequests');
export const { useData: useBeautyCentersData } = createDataContext<BeautyCenter, 'beautyCenters'>('beautyCenters');
export const { useData: useBeautyServicesData } = createDataContext<BeautyService, 'beautyServices'>('beautyServices');
export const { useData: useBeautySpecialistsData } = createDataContext<BeautySpecialist, 'beautySpecialists'>('beautySpecialists');
export const { useData: useBeautyAppointmentsData } = createDataContext<BeautyAppointment, 'beautyAppointments'>('beautyAppointments');
export const { useData: useStairspaceListingsData } = createDataContext<StairspaceListing, 'stairspaceListings'>('stairspaceListings');
export const { useData: useStairspaceRequestsData } = createDataContext<BookingRequest, 'stairspaceRequests'>('stairspaceRequests');
export const { useData: useUsedItemsData } = createDataContext<UsedItem, 'usedItems'>('usedItems');
export const { useData: usePropertiesData } = createDataContext<Property, 'properties'>('properties');

