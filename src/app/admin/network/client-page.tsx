
'use client';

import type { Provider } from '@/lib/providers.schema';
import type { Asset } from '@/lib/assets.schema';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProviderTable from '@/components/provider-table';
import AssetTable from '../asset-table';

export default function NetworkPageClient({ initialProviders, initialAssets }: { initialProviders: Provider[], initialAssets: Asset[] }) {
    
    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold">Network Management</h1>
                <p className="text-muted-foreground">Manage your external network of providers and rental assets.</p>
            </div>
            <Tabs defaultValue="providers">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="providers">Providers & Partners</TabsTrigger>
                    <TabsTrigger value="assets">Rental Assets</TabsTrigger>
                </TabsList>
                <TabsContent value="providers" className="mt-6">
                    <ProviderTable initialProviders={initialProviders} />
                </TabsContent>
                <TabsContent value="assets" className="mt-6">
                    <AssetTable initialAssets={initialAssets} />
                </TabsContent>
            </Tabs>
        </div>
    );
}
