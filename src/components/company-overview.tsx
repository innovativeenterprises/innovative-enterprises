
'use server';

import CompanyOverviewClient from './company-overview-client';
import { getClients } from '@/lib/firestore';

export default async function CompanyOverview() {
    const clients = await getClients();
    return <CompanyOverviewClient clients={clients} />;
}
