'use client';

import CompanyOverview from '@/components/company-overview';
import ServiceCatalog from '@/components/service-catalog';
import ProductShowcase from '@/components/product-showcase';
import ClientTestimonials from '@/components/client-testimonials';
import AiToolsCta from '@/components/ai-tools-cta';
import ChatWidget from '@/components/chat-widget';
import { useServicesData, useProductsData, useClientsData } from '@/hooks/use-global-store-data';

export default function Home() {
  const { services } = useServicesData();
  const { products } = useProductsData();
  const { clients, testimonials } = useClientsData();
  
  return (
    <>
      <CompanyOverview />
      <ServiceCatalog services={services} />
      <ProductShowcase products={products} />
      <ClientTestimonials clients={clients} testimonials={testimonials} />
      <AiToolsCta />
      <ChatWidget />
    </>
  )
}
