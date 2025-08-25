
'use client';

import CompanyOverview from '@/components/company-overview';
import ServiceCatalog from '@/components/service-catalog';
import ProductShowcase from '@/components/product-showcase';
import ClientTestimonials from '@/components/client-testimonials';
import AiToolsCta from '@/components/ai-tools-cta';
import ChatWidget from '@/components/chat-widget';

// The state for these components is now managed in the admin dashboard pages.
// We use these hooks to get the current state. In a real app, this might
// come from a global state manager (like Redux or Zustand) or be fetched
// from a database via an API.
import { useServicesData } from './admin/service-table';
import { useProductsData } from './admin/product-table';
import { useClientsData } from './admin/client-table';

export default function Home() {
  const { services } = useServicesData();
  const { products } = useProductsData();
  const { clients, testimonials } = useClientsData();

  return (
    <div className="flex flex-col">
      <CompanyOverview />
      <ServiceCatalog services={services} />
      <ProductShowcase products={products} />
      <ClientTestimonials clients={clients} testimonials={testimonials} />
      <AiToolsCta />
      <ChatWidget />
    </div>
  );
}
