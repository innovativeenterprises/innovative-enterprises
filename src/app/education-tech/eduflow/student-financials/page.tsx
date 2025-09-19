
import StudentFinancialsClientPage from './client-page';
import { getStudents } from '@/lib/firestore';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Student Financials | EduFlow Suite",
  description: "A centralized dashboard for managing student tuition fees, scholarships, and payment statuses within the EduFlow administrative platform.",
};

export default async function StudentFinancialsPage() {
    const students = await getStudents();
    return <StudentFinancialsClientPage initialStudents={students} />;
}
