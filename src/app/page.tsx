
import HomePageClient from './home-page-client';
import { getServices, getProducts, getClients, getTestimonials } from '@/lib/firestore';


export default async function Home() {
  // Data is fetched on the server and passed down to the client component.
  // This avoids client-side data fetching on initial load.
  const [products, services, clients, testimonials] = await Promise.all([
    getProducts(),
    getServices(),
    getClients(),
    getTestimonials(),
  ]);

  return (
    <HomePageClient 
        products={products}
        services={services}
        clients={clients}
        testimonials={testimonials}
    />
  );
}
