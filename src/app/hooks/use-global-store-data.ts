
'use client';

import { useState, useEffect } from 'react';
import { store, type AppState, type CartItem } from '@/lib/global-store';
import type { BriefcaseData } from '@/lib/briefcase';
import type { Product } from '@/lib/products.schema';
import type { Provider } from '@/lib/providers.schema';
import type { Opportunity } from '@/lib/opportunities.schema';
import type { Service } from '@/lib/services.schema';
import type { Agent, AgentCategory } from '@/lib/agents.schema';
import type { Pricing } from '@/lib/pricing.schema';
import type { AppSettings } from '@/lib/settings';
import type { PosProduct, DailySales } from '@/lib/pos-data.schema';
import type { SaasCategory } from '@/lib/saas-products.schema';
import type { GiftCard } from '@/lib/gift-cards.schema';
import type { Community } from '@/lib/communities';

const useGlobalStore = () => {
    const [state, setState] = useState(store.get());
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
        const unsubscribe = store.subscribe(() => {
            setState(store.get());
        });
        return unsubscribe;
    }, []);

    return { state, store, isClient };
}

export default useGlobalStore;


export const useCartData = () => {
    const { state, store, isClient } = useGlobalStore();
    
    const cart = isClient ? state.cart : [];

    const setCart = (updater: (currentCart: CartItem[]) => CartItem[]) => {
        const currentCart = store.get().cart;
        store.set(s => ({ ...s, cart: updater(currentCart) }));
    };
    
    return { cart, setCart, isClient };
};

export const useBriefcaseData = () => {
    const { state, store, isClient } = useGlobalStore();

    useEffect(() => {
        if (isClient && !state.briefcase) {
            try {
                const savedBriefcase = localStorage.getItem('user_briefcase');
                if (savedBriefcase) {
                    store.set(s => ({ ...s, briefcase: JSON.parse(savedBriefcase) }));
                } else {
                    // This will be replaced by a fetch from a database in a real app
                    import('@/lib/briefcase').then(mod => {
                        store.set(s => ({ ...s, briefcase: mod.initialBriefcase }));
                    });
                }
            } catch (error) {
                console.error("Failed to load briefcase from localStorage", error);
                 import('@/lib/briefcase').then(mod => {
                    store.set(s => ({ ...s, briefcase: mod.initialBriefcase }));
                });
            }
        }
    }, [isClient, state.briefcase, store]);
    
    const setBriefcase = (updater: (currentBriefcase: AppState['briefcase']) => AppState['briefcase']) => {
        const currentBriefcase = store.get().briefcase;
        const newBriefcase = updater(currentBriefcase);
        store.set(s => ({ ...s, briefcase: newBriefcase }));
        if (typeof window !== 'undefined') {
            localStorage.setItem('user_briefcase', JSON.stringify(newBriefcase));
        }
    };
    return { data: isClient ? state.briefcase : null, setData: setBriefcase, isClient };
};


export const usePricingData = () => {
    const { state, store, isClient } = useGlobalStore();
    const pricing = isClient ? state.pricing : [];
    const setPricing = (updater: (currentPricing: Pricing[]) => Pricing[]) => {
        const currentPricing = store.get().pricing;
        store.set(s => ({ ...s, pricing: updater(currentPricing) }));
    };
    return { pricing, setPricing, isClient };
}


export const usePosProductsData = () => {
    const { state, isClient } = useGlobalStore();
    return { posProducts: isClient ? state.posProducts : [], isClient };
};

export const usePosData = () => {
    const { state, store, isClient } = useGlobalStore();
    const dailySales = isClient ? state.dailySales : [];
    const setDailySales = (updater: (currentSales: DailySales) => DailySales) => {
        const currentSales = store.get().dailySales;
        store.set(s => ({ ...s, dailySales: updater(currentSales) }));
    };
    return { dailySales, setDailySales, isClient };
};

export const useSaasProductsData = () => {
    const { state, isClient } = useGlobalStore();
    return { saasProducts: isClient ? state.saasProducts : [], isClient };
};

export const useGiftCardsData = () => {
    const { state, store, isClient } = useGlobalStore();
    const setGiftCards = (updater: (current: GiftCard[]) => GiftCard[]) => {
        const current = store.get().giftCards;
        store.set(s => ({ ...s, giftCards: updater(current) }));
    };
    return { giftCards: isClient ? state.giftCards : [], setGiftCards, isClient };
};

export const useCommunitiesData = () => {
    const { state, isClient } = useGlobalStore();
    return { communities: isClient ? state.communities : [], isClient };
};
