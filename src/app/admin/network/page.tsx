

'use client';

import ProviderTable from "../provider-table";
import AssetTable from "../asset-table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";


export default function AdminNetworkPage() {

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
                <AssetTable />
            </TabsContent>
        </Tabs>

    </div>
  );
}

    