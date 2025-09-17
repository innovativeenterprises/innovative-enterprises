
import StudentRecordsClientPage from './client-page';
import { initialStudents } from '@/lib/students';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Student Record Management | EduFlow Suite",
  description: "A central database for managing all student profiles and academic records.",
};


export default function StudentRecordsPage() {
    const students = initialStudents;
    return <StudentRecordsClientPage initialStudents={students} />;
}
