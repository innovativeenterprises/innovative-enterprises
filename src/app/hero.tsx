
'use server';

import CompanyOverview from '@/components/company-overview';
import { getClients } from '@/lib/firestore';

export default async function Hero() {
  const clients = await getClients();
  return <CompanyOverview clients={clients} />;
}
