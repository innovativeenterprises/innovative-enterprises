
'use client';

import ServiceTable from "@/app/admin/service-table";
import ProductTable from "@/app/admin/product-table";
import ClientTable from "@/app/admin/client-table";
import PricingTable from "@/app/admin/pricing-table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PosProductTable from "@/app/admin/pos-product-table";
import { useServicesData } from "@/hooks/use-global-store-data";
import { useProductsData } from "@/hooks/use-global-store-data";
import { useClientsData, useTestimonialsData } from "@/hooks/use-global-store-data";
import { usePricingData } from "@/hooks/use-global-store-data";
import { usePosProductsData } from "@/hooks/use-global-store-data";
import { initialStages } from "@/lib/stages";

export default function AdminContentPage() {
    // Data is now fetched via hooks on the client.
    const { services } = useServicesData();
    const { products } = useProductsData();
    const { clients } = useClientsData();
    const { testimonials } = useTestimonialsData();
    const { pricing } = usePricingData();
    const { posProducts } = usePosProductsData();
    const stages = initialStages; // This is small and can remain static

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold">Site Content</h1>
                <p className="text-muted-foreground">
                    Manage your public-facing services, products, clients, and pricing.
                </p>
            </div>
            <Tabs defaultValue="services" className="w-full">
                <TabsList className="grid w-full grid-cols-5">
                    <TabsTrigger value="services">Services</TabsTrigger>
                    <TabsTrigger value="products">Products</TabsTrigger>
                    <TabsTrigger value="clients">Clients & Testimonials</TabsTrigger>
                    <TabsTrigger value="pricing">Translation Pricing</TabsTrigger>
                    <TabsTrigger value="pos">AI-POS Products</TabsTrigger>
                </TabsList>
                <TabsContent value="services" className="mt-6">
                    <ServiceTable initialServices={services} />
                </TabsContent>
                <TabsContent value="products" className="mt-6">
                    <ProductTable initialProducts={products} initialStages={stages} />
                </TabsContent>
                <TabsContent value="clients" className="mt-6">
                    <ClientTable initialClients={clients} initialTestimonials={testimonials} />
                </TabsContent>
                <TabsContent value="pricing" className="mt-6">
                    <PricingTable />
                </TabsContent>
                <TabsContent value="pos" className="mt-6">
                    <PosProductTable initialProducts={posProducts} />
                </TabsContent>
            </Tabs>
        </div>
    );
}
