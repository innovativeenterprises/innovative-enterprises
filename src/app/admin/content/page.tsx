
'use server';

import ServiceTable from "@/app/admin/service-table";
import ProductTable from "@/app/admin/product-table";
import ClientTable from "@/app/admin/client-table";
import PricingTable from "@/app/admin/pricing-table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PosProductTable from "@/app/admin/pos-product-table";
import TestimonialTable from "@/app/admin/testimonial-table";
import { getPricing, getProducts, getServices, getClients, getTestimonials, getPosProducts, getStages } from "@/lib/firestore";


export default async function AdminContentPage() {
    const [services, products, stages, clients, testimonials, pricing, posProducts] = await Promise.all([
        getServices(),
        getProducts(),
        getStages(),
        getClients(),
        getTestimonials(),
        getPricing(),
        getPosProducts(),
    ]);

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold">Site Content</h1>
                <p className="text-muted-foreground">
                    Manage your public-facing services, products, clients, and pricing.
                </p>
            </div>
            <Tabs defaultValue="services" className="w-full">
                <TabsList className="grid w-full grid-cols-6">
                    <TabsTrigger value="services">Services</TabsTrigger>
                    <TabsTrigger value="products">Products</TabsTrigger>
                    <TabsTrigger value="clients">Clients</TabsTrigger>
                    <TabsTrigger value="testimonials">Testimonials</TabsTrigger>
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
                    <ClientTable initialClients={clients} />
                </TabsContent>
                 <TabsContent value="testimonials" className="mt-6">
                    <TestimonialTable initialTestimonials={testimonials} />
                </TabsContent>
                <TabsContent value="pricing" className="mt-6">
                    <PricingTable initialPricing={pricing} />
                </TabsContent>
                <TabsContent value="pos" className="mt-6">
                    <PosProductTable initialProducts={posProducts} />
                </TabsContent>
            </Tabs>
        </div>
    );
}

