import HomePageClient from "./home-page-client";
import { getProducts, getServices, getClients, getTestimonials } from "@/lib/firestore";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default async function Home() {
  const [products, services, clients, testimonials] = await Promise.all([
    getProducts(),
    getServices(),
    getClients(),
    getTestimonials(),
  ]);

  return (
    <Suspense fallback={<Skeleton className="h-screen w-full" />}>
      <HomePageClient 
        products={products}
        services={services}
        clients={clients}
        testimonials={testimonials}
      />
    </Suspense>
  );
}
