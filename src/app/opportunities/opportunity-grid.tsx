
'use client';

import { useState, useMemo, useEffect } from "react";
import { OpportunityCard } from "./opportunity-card";
import { Skeleton } from "@/components/ui/skeleton";
import type { Opportunity } from "@/lib/opportunities";

const OpportunityGridSkeleton = () => (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {Array.from({length: 6}).map((_, i) => (
            <Skeleton key={i} className="h-96 w-full" />
        ))}
    </div>
);

export default function OpportunityGrid({ initialOpportunities }: { initialOpportunities: Opportunity[] }) {
    const [isClient, setIsClient] = useState(false);
    
    useEffect(() => {
        setIsClient(true);
    }, []);

    const publicOpportunities = initialOpportunities
            .filter(opp => opp.status !== 'Closed')
            .sort((a,b) => (a.status === 'In Progress' ? -1 : 1));

    if (!isClient) {
        return <OpportunityGridSkeleton />;
    }
    
    return (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {publicOpportunities.map((opp) => (
                <OpportunityCard key={opp.id} opp={opp} />
            ))}
        </div>
    );
}
