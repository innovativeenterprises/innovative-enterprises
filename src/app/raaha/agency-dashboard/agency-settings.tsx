
'use client';

import { AgencySettings as GenericAgencySettings } from '@/components/agency-settings';
import type { Agency as RaahaAgency } from "@/lib/raaha-agencies.schema";
import { useAgenciesData } from '@/hooks/use-data-hooks';

export function AgencySettings({ agency }: { agency: RaahaAgency }) {
    const { setData: setAgencies } = useAgenciesData();

    return (
        <GenericAgencySettings
            agency={agency}
            setAgencies={setAgencies as any} // Cast to satisfy the generic type
        />
    )
}
