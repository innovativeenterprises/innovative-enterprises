'use client';

import StudentRecordsClientPage from './client-page';
import { useStudentsData } from '@/hooks/use-global-store-data';

export default function StudentRecordsPage() {
    const { students, isClient } = useStudentsData();
    // This component now directly fetches data, so initialStudents is no longer needed as a prop
    return <StudentRecordsClientPage initialStudents={students} />;
}
