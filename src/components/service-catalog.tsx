
'use client';

import { useServicesData } from '@/hooks/use-data-hooks';
import ServiceCatalogClient from './service-catalog-client';

export default function ServiceCatalog() {
  const { data: services } = useServicesData();
  
  return <ServiceCatalogClient services={services} />;
}
