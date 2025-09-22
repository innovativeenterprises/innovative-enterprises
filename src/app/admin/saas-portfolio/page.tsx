
'use server';

import { getSaasProducts } from '@/lib/firestore';
import SaasPortfolioPage from './client-page';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "SaaS Portfolio",
  description: "Browse the complete portfolio of all digital products and SaaS platforms.",
};


export default async function AdminSassPortfolioPage() {
    const saasProducts = await getSaasProducts();
    return <SaasPortfolioPage initialProducts={saasProducts} />;
}
