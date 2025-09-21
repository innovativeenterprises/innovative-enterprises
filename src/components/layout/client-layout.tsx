
'use client';

import { Toaster } from '@/components/ui/toaster';
import ChatWidget from '@/components/chat-widget';
import { ThemeProvider } from 'next-themes';
import Footer from './footer';
import Header from './header';
import type { Solution, Industry, AiTool } from '@/lib/nav-links';
import React, { useState, type ReactNode, useEffect, createContext } from 'react';
import type { AppSettings } from '@/lib/settings';
import { store } from '@/lib/global-store';
import type { CartItem } from '@/lib/global-store';

export const CartContext = createContext<{
    cart: CartItem[];
    setCart: (updater: (currentCart: CartItem[]) => CartItem[]) => void;
} | null>(null);


export default function ClientLayout({
  children,
  solutions,
  industries,
  aiTools,
  settings,
}: {
  children: React.ReactNode;
  solutions: Solution[];
  industries: Industry[];
  aiTools: AiTool[];
  settings: AppSettings;
}) {
  const [cart, setCartState] = useState<CartItem[]>(store.get().cart);

  useEffect(() => {
    const unsubscribe = store.subscribe(() => {
      setCartState(store.get().cart);
    });
    return () => unsubscribe();
  }, []);
  
  const setCart = (updater: (currentCart: CartItem[]) => CartItem[]) => {
      store.set(state => ({
          ...state,
          cart: updater(state.cart)
      }));
  };

  return (
    <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
    >
      <CartContext.Provider value={{ cart, setCart }}>
        <div className="flex min-h-screen flex-col">
            <Header 
              solutions={solutions}
              industries={industries}
              aiTools={aiTools}
            />
            <main className="flex-1">{children}</main>
            <Footer />
            <Toaster />
            <ChatWidget settings={settings} />
        </div>
      </CartContext.Provider>
    </ThemeProvider>
  );
}
