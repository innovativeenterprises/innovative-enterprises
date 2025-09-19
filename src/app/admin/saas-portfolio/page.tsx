
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
      <div className="text-center">
        <h1 className="text-3xl font-bold">SaaS Portfolio</h1>
        <p className="text-muted-foreground">Browse, search, and filter through all of our current digital product initiatives.</p>
      </div>
      <SaasPortfolioClientPage saasProducts={saasProducts} />
    </div>
  );
}
