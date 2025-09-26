
'use server';

import type { Metadata } from 'next';
import { getStudents } from '@/lib/firestore';
import StudentRecordsClientPage from './client-page';

export const metadata: Metadata = {
  title: "Admin - Student Records",
  description: "A central database for managing all student profiles and academic records.",
};


export default async function StudentRecordsPage() {
    await getStudents(); // Pre-populate global store
    return <StudentRecordsClientPage />;
}
