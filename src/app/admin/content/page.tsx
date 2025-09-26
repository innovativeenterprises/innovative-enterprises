
'use client';

import ServiceTable from "../service-table";
import ProductTable from "../product-table";
import ClientTable from "../client-table";
import TestimonialTable from "../testimonial-table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useGlobalStore } from "@/hooks/use-data-hooks";

export default function AdminContentPage() {
    // Ensure all necessary data is loaded via the global store
    useGlobalStore(state => state.services);
    useGlobalStore(state => state.products);
    useGlobalStore(state => state.stages);
    useGlobalStore(state => state.clients);
    useGlobalStore(state => state.testimonials);
    useGlobalStore(state => state.pricing);
    useGlobalStore(state => state.posProducts);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Site Content</h1>
        <p className="text-muted-foreground">
          Manage your public-facing services, products, and client testimonials.
        </p>
      </div>
      <Tabs defaultValue="services" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="services">Services</TabsTrigger>
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="clients">Clients & Testimonials</TabsTrigger>
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
      </Tabs>
    </div>
  );
}
