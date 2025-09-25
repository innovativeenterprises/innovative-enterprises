
'use client';

import ServiceTable from "@/app/admin/service-table";
import ProductTable from "@/app/admin/product-table";
import ClientTable from "@/app/admin/client-table";
import TestimonialTable from "@/app/admin/testimonial-table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Service } from "@/lib/services.schema";
import type { Product } from "@/lib/products.schema";
import type { ProjectStage } from "@/lib/stages";
import type { Client, Testimonial } from "@/lib/clients.schema";
import type { Pricing } from "@/lib/pricing.schema";
import type { PosProduct } from "@/lib/pos-data.schema";
import PricingTable from "@/app/admin/pricing-table";
import PosProductTable from "@/app/admin/pos-product-table";
import KnowledgeTable from "@/app/admin/operations/knowledge-table";
import CostSettingsTable from "../operations/cost-settings-table";
import type { KnowledgeDocument } from "@/lib/knowledge.schema";
import type { CostRate } from "@/lib/cost-settings.schema";


interface AdminContentClientPageProps {
    initialServices: Service[];
    initialProducts: Product[];
    initialStages: ProjectStage[];
    initialClients: Client[];
    initialTestimonials: Testimonial[];
    initialPricing: Pricing[];
    initialPosProducts: PosProduct[];
    initialKnowledgeBase: KnowledgeDocument[];
    initialCostSettings: CostRate[];
}

export default function AdminContentClientPage({
    initialServices,
    initialProducts,
    initialStages,
    initialClients,
    initialTestimonials,
    initialPricing,
    initialPosProducts,
    initialKnowledgeBase,
    initialCostSettings,
}: AdminContentClientPageProps) {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Site Content &amp; Data</h1>
        <p className="text-muted-foreground">
          Manage public-facing content and core data powering the AI.
        </p>
      </div>
      <Tabs defaultValue="services" className="w-full">
        <TabsList className="grid w-full grid-cols-7">
          <TabsTrigger value="services">Services</TabsTrigger>
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="clients">Clients</TabsTrigger>
          <TabsTrigger value="pricing">Pricing</TabsTrigger>
          <TabsTrigger value="pos-products">POS</TabsTrigger>
          <TabsTrigger value="knowledge">Knowledge</TabsTrigger>
          <TabsTrigger value="costing">Rates</TabsTrigger>
        </TabsList>
        <TabsContent value="services" className="mt-6">
          <ServiceTable initialServices={initialServices} />
        </TabsContent>
        <TabsContent value="products" className="mt-6">
          <ProductTable
            initialProducts={initialProducts}
            initialStages={initialStages}
          />
        </TabsContent>
        <TabsContent value="clients" className="mt-6">
          <div className="space-y-8">
            <ClientTable initialClients={initialClients} />
            <TestimonialTable initialTestimonials={initialTestimonials} />
          </div>
        </TabsContent>
        <TabsContent value="pricing" className="mt-6">
          <PricingTable initialPricing={initialPricing} />
        </TabsContent>
        <TabsContent value="pos-products" className="mt-6">
            <PosProductTable initialProducts={initialPosProducts} />
        </TabsContent>
        <TabsContent value="knowledge" className="mt-6">
            <KnowledgeTable initialKnowledgeBase={initialKnowledgeBase} />
        </TabsContent>
         <TabsContent value="costing" className="mt-6 space-y-8">
            <CostSettingsTable initialRates={initialCostSettings} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
