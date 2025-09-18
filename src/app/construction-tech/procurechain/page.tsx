
import { getAssets } from "@/lib/firestore";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Package } from "lucide-react";
import AssetTable from "@/app/admin/asset-table";
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "ProcureChain SaaS | Innovative Enterprises",
  description: "An e-procurement platform with automated vendor approvals, asset rentals, and predictive ordering for the construction industry.",
};

export default async function ProcureChainPage() {
    const assets = await getAssets();

    return (
        <div className="bg-background min-h-[calc(100vh-8rem)]">
            <div className="container mx-auto px-4 py-16">
                <div className="max-w-6xl mx-auto space-y-8">
                     <div className="text-center">
                        <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit mb-4">
                            <Package className="w-10 h-10 text-primary" />
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold text-primary">ProcureChain SaaS</h1>
                        <p className="mt-4 text-lg text-muted-foreground">
                            A centralized e-procurement platform for managing asset rentals, vendor approvals, and purchase orders.
                        </p>
                    </div>

                    <AssetTable initialAssets={assets} />
                </div>
            </div>
        </div>
    );
}
