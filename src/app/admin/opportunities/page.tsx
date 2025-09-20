
'use server';

import OpportunityClientPage from './client-page';
import type { Metadata } from 'next';
import { getOpportunities } from '@/lib/firestore';

export const metadata: Metadata = {
    title: "Opportunities",
    description: "Analyze new ideas and manage all open projects, tasks, and competitions available to your partner network."
};

export default async function OpportunitiesPage() {
    const opportunities = await getOpportunities();
    return <OpportunityClientPage initialOpportunities={opportunities} />
}
