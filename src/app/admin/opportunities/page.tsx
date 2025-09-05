
'use client';

import { useState, useEffect } from 'react';
import OpportunityTable, { useOpportunitiesData } from "../opportunity-table";
import { Skeleton } from '@/components/ui/skeleton';

export default function AdminOpportunitiesPage() {
  const opportunityData = useOpportunitiesData();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <div className="space-y-8">
        <div>
            <h1 className="text-3xl font-bold">Opportunities</h1>
            <p className="text-muted-foreground">
                Manage the public-facing projects, tasks, and competitions for your partner network.
            </p>
        </div>

        {isClient ? (
          <OpportunityTable {...opportunityData} />
        ) : (
          <Skeleton className="h-[400px] w-full" />
        )}
    </div>
  );
}
