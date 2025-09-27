
'use server';

import StudentHousingClientPage from '@/app/real-estate-tech/student-housing/client-page';
import type { Metadata } from 'next';
import { getLeases } from '@/lib/firestore';

export const metadata: Metadata = {
  title: "Student Housing Management | EduFlow Suite",
  description: "A centralized dashboard for managing student housing agreements and payments.",
};


export default async function StudentHousingPage() {
    const initialLeases = await getLeases();
    return <StudentHousingClientPage initialLeases={initialLeases} />;
}
