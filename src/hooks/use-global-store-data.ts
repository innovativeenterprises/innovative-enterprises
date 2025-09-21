
'use client';

import { useState, useEffect } from 'react';
import { store, type AppState } from '@/lib/global-store';

function useGlobalData<T>(selector: (state: AppState) => T, setter: (updater: (prev: T) => T) => void) {
    const [data, setDataState] = useState<T>(() => selector(store.get()));
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
        const unsubscribe = store.subscribe(() => {
            setDataState(selector(store.get()));
        });
        return unsubscribe;
    }, [selector]);

    const setData = (updater: (prev: T) => T) => {
        setter(updater);
    };

    return { data, setData, isClient };
}


export const useProductsData = () => useGlobalData(
    (state) => ({ products: state.products, storeProducts: state.storeProducts }),
    (updater) => store.set(state => {
        const { products, storeProducts } = updater({ products: state.products, storeProducts: state.storeProducts });
        return { ...state, products, storeProducts };
    })
);

export const useCartData = () => useGlobalData(
    (state) => ({ cart: state.cart || [] }), // Always return an array
    (updater) => store.set(state => {
        const { cart } = updater({ cart: state.cart });
        return { ...state, cart };
    })
);

export const useProvidersData = () => useGlobalData(
    (state) => ({ providers: state.providers }),
    (updater) => store.set(state => ({ ...state, providers: updater(state.providers) }))
);

export const useOpportunitiesData = () => useGlobalData(
    (state) => ({ opportunities: state.opportunities }),
    (updater) => store.set(state => ({ ...state, opportunities: updater(state.opportunities) }))
);

export const useServicesData = () => useGlobalData(
    (state) => ({ services: state.services }),
    (updater) => store.set(state => ({ ...state, services: updater(state.services) }))
);

export const useStaffData = () => useGlobalData(
    (state) => ({ leadership: state.leadership, staff: state.staff, agentCategories: state.agentCategories }),
    (updater) => store.set(state => {
        const { leadership, staff, agentCategories } = updater({ leadership: state.leadership, staff: state.staff, agentCategories: state.agentCategories });
        return { ...state, leadership, staff, agentCategories };
    })
);

export const useSettingsData = () => useGlobalData(
    (state) => ({ settings: state.settings }),
    (updater) => store.set(state => ({ ...state, settings: updater(state.settings) }))
);

export const usePosData = () => useGlobalData(
    (state) => ({ dailySales: state.dailySales }),
    (updater) => store.set(state => ({ ...state, dailySales: updater(state.dailySales) }))
);

export const usePosProductsData = () => useGlobalData(
    (state) => ({ posProducts: state.posProducts }),
    (updater) => store.set(state => ({ ...state, posProducts: updater(state.posProducts) }))
);

export const useSaaSProductsData = () => useGlobalData(
    (state) => ({ saasProducts: state.saasProducts }),
    (updater) => store.set(state => ({ ...state, saasProducts: updater(state.saasProducts) }))
);

export const useCostSettingsData = () => useGlobalData(
    (state) => ({ costSettings: state.costSettings }),
    (updater) => store.set(state => ({ ...state, costSettings: updater(state.costSettings) }))
);

export const usePricingData = () => useGlobalData(
    (state) => ({ pricing: state.pricing }),
    (updater) => store.set(state => ({ ...state, pricing: updater(state.pricing) }))
);

export const useClientsData = () => useGlobalData(
    (state) => ({ clients: state.clients }),
    (updater) => store.set(state => ({ ...state, clients: updater(state.clients) }))
);

export const useTestimonialsData = () => useGlobalData(
    (state) => ({ testimonials: state.testimonials }),
    (updater) => store.set(state => ({ ...state, testimonials: updater(state.testimonials) }))
);

export const useBriefcaseData = () => useGlobalData(
    (state) => ({ briefcase: state.briefcase }),
    (updater) => store.set(state => ({ ...state, briefcase: updater(state.briefcase) }))
);
