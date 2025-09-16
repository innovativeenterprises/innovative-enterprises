
'use client';

import type { CartItem } from '@/lib/global-store';
import { store } from '@/lib/global-store';

export const setCart = (updater: (prev: CartItem[]) => CartItem[]) =>
  store.set((state) => ({ ...state, cart: updater(state.cart) }));
    
