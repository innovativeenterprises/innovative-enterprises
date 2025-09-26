
'use server';

import StudentFinancialsClientPage from './client-page';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Admin - Student Financials",
  description: "A dashboard for managing student tuition, scholarships, and payments.",
};


export default async function AdminStudentFinancialsPage() {
    return <StudentFinancialsClientPage />;
}
