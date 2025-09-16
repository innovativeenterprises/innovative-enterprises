import StudentHousingClientPage from './client-page';
import { initialLeases } from '@/lib/leases';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Student Housing Management | EduFlow Suite",
  description: "A centralized dashboard for managing student housing agreements and payments.",
};


export default function StudentHousingPage() {
    return <StudentHousingClientPage initialLeases={initialLeases} />;
}
