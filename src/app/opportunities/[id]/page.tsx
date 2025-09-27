
'use server';

import { getOpportunities } from "@/lib/firestore";
import OpportunityDetailClientPage from "./client-page";
import type { Metadata } from 'next';

export async function generateStaticParams() {
    const opportunities = await getOpportunities();
    return opportunities.map((opp) => ({
        id: opp.id,
    }));
}

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const opportunities = await getOpportunities();
  const opportunity = opportunities.find(p => p.id === params.id);

  if (!opportunity) {
    return {
      title: 'Opportunity Not Found',
    };
  }

  return {
    title: `${opportunity.title} | Opportunities`,
    description: opportunity.description,
  };
}

export default async function OpportunityDetailPage({ params }: { params: { id: string } }) {
    const opportunities = await getOpportunities();
    const opportunity = opportunities.find(p => p.id === params.id);
    
    return <OpportunityDetailClientPage opportunity={opportunity} />;
}
