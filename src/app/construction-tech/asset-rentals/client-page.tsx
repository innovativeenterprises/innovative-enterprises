'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight } from "lucide-react";
import Image from 'next/image';
import type { Asset } from "@/lib/assets.schema";
import { RentalRequestForm } from './rental-form';
import { Skeleton } from '@/components/ui/skeleton';
import AssetRentalAgentForm from '@/app/admin/operations/asset-rental-agent-form';

const AssetCard = ({ asset, onRent }: { asset: Asset; onRent: (asset: Asset) => void }) => {
    const getStatusBadge = (status: string) => {
        switch (status) {
            case "Available": return <Badge variant="default" className="bg-green-500/20 text-green-700 hover:bg-green-500/30">Available</Badge>;
            case "Rented": return <Badge variant="secondary" className="bg-yellow-500/20 text-yellow-700 hover:bg-yellow-500/30">Rented</Badge>;
            case "Maintenance": return <Badge variant="destructive" className="bg-gray-500/20 text-gray-700 hover:bg-gray-500/30">Maintenance</Badge>;
            default: return <Badge variant="outline">{status}</Badge>;
        }
    }
    
    return (
        <Card className="flex flex-col group transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
            <CardHeader className="p-0">
                <div className="relative h-48 w-full overflow-hidden rounded-t-lg">
                    <Image
                        src={asset.image}
                        alt={asset.name}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        data-ai-hint={asset.aiHint}
                    />
                </div>
            </CardHeader>
            <CardContent className="p-4 flex-grow">
                <div className="flex justify-between items-start">
                    <Badge variant="outline">{asset.type}</Badge>
                    {getStatusBadge(asset.status)}
                </div>
                <CardTitle className="mt-2">{asset.name}</CardTitle>
                <CardDescription className="text-sm mt-1">{asset.specs}</CardDescription>
            </CardContent>
            <CardFooter className="flex justify-between items-center p-4 pt-0">
                <div>
                    <p className="text-xl font-bold text-primary">OMR {asset.monthlyPrice.toFixed(2)}</p>
                    <p className="text-xs text-muted-foreground">/ month</p>
                </div>
                <Button onClick={() => onRent(asset)} disabled={asset.status !== 'Available'}>
                    Rent Now <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
            </CardFooter>
        </Card>
    );
};

export default function AssetRentalsClientPage({ initialAssets }: { initialAssets: Asset[] }) {
    const [assets, setAssets] = useState<Asset[]>(initialAssets);
    const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
    const [isFormOpen, setIsFormOpen] = useState(false);
    
    const handleRentClick = (asset: Asset) => {
        setSelectedAsset(asset);
        setIsFormOpen(true);
    };

    const handleFormClose = () => {
        setIsFormOpen(false);
        setSelectedAsset(null);
    };
    
    const availableAssets = assets.filter(asset => asset.status === 'Available');

    return (
        <div className="space-y-16">
             <div className="max-w-4xl mx-auto">
                 <AssetRentalAgentForm />
            </div>

            <div className="max-w-6xl mx-auto">
                <h2 className="text-3xl font-bold text-center mb-8">Available Assets</h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {availableAssets.map((asset) => (
                        <AssetCard key={asset.id} asset={asset} onRent={handleRentClick} />
                    ))}
                </div>
            </div>

            {selectedAsset && (
                <RentalRequestForm
                    asset={selectedAsset}
                    isOpen={isFormOpen}
                    onOpenChange={setIsFormOpen}
                    onClose={handleFormClose}
                />
            )}
        </div>
    );
}
