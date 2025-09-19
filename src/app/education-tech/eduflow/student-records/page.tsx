'use client';

import StudentRecordsClientPage from './client-page';
import { useStudentsData } from '@/hooks/use-global-store-data';

export default function StudentRecordsPage() {
    const { students, isClient } = useStudentsData();
    return <StudentRecordsClientPage initialStudents={students} />;
}
