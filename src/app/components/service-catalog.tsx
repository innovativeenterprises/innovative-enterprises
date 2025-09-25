
'use server';

import ServiceCatalogClient from './service-catalog-client';
import type { Service } from '@/lib/services.schema';

export default async function ServiceCatalog({ services }: { services: Service[]}) {
    return <ServiceCatalogClient services={services} />;
}
