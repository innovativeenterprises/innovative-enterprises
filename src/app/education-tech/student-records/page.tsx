
'use server';

import type { Metadata } from 'next';
import { getStudents } from '@/lib/firestore';
import StudentRecordsClientPage from '@/app/admin/education-tech/student-records/client-page';

export const metadata: Metadata = {
  title: "Student Records | EduFlow Suite",
  description: "A central database for managing all student profiles and academic records.",
};


export default async function StudentRecordsPage() {
    const students = await getStudents();
    return <StudentRecordsClientPage initialStudents={students} />;
}
