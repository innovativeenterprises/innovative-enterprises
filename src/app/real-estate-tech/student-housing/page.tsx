import StudentHousingClientPage from './client-page';
import { initialLeases } from '@/lib/leases';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Student Housing Management | EduFlow Suite",
  description: "A centralized dashboard for managing student housing agreements and payments.",
};


export default function StudentHousingPage() {
    // Data is fetched on the server and passed to the client component.
    const leases = initialLeases;
    return <StudentHousingClientPage initialLeases={leases} />;
}
