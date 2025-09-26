'use server';

import type { Metadata } from 'next';
import StudentHousingClientPage from './client-page';

export const metadata: Metadata = {
  title: "Student Housing Management | EduFlow Suite",
  description: "A centralized dashboard for managing student housing agreements and payments.",
};


export default async function StudentHousingPage() {
    // Data is loaded into the global store in the root layout.
    // The client component will access it from there.
    return <StudentHousingClientPage />;
}
