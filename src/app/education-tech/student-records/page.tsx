'use server';

import type { Metadata } from 'next';
import StudentRecordsClientPage from './client-page';

export const metadata: Metadata = {
  title: "Student Records | EduFlow Suite",
  description: "A central database for managing all student profiles and academic records.",
};


export default async function StudentRecordsPage() {
    return <StudentRecordsClientPage />;
}
