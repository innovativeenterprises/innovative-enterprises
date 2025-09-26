
'use server';

import CompanyOverviewClient from '@/app/components/company-overview-client';

export default async function CompanyOverview() {
  // The client component now fetches its own data.
  return <CompanyOverviewClient />;
}
