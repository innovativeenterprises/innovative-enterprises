
'use client';

import StudentHousingClientPage from '@/app/real-estate-tech/student-housing/client-page';
import { useLeasesData } from '@/hooks/use-global-store-data';

export default function AdminStudentHousingPage() {
    const { leases, isClient } = useLeasesData();

    if (!isClient) {
        return <div>Loading...</div>; // Or a skeleton loader
    }

    return <StudentHousingClientPage initialLeases={leases} />;
}
