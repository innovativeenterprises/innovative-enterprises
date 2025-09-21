
'use client';

import CompanyOverview from "@/components/company-overview";
import ServiceCatalog from "@/components/service-catalog";
import ProductShowcase from "@/components/product-showcase";
import AiToolsCta from "@/components/ai-tools-cta";
import ClientTestimonials from "@/components/client-testimonials";
import type { Product } from '@/lib/products.schema';
import type { Service } from '@/lib/services.schema';
import type { Client, Testimonial } from '@/lib/clients.schema';
import type { AiTool } from '@/lib/nav-links';
import { useState, useEffect } from "react";

export default function HomePage({
  initialProducts,
  initialStoreProducts,
  initialServices,
  initialClients,
  initialTestimonials,
  initialAiTools,
}: {
  initialProducts: Product[];
  initialStoreProducts: Product[];
  initialServices: Service[];
  initialClients: Client[];
  initialTestimonials: Testimonial[];
  initialAiTools: AiTool[];
}) {
  const [allProducts, setAllProducts] = useState<Product[]>([]);

  useEffect(() => {
    const combinedProducts = [...initialProducts, ...initialStoreProducts].filter(p => p.enabled);
    setAllProducts(combinedProducts);
  }, [initialProducts, initialStoreProducts]);

  return (
    <>
      <CompanyOverview clients={initialClients} />
      <ServiceCatalog services={initialServices} />
      <ProductShowcase products={allProducts} />
      <ClientTestimonials clients={initialClients} testimonials={initialTestimonials} />
      <AiToolsCta aiTools={initialAiTools} />
    </>
  );
}
