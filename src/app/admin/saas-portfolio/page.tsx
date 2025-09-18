
import { getSaasProducts } from '@/lib/firestore';
import SaasPortfolioClientPage from './client-page';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "SaaS Portfolio",
  description: "Browse, search, and filter through all of our current digital product initiatives.",
};

export default async function SaasPortfolioPage() {
  const saasProducts = await getSaasProducts();
  return (
    <div className="space-y-8">
        <SaasPortfolioClientPage saasProducts={saasProducts} />
    </div>
  );
}
