
'use client';

import ServiceTable from "@/app/admin/service-table";
import ProductTable from "@/app/admin/product-table";
import ClientTable from "@/app/admin/client-table";
import PricingTable from "@/app/admin/pricing-table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PosProductTable from "@/app/admin/pos-product-table";
import { initialPricing } from "@/lib/pricing";
import { initialProducts, initialStoreProducts } from "@/lib/products";
import { initialServices } from "@/lib/services";
import { initialClients, initialTestimonials } from "@/lib/clients";
import { initialPosProducts } from "@/lib/pos-data";
import { initialStages } from "@/lib/stages";
import { useState, useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default function AdminContentPage() {
    const [isClient, setIsClient] = useState(false);
    useEffect(() => { setIsClient(true) }, []);

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold">Site Content</h1>
                <p className="text-muted-foreground">
                    Manage your public-facing services, products, clients, and pricing.
                </p>
            </div>
            {isClient ? (
                <Tabs defaultValue="services" className="w-full">
                    <TabsList className="grid w-full grid-cols-5">
                        <TabsTrigger value="services">Services</TabsTrigger>
                        <TabsTrigger value="products">Products</TabsTrigger>
                        <TabsTrigger value="clients">Clients & Testimonials</TabsTrigger>
                        <TabsTrigger value="pricing">Translation Pricing</TabsTrigger>
                        <TabsTrigger value="pos">AI-POS Products</TabsTrigger>
                    </TabsList>
                    <TabsContent value="services" className="mt-6">
                        <ServiceTable initialServices={initialServices} />
                    </TabsContent>
                    <TabsContent value="products" className="mt-6">
                        <ProductTable initialProducts={initialProducts} initialStages={initialStages} />
                    </TabsContent>
                    <TabsContent value="clients" className="mt-6">
                        <ClientTable initialClients={initialClients} initialTestimonials={initialTestimonials} />
                    </TabsContent>
                    <TabsContent value="pricing" className="mt-6">
                        <PricingTable initialPricing={initialPricing} />
                    </TabsContent>
                    <TabsContent value="pos" className="mt-6">
                        <PosProductTable initialProducts={initialPosProducts} />
                    </TabsContent>
                </Tabs>
            ) : (
                <div className="space-y-8">
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-64 w-full" />
                </div>
            )}
        </div>
    );
}
