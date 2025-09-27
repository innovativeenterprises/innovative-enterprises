
'use client';

import ServiceCatalogClient from './service-catalog-client';
import { useServicesData } from '@/hooks/use-data-hooks';

export default function ServiceCatalog() {
  const { data: services } = useServicesData();
  
  return (
    <ServiceCatalogClient services={services} />
  );
}

