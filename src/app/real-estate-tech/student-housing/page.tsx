

import StudentHousingClientPage from '@/app/admin/real-estate/student-housing/client-page';
import { getLeases } from '@/lib/firestore';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Student Housing Management | EduFlow Suite",
  description: "A centralized dashboard for managing student housing agreements and payments.",
};


export default async function StudentHousingPage() {
    const leases = await getLeases();
    return <StudentHousingClientPage initialLeases={leases} />;
}

