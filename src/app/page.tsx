
'use client';
    
import CompanyOverview from '@/components/company-overview';
import ServiceCatalog from '@/components/service-catalog';
import ProductShowcase from '@/components/product-showcase';
import ClientTestimonials from '@/components/client-testimonials';
import AiToolsCta from '@/components/ai-tools-cta';
import ChatWidget from '@/components/chat-widget';
import { useServicesData, useProductsData, useClientsData } from '@/hooks/use-global-store-data';

export default function Home() {
  const { services, isClient: isServicesClient } = useServicesData();
  const { products, isClient: isProductsClient } = useProductsData();
  const { clients, testimonials, isClient: isClientsClient } = useClientsData();

  const isClient = isServicesClient && isProductsClient && isClientsClient;

  return (
    <>
      <CompanyOverview />
      {isClient ? (
        <>
          <ServiceCatalog services={services} />
          <ProductShowcase products={products} />
          <ClientTestimonials clients={clients} testimonials={testimonials} />
        </>
      ) : (
        <div className="container mx-auto px-4 py-16">
          <div className="animate-pulse space-y-16">
            <div className="h-64 bg-muted rounded-lg"></div>
            <div className="h-64 bg-muted rounded-lg"></div>
            <div className="h-64 bg-muted rounded-lg"></div>
          </div>
        </div>
      )}
      <AiToolsCta />
      <ChatWidget />
    </>
  )
}
