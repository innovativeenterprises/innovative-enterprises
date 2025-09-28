'use client';

import StudentRecordsClientPage from './client-page';


export default function StudentRecordsPage() {
    // The client component now fetches its own data from the global store.
    return <StudentRecordsClientPage />;
}
