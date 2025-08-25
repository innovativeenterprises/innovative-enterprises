
'use client';

import OpportunityTable, { useOpportunitiesData } from "../opportunity-table";
import PricingTable, { usePricingData } from "../pricing-table";

export default function AdminOperationsPage() {
  const opportunityData = useOpportunitiesData();
  const pricingData = usePricingData();

  return (
    <div className="space-y-8">
        <div>
            <h1 className="text-3xl font-bold">Operations</h1>
            <p className="text-muted-foreground">
                Manage business operations like opportunities and pricing.
            </p>
        </div>
        <OpportunityTable {...opportunityData} />
        <PricingTable {...pricingData} />
    </div>
  );
}
