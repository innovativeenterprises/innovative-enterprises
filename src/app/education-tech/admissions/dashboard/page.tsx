'use server';

import AdmissionsDashboardClient from './admissions-dashboard-client';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Admissions Dashboard",
  description: "An overview of all submitted student applications.",
};


export default async function AdmissionsDashboardPage() {
    return <AdmissionsDashboardClient />;
}
