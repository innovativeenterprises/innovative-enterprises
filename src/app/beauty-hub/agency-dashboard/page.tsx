
import AgencyDashboardClient from './client-page';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Agency Dashboard | RAAHA",
  description: "Manage your domestic workforce agency. View client requests, manage your candidates, and update your agency settings.",
};

export default function AgencyDashboardPage() {
    return <AgencyDashboardClient />;
}
