'use client';

import AiToolsCta from "@/components/ai-tools-cta";
import ClientTestimonials from "@/components/client-testimonials";
import CompanyOverview from "@/components/company-overview";
import ProductShowcase from "@/components/product-showcase";
import ServiceCatalog from "@/components/service-catalog";
import type { Product } from '@/lib/products.schema';
import type { Service } from '@/lib/services.schema';
import type { Client, Testimonial } from '@/lib/clients.schema';

interface HomePageClientProps {
    products: Product[];
    services: Service[];
    clients: Client[];
    testimonials: Testimonial[];
}

export default function HomePageClient({ products, services, clients, testimonials }: HomePageClientProps) {
  return (
    <>
      <CompanyOverview clients={clients} />
      <ServiceCatalog services={services} />
      <ProductShowcase products={products} />
      <ClientTestimonials clients={clients} testimonials={testimonials} />
      <AiToolsCta />
    </>
  );
}
