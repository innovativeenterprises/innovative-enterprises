
'use client';

import ServiceTable from "../service-table";
import ProductTable from "../product-table";
import ClientTable from "../client-table";
import PricingTable from "../pricing-table";
import { useServicesData, setServices, useProductsData, setProducts } from "@/hooks/use-global-store-data";

export default function AdminContentPage() {
  const { services } = useServicesData();
  const { products } = useProductsData();

  return (
    <div className="space-y-8">
        <div>
            <h1 className="text-3xl font-bold">Site Content</h1>
            <p className="text-muted-foreground">
                Manage your public-facing services, products, and client testimonials.
            </p>
        </div>
        <ServiceTable services={services} setServices={setServices} />
        <ProductTable products={products} setProducts={setProducts} />
        <ClientTable />
        <PricingTable />
    </div>
  );
}
