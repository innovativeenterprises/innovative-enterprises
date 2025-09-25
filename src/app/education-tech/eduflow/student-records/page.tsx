
'use server';

import StudentRecordsClientPage from '@/app/admin/education-tech/student-records/page';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Student Record Management | EduFlow Suite",
  description: "A central database for managing all student profiles and academic records.",
};


export default async function StudentRecordsPage() {
    return <StudentRecordsClientPage />;
}
