
import HomePageClient from "@/app/home-page-client";
import { getProducts } from "@/lib/firestore";
import { getServices } from "@/lib/firestore";
import { getClients } from "@/lib/firestore";
import { getTestimonials } from "@/lib/firestore";

// This is the main server component for the homepage.
// It fetches all necessary data and passes it to the client component.
export default async function Home() {
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
