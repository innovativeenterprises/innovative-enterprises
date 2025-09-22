
'use server';

import { getServices } from "@/lib/firestore";
import ServiceCatalogClient from './service-catalog-client';

export default async function ServiceCatalog() {
  const services = await getServices();
  
  return (
    <ServiceCatalogClient services={services} />
  );
}
