'use client';

import type { Metadata } from 'next';
import StudentRecordsClientPage from './client-page';
import { useStudentsData } from '@/hooks/use-data-hooks';

export const metadata: Metadata = {
  title: "Admin - Student Records",
  description: "A central database for managing all student profiles and academic records.",
};


export default function StudentRecordsPage() {
    const { data: students } = useStudentsData();
    return <StudentRecordsClientPage initialStudents={students} />;
}