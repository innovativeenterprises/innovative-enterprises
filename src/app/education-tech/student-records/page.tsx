
'use server';

import type { Metadata } from 'next';
import StudentRecordsClientPage from './client-page';
import { getStudents } from '@/lib/firestore';

export const metadata: Metadata = {
  title: "Admin - Student Records",
  description: "A central database for managing all student profiles and academic records.",
};


export default async function StudentRecordsPage() {
    const initialStudents = await getStudents();
    return <StudentRecordsClientPage initialStudents={initialStudents} />;
}
