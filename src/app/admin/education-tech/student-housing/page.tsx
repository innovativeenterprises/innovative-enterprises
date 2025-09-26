
'use server';

import type { Metadata } from 'next';
import StudentHousingClientPage from './client-page';

export const metadata: Metadata = {
  title: "Admin - Student Housing | Innovative Enterprises",
  description: "A centralized dashboard for managing student housing agreements and payments.",
};


export default async function AdminStudentHousingPage() {
    return <StudentHousingClientPage />;
}
