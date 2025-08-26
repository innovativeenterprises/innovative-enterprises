
'use client';

import OpportunityTable, { useOpportunitiesData } from "../opportunity-table";
import PricingTable, { usePricingData } from "../pricing-table";
import StageTable, { useProjectStagesData } from "../stage-table";
import AssetTable, { useAssetsData } from "../asset-table";

export default function AdminOperationsPage() {
  const opportunityData = useOpportunitiesData();
  const pricingData = usePricingData();
  const stageData = useProjectStagesData();
  const assetData = useAssetsData();

  return (
    <div className="space-y-8">
        <div>
            <h1 className="text-3xl font-bold">Operations</h1>
            <p className="text-muted-foreground">
                Manage business operations like opportunities and pricing.
            </p>
        </div>
        <AssetTable {...assetData} />
        <OpportunityTable {...opportunityData} />
        <PricingTable {...pricingData} />
        <StageTable {...stageData} />
    </div>
  );
}
