
'use client';

import { useState, useEffect } from 'react';
import ProviderTable from "@/app/admin/provider-table";
import AssetTable from "@/app/admin/asset-table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { initialProviders } from "@/lib/providers";
import { initialAssets } from "@/lib/assets";
import type { Metadata } from 'next';
import type { Provider } from '@/lib/providers';
import type { Asset } from '@/lib/assets';

export const metadata: Metadata = {
  title: "Network Management",
  description: "Manage your external network of providers and rental assets.",
};

export default function AdminNetworkPage() {
  const [providers, setProviders] = useState<Provider[]>(initialProviders);
  const [assets, setAssets] = useState<Asset[]>(initialAssets);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <div className="space-y-8">
        <div>
            <h1 className="text-3xl font-bold">Network Management</h1>
            <p className="text-muted-foreground">
                Manage your external network of providers and rental assets.
            </p>
        </div>

        <Tabs defaultValue="providers" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="providers">Service Providers</TabsTrigger>
                <TabsTrigger value="assets">Rental Assets</TabsTrigger>
            </TabsList>
            <TabsContent value="providers" className="mt-6">
                <ProviderTable />
            </TabsContent>
            <TabsContent value="assets" className="mt-6">
                <AssetTable initialAssets={assets} setAssets={setAssets} isClient={isClient} />
            </TabsContent>
        </Tabs>

    </div>
  );
}
