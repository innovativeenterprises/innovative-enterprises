'use client';

import StudentHousingClientPage from './client-page';
import { useLeasesData } from '@/hooks/use-global-store-data';

export default function StudentHousingPage() {
    const { leases } = useLeasesData();
    return <StudentHousingClientPage initialLeases={leases} />;
}
