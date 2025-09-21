
'use client';

import { Toaster } from '@/components/ui/toaster';
import ChatWidget from '@/components/chat-widget';
import { ThemeProvider } from 'next-themes';
import Footer from './footer';
import Header from './header';
import type { Solution, Industry, AiTool } from '@/lib/nav-links';
import React, { createContext, useState, type ReactNode } from 'react';
import type { CartItem } from '@/lib/pos-data.schema';

export const CartContext = createContext<{
  cart: CartItem[];
  setCart: React.Dispatch<React.SetStateAction<CartItem[]>>;
} | null>(null);


export default function ClientLayout({
  children,
  solutions,
  industries,
  aiTools
}: {
  children: React.ReactNode;
  solutions: Solution[];
  industries: Industry[];
  aiTools: AiTool[];
}) {
  const [cart, setCart] = useState<CartItem[]>([]);

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
            <ChatWidget />
        </div>
      </CartContext.Provider>
    </ThemeProvider>
  );
}
