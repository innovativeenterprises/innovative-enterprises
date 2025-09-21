
'use client';

import { useState, useEffect } from 'react';
import { store, type AppState, type CartItem } from '@/lib/global-store';

function useGlobalData<T>(
    selector: (state: AppState) => T, 
    setter: (updater: (prev: T) => T) => void
) {
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


export const useProductsData = () => {
    const { data, setData, isClient } = useGlobalData(
        (state) => ({ products: state.products, storeProducts: state.storeProducts }),
        (updater) => store.set(state => {
            const { products, storeProducts } = updater({ products: state.products, storeProducts: state.storeProducts });
            return { ...state, products, storeProducts };
        })
    );
    return { ...data, setProducts: (products: any) => setData(s => ({...s, products})), storeProducts: data.storeProducts, isClient };
};

export const useCartData = () => {
    const { data, setData, isClient } = useGlobalData(
        (state) => ({ cart: state.cart || [] }),
        (updater) => store.set(state => ({ ...state, cart: updater({ cart: state.cart || [] }).cart }))
    );

    const setCart = (updater: (currentCart: CartItem[]) => CartItem[]) => {
        setData(s => ({...s, cart: updater(s.cart)}));
    }

    return { cart: data.cart || [], setCart, isClient };
};


export const useProvidersData = () => useGlobalData(
    (state) => ({ providers: state.providers }),
    (updater) => store.set(state => ({ ...state, providers: updater({ providers: state.providers }).providers }))
);

export const useOpportunitiesData = () => useGlobalData(
    (state) => ({ opportunities: state.opportunities }),
    (updater) => store.set(state => ({ ...state, opportunities: updater({ opportunities: state.opportunities }).opportunities }))
);

export const useServicesData = () => useGlobalData(
    (state) => ({ services: state.services }),
    (updater) => store.set(state => ({ ...state, services: updater({ services: state.services }).services }))
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
    (updater) => store.set(state => ({ ...state, settings: updater({ settings: state.settings }).settings }))
);

export const usePosData = () => useGlobalData(
    (state) => ({ dailySales: state.dailySales }),
    (updater) => store.set(state => ({ ...state, dailySales: updater({ dailySales: state.dailySales }).dailySales }))
);

export const usePosProductsData = () => useGlobalData(
    (state) => ({ posProducts: state.posProducts }),
    (updater) => store.set(state => ({ ...state, posProducts: updater({ posProducts: state.posProducts }).posProducts }))
);

export const useSaaSProductsData = () => useGlobalData(
    (state) => ({ saasProducts: state.saasProducts }),
    (updater) => store.set(state => ({ ...state, saasProducts: updater({ saasProducts: state.saasProducts }).saasProducts }))
);

export const useCostSettingsData = () => useGlobalData(
    (state) => ({ costSettings: state.costSettings }),
    (updater) => store.set(state => ({ ...state, costSettings: updater({ costSettings: state.costSettings }).costSettings }))
);

export const usePricingData = () => useGlobalData(
    (state) => ({ pricing: state.pricing }),
    (updater) => store.set(state => ({ ...state, pricing: updater({ pricing: state.pricing }).pricing }))
);

export const useClientsData = () => useGlobalData(
    (state) => ({ clients: state.clients }),
    (updater) => store.set(state => ({ ...state, clients: updater({ clients: state.clients }).clients }))
);

export const useTestimonialsData = () => useGlobalData(
    (state) => ({ testimonials: state.testimonials }),
    (updater) => store.set(state => ({ ...state, testimonials: updater({ testimonials: state.testimonials }).testimonials }))
);

export const useBriefcaseData = () => useGlobalData(
    (state) => ({ data: state.briefcase }),
    (updater) => store.set(state => ({ ...state, briefcase: updater({data: state.briefcase}).data }))
);
