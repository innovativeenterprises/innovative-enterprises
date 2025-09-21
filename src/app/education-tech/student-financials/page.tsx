
'use server';

import StudentFinancialsClientPage from './client-page';
import { getStudents } from '@/lib/firestore';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: "Student Financials | EduFlow Suite",
    description: "A dashboard for managing student tuition, scholarships, and payments.",
};

export default async function StudentFinancialsPage() {
    const students = await getStudents();
    return <StudentFinancialsClientPage initialStudents={students} />;
}
