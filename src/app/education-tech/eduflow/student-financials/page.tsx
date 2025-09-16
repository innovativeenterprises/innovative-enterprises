
import StudentFinancialsClientPage from './client-page';
import { initialStudents } from '@/lib/students';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Student Financials | EduFlow Suite",
  description: "A centralized dashboard for managing student tuition fees, scholarships, and payment statuses within the EduFlow administrative platform.",
};

export default function StudentFinancialsPage() {
    return <StudentFinancialsClientPage initialStudents={initialStudents} />;
}
