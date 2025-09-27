
'use server';

import { getLeases } from '@/lib/firestore';
import type { Metadata } from 'next';
import StudentHousingClientPage from './client-page';

export const metadata: Metadata = {
  title: "Student Housing Management | EduFlow Suite",
  description: "A centralized dashboard for managing student housing agreements and payments.",
};


export default async function StudentHousingPage() {
    const initialLeases = await getLeases();
    return <StudentHousingClientPage initialLeases={initialLeases} />;
}
