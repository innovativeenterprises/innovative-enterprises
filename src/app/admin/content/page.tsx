
'use client';

import ServiceTable from "./service-table";
import ProductTable from "../product-table";
import ClientTable from "./client-table";
import TestimonialTable from "./testimonial-table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PricingTable from "../settings/pricing-table";
import PosProductTable from "../settings/pos-product-table";
import type { Metadata } from 'next';

// Although this is a client component, we can still provide metadata.
// Next.js will handle this correctly.
export const metadata: Metadata = {
    title: "Site Content Management",
    description: "Manage your public-facing services, products, clients, and pricing."
};


export default function AdminContentPage() {
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
          <TabsTrigger value="pos_products">POS Products</TabsTrigger>
        </TabsList>
        <TabsContent value="services" className="mt-6">
          <ServiceTable />
        </TabsContent>
        <TabsContent value="products" className="mt-6">
            <ProductTable />
        </TabsContent>
        <TabsContent value="clients" className="mt-6">
          <div className="space-y-8">
            <ClientTable />
            <TestimonialTable />
          </div>
        </TabsContent>
         <TabsContent value="pricing" className="mt-6">
            <div className="space-y-8">
                <PricingTable />
            </div>
        </TabsContent>
         <TabsContent value="pos_products" className="mt-6">
            <div className="space-y-8">
                <PosProductTable />
            </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
