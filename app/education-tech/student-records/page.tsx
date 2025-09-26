
'use server';

import type { Metadata } from 'next';
import StudentRecordsClientPage from './client-page';

export const metadata: Metadata = {
  title: "Admin - Student Records",
  description: "A central database for managing all student profiles and academic records.",
};


export default async function StudentRecordsPage() {
    // The client component now fetches its own data from the global store.
    return <StudentRecordsClientPage />;
}

    