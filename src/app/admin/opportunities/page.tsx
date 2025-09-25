
'use server';

import type { Metadata } from 'next';
import { getOpportunities } from '@/lib/firestore';
import WorkOrderForm from './work-order-form';
import OpportunityTable from './opportunity-table';

export const metadata: Metadata = {
    title: "Opportunities",
    description: "Analyze new ideas and manage all open projects, tasks, and competitions available to your partner network."
};

export default async function OpportunitiesPage() {
    const opportunities = await getOpportunities();
    return (
         <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold">Opportunities</h1>
                <p className="text-muted-foreground">Analyze new ideas and manage all open projects, tasks, and competitions available to your partner network.</p>
            </div>
            <WorkOrderForm />
            <OpportunityTable initialOpportunities={opportunities || []} />
        </div>
    )
}
