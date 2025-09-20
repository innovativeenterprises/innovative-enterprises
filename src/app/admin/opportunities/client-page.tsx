
'use client';

import WorkOrderForm from './work-order-form';
import OpportunityTable from './opportunity-table';
import { useOpportunitiesData } from '@/hooks/use-global-store-data';
import type { Opportunity } from '@/lib/opportunities.schema';
import { useEffect } from 'react';

export default function OpportunityClientPage({ initialOpportunities }: { initialOpportunities: Opportunity[] }) {
    const { setOpportunities } = useOpportunitiesData();
    useEffect(() => {
        setOpportunities(() => initialOpportunities);
    }, [initialOpportunities, setOpportunities]);
    
    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold">Opportunities</h1>
                <p className="text-muted-foreground">Analyze new ideas and manage all open projects, tasks, and competitions available to your partner network.</p>
            </div>
            <WorkOrderForm />
            <OpportunityTable />
        </div>
    );
}
