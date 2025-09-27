
'use server';

import ServiceCatalogClient from './service-catalog-client';
import { getServices } from '@/lib/firestore';

export default async function ServiceCatalog() {
  const services = await getServices();
  
  return (
    <ServiceCatalogClient services={services || []} />
  );
}
