
'use client';

import OpportunityTable, { useOpportunitiesData } from "../opportunity-table";

export default function AdminOpportunitiesPage() {
  const opportunityData = useOpportunitiesData();

  return (
    <div className="space-y-8">
        <div>
            <h1 className="text-3xl font-bold">Opportunities</h1>
            <p className="text-muted-foreground">
                Manage the public-facing projects, tasks, and competitions for your partner network.
            </p>
        </div>

        <OpportunityTable {...opportunityData} />
    </div>
  );
}
