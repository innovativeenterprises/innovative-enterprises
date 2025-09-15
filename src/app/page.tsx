import CompanyOverview from '@/components/company-overview';
import ServiceCatalog from '@/components/service-catalog';
import ProductShowcase from '@/components/product-showcase';
import ClientTestimonials from '@/components/client-testimonials';
import AiToolsCta from '@/components/ai-tools-cta';
import ChatWidget from '@/components/chat-widget';
import { store } from '@/lib/global-store';

export default function Home() {
  // Fetch data on the server
  const { services, products, clients, testimonials } = store.get();
  
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
