
'use server';

import SaasPortfolioPageClient from './client-page';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "SaaS Portfolio",
  description: "Browse the complete portfolio of all digital products and SaaS platforms.",
};


export default async function AdminSassPortfolioPage() {
    return <SaasPortfolioPageClient />;
}
