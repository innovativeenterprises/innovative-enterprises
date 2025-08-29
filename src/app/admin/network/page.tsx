
'use client';

import ProviderTable, { useProvidersData } from "../provider-table";
import AssetTable, { useAssetsData } from "../asset-table";

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

        <ProviderTable {...providerData} />
        <AssetTable {...assetData} />
    </div>
  );
}
