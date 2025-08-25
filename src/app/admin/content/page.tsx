
'use client';

import { useServicesData } from "../service-table";
import ServiceTable from "../service-table";
import { useProductsData } from "../product-table";
import ProductTable from "../product-table";
import { useClientsData } from "../client-table";
import ClientTable from "../client-table";

export default function AdminContentPage() {
  const serviceData = useServicesData();
  const productData = useProductsData();
  const clientData = useClientsData();

  return (
    <div className="space-y-8">
        <div>
            <h1 className="text-3xl font-bold">Site Content</h1>
            <p className="text-muted-foreground">
                Manage your public-facing services, products, and client testimonials.
            </p>
        </div>
        <ServiceTable {...serviceData} />
        <ProductTable {...productData} />
        <ClientTable {...clientData} />
    </div>
  );
}
