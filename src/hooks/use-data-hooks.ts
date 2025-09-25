
'use client';

import React, { useEffect, useState } from 'react';
import { useStore, useSetStore } from '@/lib/global-store.tsx';
import type { AppState } from '@/lib/initial-state';

// A generic hook factory
const createDataHook = <K extends keyof AppState>(key: K) => {
  return (initialData?: AppState[K]) => {
    const isClient = useStore(state => state.isClient);
    const data = useStore(state => state[key]);
    const set = useSetStore();

    // The logic below for setting initial state is complex and might be refactored further,
    // but it handles server-side initial data and client-side updates.
    const [isInitialized, setIsInitialized] = useState(isClient);
    
    useEffect(() => {
      if (!isInitialized && initialData !== undefined) {
        set(state => ({...state, [key]: initialData}));
        setIsInitialized(true);
      }
    }, [initialData, isInitialized, set, key]);

    const setData = (updater: React.SetStateAction<AppState[K]>) => {
        set(s => {
            const newValue = typeof updater === 'function' 
                // @ts-ignore - TS can't infer the type of the updater function correctly
                ? updater(s[key]) 
                : updater;
            return { ...s, [key]: newValue };
        });
    }

    return { data, setData, isClient } as { 
      data: AppState[K]; 
      setData: (updater: React.SetStateAction<AppState[K]>) => void;
      isClient: boolean;
    };
  };
};

// Create specific hooks for each part of the state
export const useSettingsData = createDataHook('settings');
export const useCartData = createDataHook('cart');
export const useStoreProductsData = createDataHook('storeProducts');
export const useProductsData = createDataHook('products');
export const useProvidersData = createDataHook('providers');
export const useOpportunitiesData = createDataHook('opportunities');
export const useServicesData = createDataHook('services');
export const useLeasesData = createDataHook('signedLeases');
export const useStairspaceRequestsData = createDataHook('stairspaceRequests');
export const useStairspaceListingsData = createDataHook('stairspaceListings');
export const useStaffData = (initialData?: Partial<{ leadership: AppState['leadership'], staff: AppState['staff'], agentCategories: AppState['agentCategories'] }>) => {
    const isClient = useStore(state => state.isClient);
    const leadership = useStore(state => state.leadership);
    const staff = useStore(state => state.staff);
    const agentCategories = useStore(state => state.agentCategories);
    const set = useSetStore();

    const [isInitialized, setIsInitialized] = useState(isClient);

    useEffect(() => {
        if (!isInitialized && initialData !== undefined) {
            set(state => ({...state, ...initialData}));
            setIsInitialized(true);
        }
    }, [initialData, isInitialized, set]);


    const setGlobalData = (updater: React.SetStateAction<{ leadership: AppState['leadership'], staff: AppState['staff'], agentCategories: AppState['agentCategories'] }>) => {
        set(s => {
            const currentData = { leadership: s.leadership, staff: s.staff, agentCategories: s.agentCategories };
            const newValue = typeof updater === 'function' ? updater(currentData) : updater;
            return { ...s, ...newValue };
        });
    };

    return { leadership, staff, agentCategories, setData: setGlobalData, isClient };
};

export const useAgenciesData = createDataHook('raahaAgencies');
export const useWorkersData = createDataHook('raahaWorkers');
export const useRequestsData = createDataHook('raahaRequests');
export const useBeautyCentersData = createDataHook('beautyCenters');
export const useBeautyServicesData = createDataHook('beautyServices');
export const useBeautySpecialistsData = createDataHook('beautySpecialists');
export const useBeautyAppointmentsData = createDataHook('beautyAppointments');
export const useCostSettingsData = createDataHook('costSettings');
export const useAssetsData = createDataHook('assets');
export const useUsedItemsData = createDataHook('usedItems');
export const useClientsData = createDataHook('clients');
export const useTestimonialsData = createDataHook('testimonials');
export const useGiftCardsData = createDataHook('giftCards');
export const useStudentsData = createDataHook('students');
export const useCommunitiesData = createDataHook('communities');
export const useCommunityEventsData = createDataHook('communityEvents');
export const useCommunityFinancesData = createDataHook('communityFinances');
export const useCommunityMembersData = createDataHook('communityMembers');
export const useAlumniJobsData = createDataHook('alumniJobs');
export const useRentalAgenciesData = createDataHook('rentalAgencies');
export const useCarsData = createDataHook('cars');
export const usePosProductsData = createDataHook('posProducts');
export const usePosData = createDataHook('dailySales');
export const useSaaSProductsData = createDataHook('saasProducts');
export const useStockItemsData = createDataHook('stockItems');
export const usePricingData = createDataHook('pricing');
export const useStagesData = createDataHook('stages');
export const useApplicationsData = createDataHook('applications');
export const useBriefcaseData = createDataHook('briefcase');
export const useInvestorsData = createDataHook('investors');
export const useKnowledgeBaseData = createDataHook('knowledgeBase');
export const useCfoData = createDataHook('cfoData');
export const usePropertiesData = createDataHook('properties');
export const useSolutionsData = createDataHook('solutions');
export const useIndustriesData = createDataHook('industries');
export const useAiToolsData = createDataHook('aiTools');
export const useUserDocumentsData = createDataHook('userDocuments');


// This custom hook provides a consolidated view of the data needed for the Beauty Hub.
export const useBeautyData = () => {
    const agencies = useStore(state => state.beautyCenters);
    const services = useStore(state => state.beautyServices);
    const appointments = useStore(state => state.beautyAppointments);
    const specialists = useStore(state => state.beautySpecialists);
    const setAppointments = useSetStore();
    const isClient = useStore(state => state.isClient);
    
    return {
        agencies,
        services,
        appointments,
        specialists,
        setAppointments: (updater: React.SetStateAction<AppState['beautyAppointments']>) => setAppointments(s => ({...s, beautyAppointments: typeof updater === 'function' ? updater(s.beautyAppointments) : updater })),
        isClient
    };
};
