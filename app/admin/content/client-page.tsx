
'use client';

import ServiceTable from "@/app/admin/service-table";
import ProductTable from "@/app/admin/product-table";
import ClientTable from "@/app/admin/client-table";
import TestimonialTable from "@/app/admin/testimonial-table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PricingTable from "@/app/admin/pricing-table";
import PosProductTable from "@/app/admin/settings/pos-product-table";
import { useGlobalStore } from "@/hooks/use-data-hooks";


export default function AdminContentClientPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Site Content</h1>
        <p className="text-muted-foreground">
          Manage your public-facing services, products, and client testimonials.
        </p>
      </div>
      <Tabs defaultValue="services" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="services">Services</TabsTrigger>
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="clients">Clients & Testimonials</TabsTrigger>
          <TabsTrigger value="pricing">Pricing</TabsTrigger>
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
      </Tabs>
    </div>
  );
}
