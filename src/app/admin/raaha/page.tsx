
import AgencyDashboardPage from '@/app/raaha/agency-dashboard/page';
import { getRaahaData } from '@/lib/firestore';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Agency Dashboard | RAAHA",
  description: "Manage your domestic workforce agency. View client requests, manage your candidates, and update your agency settings.",
};

export default async function AdminRaahaPage() {
    const { raahaAgencies, raahaWorkers, raahaRequests } = await getRaahaData();
    return <AgencyDashboardPage initialAgencies={raahaAgencies} initialRequests={raahaRequests} initialWorkers={raahaWorkers} />;
}
