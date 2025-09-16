import { initialStudents } from '@/lib/students';
import StudentRecordsClientPage from './client-page';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Student Record Management | EduFlow Suite",
  description: "A central database for managing all student profiles and academic records.",
};


export default function StudentRecordsPage() {
    return <StudentRecordsClientPage initialStudents={initialStudents} />;
}
