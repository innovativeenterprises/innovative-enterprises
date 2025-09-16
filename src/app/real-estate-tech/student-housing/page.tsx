import StudentHousingClientPage from './client-page';
import { initialLeases } from '@/lib/leases';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Student Housing Management | EduFlow Suite",
  description: "A centralized dashboard for managing all student housing agreements, tracking payments, and monitoring lease expiries.",
};

export default function StudentHousingPage() {
    return <StudentHousingClientPage initialLeases={initialLeases} />;
}
