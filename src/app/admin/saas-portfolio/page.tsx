
import { saasProducts } from '@/lib/saas-products';
import SaasPortfolioClientPage from './client-page';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "SaaS Portfolio",
  description: "Browse the complete portfolio of over 30+ digital products and SaaS platforms developed by Innovative Enterprises, spanning construction, real estate, education, and AI tools.",
};

export default function SaasPortfolioPage() {
    return (
        <SaasPortfolioClientPage saasProducts={saasProducts} />
    );
}
