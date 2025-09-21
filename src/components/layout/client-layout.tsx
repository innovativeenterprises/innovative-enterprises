

'use client';

import { Toaster } from '@/components/ui/toaster';
import ChatWidget from '@/components/chat-widget';
import { ThemeProvider } from 'next-themes';
import Footer from './footer';
import Header from './header';
import type { Solution, Industry, AiTool } from '@/lib/nav-links';
import React, { createContext, useState, type ReactNode } from 'react';
import type { CartItem } from '@/lib/pos-data.schema';
import type { AppSettings } from '@/lib/settings';
import { SaasCategory } from '@/lib/saas-products.schema';
import { BriefcaseData } from '@/lib/briefcase';
import { Community } from '@/lib/communities';
import { CommunityEvent } from '@/lib/community-events';
import { CommunityFinance } from '@/lib/community-finances';
import { CommunityMember } from '@/lib/community-members';

export const CartContext = createContext<{
  cart: CartItem[];
  setCart: React.Dispatch<React.SetStateAction<CartItem[]>>;
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
            <ChatWidget settings={settings} />
        </div>
      </CartContext.Provider>
    </ThemeProvider>
  );
}
