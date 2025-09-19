'use client';

import GuardianAiClientPage from './client-page';
import { useStudentsData } from '@/hooks/use-global-store-data';

export default function GuardianAiPage() {
    const { students, isClient } = useStudentsData();
    return <GuardianAiClientPage initialStudents={students} />;
}
