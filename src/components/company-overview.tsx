
'use server';

import { getClients } from '@/lib/firestore';
import CompanyOverviewClient from './company-overview-client';


export default async function CompanyOverview() {
    const clients = await getClients();
    return <CompanyOverviewClient clients={clients} />;
}
