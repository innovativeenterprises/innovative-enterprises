
'use server';

import { getLeases } from '@/lib/firestore';
import type { Metadata } from 'next';
import StudentHousingClientPage from '@/app/admin/education-tech/student-housing/client-page';

export const metadata: Metadata = {
  title: "Student Housing Management | EduFlow Suite",
  description: "A centralized dashboard for managing student housing agreements and payments.",
};


export default async function StudentHousingPage() {
    const leases = await getLeases();
    return <StudentHousingClientPage initialLeases={leases} />;
}
