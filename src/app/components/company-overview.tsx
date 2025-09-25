
'use server';

import CompanyOverviewClient from '@/components/company-overview-client';
import type { Client } from '@/lib/clients.schema';

export default async function CompanyOverview({ clients }: { clients: Client[] }) {
  return <CompanyOverviewClient clients={clients} />;
}
