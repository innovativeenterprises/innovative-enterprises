
'use server';

import StudentFinancialsClientPage from '@/app/admin/education-tech/student-financials/client-page';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Student Financials | EduFlow Suite",
  description: "A dashboard for managing student tuition, scholarships, and payments.",
};


export default async function AdminStudentFinancialsPage() {
    return <StudentFinancialsClientPage />;
}
