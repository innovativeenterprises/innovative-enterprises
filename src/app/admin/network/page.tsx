
import ProviderTable from "@/app/admin/provider-table";
import AssetTable from "@/app/admin/asset-table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getProviders } from "@/lib/firestore";
import { getAssets } from "@/lib/firestore";
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Network Management",
  description: "Manage your external network of providers and rental assets.",
};

export default async function AdminNetworkPage() {
  const [providers, assets] = await Promise.all([
    getProviders(),
    getAssets(),
  ]);

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
                <ProviderTable initialProviders={providers} />
            </TabsContent>
            <TabsContent value="assets" className="mt-6">
                <AssetTable initialAssets={assets} />
            </TabsContent>
        </Tabs>

    </div>
  );
}
