
'use client';

import ProviderTable from "../provider-table";
import AssetTable from "../asset-table";
import { useProvidersData, useAssetsData } from "@/hooks/use-global-store-data";

export default function AdminNetworkPage() {
  const providerData = useProvidersData();
  const assetData = useAssetsData();

  return (
    <div className="space-y-8">
        <div>
            <h1 className="text-3xl font-bold">Network Management</h1>
            <p className="text-muted-foreground">
                Manage your external network of freelancers, partners, and service providers.
            </p>
        </div>

        <ProviderTable {...providerData} isClient={true} />
        <AssetTable {...assetData} isClient={true} />
    </div>
  );
}

    


