

'use server';

import StudentHousingClientPage from './client-page';
import { getLeases } from '@/lib/firestore';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Admin - Student Housing | Innovative Enterprises",
  description: "A centralized dashboard for managing student housing agreements and payments.",
};


export default async function AdminStudentHousingPage() {
    const leases = await getLeases();
    return <StudentHousingClientPage initialLeases={leases} />;
}

