
'use client';

import { useState, useEffect } from "react";
import ProviderTable from "@/app/admin/provider-table";
import AssetTable from "@/app/admin/asset-table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useProvidersData } from "@/hooks/use-global-store-data";
import { useAssetsData } from "@/hooks/use-global-store-data";


export default function AdminNetworkPage() {
  const { providers, setProviders, isClient: isProvidersClient } = useProvidersData();
  const { assets, setAssets, isClient: isAssetsClient } = useAssetsData();
  const isClient = isProvidersClient && isAssetsClient;

  // Since we are now passing data down, we don't fetch it here anymore.
  // The use...Data hooks still manage the client-side state for interactivity.

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
                <ProviderTable providers={providers} setProviders={setProviders} isClient={isClient} />
            </TabsContent>
            <TabsContent value="assets" className="mt-6">
                <AssetTable assets={assets} setAssets={setAssets} isClient={isClient} />
            </TabsContent>
        </Tabs>

    </div>
  );
}
