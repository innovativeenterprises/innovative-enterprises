
'use server';

import ServiceTable from "@/app/admin/service-table";
import ProductTable from "@/app/admin/product-table";
import ClientTable from "@/app/admin/client-table";
import TestimonialTable from "@/app/admin/testimonial-table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getProducts, getServices, getClients, getTestimonials, getStages } from "@/lib/firestore";
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: "Site Content & Data",
    description: "Manage your public-facing services, products, and clients."
};


export default async function AdminContentPage() {
    const [services, products, stages, clients, testimonials] = await Promise.all([
        getServices(),
        getProducts(),
        getStages(),
        getClients(),
        getTestimonials(),
    ]);

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold">Site Content & Data</h1>
                <p className="text-muted-foreground">
                Manage your public-facing services, products, and client information.
                </p>
            </div>
            <Tabs defaultValue="services" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="services">Services</TabsTrigger>
                <TabsTrigger value="products">Products</TabsTrigger>
                <TabsTrigger value="clients">Clients & Testimonials</TabsTrigger>
                </TabsList>
                <TabsContent value="services" className="mt-6">
                <ServiceTable initialServices={services} />
                </TabsContent>
                <TabsContent value="products" className="mt-6">
                <ProductTable
                    initialProducts={products}
                    initialStages={stages}
                />
                </TabsContent>
                <TabsContent value="clients" className="mt-6">
                <div className="space-y-8">
                    <ClientTable initialClients={clients} />
                    <TestimonialTable initialTestimonials={testimonials} />
                </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}

