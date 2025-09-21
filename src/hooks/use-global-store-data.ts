

'use client';

import { useState, useEffect } from 'react';
import { store, type AppState, type CartItem } from '@/lib/global-store';


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
    const setBriefcase = (updater: (currentBriefcase: AppState['briefcase']) => AppState['briefcase']) => {
        const currentBriefcase = store.get().briefcase;
        store.set(s => ({ ...s, briefcase: updater(currentBriefcase) }));
    };
    return { data: isClient ? state.briefcase : store.get().briefcase, setData: setBriefcase, isClient };
};
