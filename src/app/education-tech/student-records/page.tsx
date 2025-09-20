import StudentRecordsClientPage from './client-page';
import type { Metadata } from 'next';
import { getStudents } from '@/lib/firestore';

export const metadata: Metadata = {
  title: "Admin - Student Records",
  description: "A central database for managing all student profiles and academic records.",
};


export default async function AdminStudentRecordsPage() {
    const students = await getStudents();
    return <StudentRecordsClientPage initialStudents={students} />;
}
