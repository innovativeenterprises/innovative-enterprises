
'use client';

import ProviderTable from "../provider-table";
import AssetTable from "../asset-table";

export default function AdminNetworkPage() {

  return (
    <div className="space-y-8">
        <div>
            <h1 className="text-3xl font-bold">Network Management</h1>
            <p className="text-muted-foreground">
                Manage your external network of freelancers, partners, and service providers.
            </p>
        </div>

        <ProviderTable />
        <AssetTable />
    </div>
  );
}
