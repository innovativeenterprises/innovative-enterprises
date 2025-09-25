
'use server';

import StudentRecordsClientPage from '@/app/admin/education-tech/student-records/client-page';
import { getStudents } from '@/lib/firestore';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Student Record Management | EduFlow Suite",
  description: "A central database for managing all student profiles and academic records.",
};


export default async function StudentRecordsPage() {
    const students = await getStudents();
    return <StudentRecordsClientPage initialStudents={students} />;
}
