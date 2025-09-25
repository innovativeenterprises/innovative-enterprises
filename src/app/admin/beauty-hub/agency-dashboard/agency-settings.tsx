
'use client';

import { AgencySettings as GenericAgencySettings } from '@/components/agency-settings';
import type { BeautyCenter } from "@/lib/beauty-centers.schema";
import { useBeautyCentersData } from '@/hooks/use-data-hooks';

export function AgencySettings({ agency }: { agency: BeautyCenter }) {
    const { setData: setBeautyCenters } = useBeautyCentersData();

    return (
        <GenericAgencySettings
            agency={agency}
            setAgencies={setBeautyCenters as any} // Cast to satisfy the generic type
        />
    )
}
