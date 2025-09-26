'use client';

import { AgencySettings as GenericAgencySettings } from '@/components/agency-dashboard/agency-settings';
import type { BeautyCenter } from "@/lib/beauty-centers.schema";
import { useBeautyCentersData } from '@/hooks/use-data-hooks';

export function AgencySettings({ agency }: { agency: BeautyCenter }) {
    const { setData: setAgencies } = useBeautyCentersData();

    return (
        <GenericAgencySettings
            agency={agency}
            setAgencies={setAgencies as any} // Cast to satisfy the generic type
            dashboardType="beauty"
        />
    )
}
