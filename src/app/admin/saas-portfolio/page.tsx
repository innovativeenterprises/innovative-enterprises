
import { saasProducts } from '@/lib/saas-products';
import SaasPortfolioClientPage from './client-page';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "SaaS Portfolio",
  description: "Browse the complete portfolio of over 30+ digital products and SaaS platforms developed by Innovative Enterprises, spanning construction, real estate, education, and AI tools.",
};

export default function SaasPortfolioPage() {
    return (
      <div className="bg-background min-h-[calc(100vh-8rem)]">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-primary">SaaS Portfolio</h1>
            <p className="mt-4 text-lg text-muted-foreground">
                A complete overview of all our digital products and platforms.
            </p>
          </div>
          <div className="mt-12">
            <SaasPortfolioClientPage saasProducts={saasProducts} />
          </div>
        </div>
      </div>
    );
}
