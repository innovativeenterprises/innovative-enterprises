import AdmissionsDashboardClient from './admissions-dashboard-client';
import type { Metadata } from 'next';
import { getApplications } from '@/lib/firestore';

export const metadata: Metadata = {
  title: "Admissions Dashboard",
  description: "An overview of all submitted student applications.",
};


export default async function AdmissionsDashboardPage() {
    const applications = await getApplications();
    return <AdmissionsDashboardClient initialApplications={applications} />;
}
