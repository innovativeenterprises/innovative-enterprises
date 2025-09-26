
'use client';

import { AgencySettings as GenericAgencySettings } from '@/components/agency-dashboard/agency-settings';
import type { Agency as RaahaAgency } from "@/lib/raaha-agencies.schema";

export function AgencySettings({ agency }: { agency: RaahaAgency }) {
    return (
        <GenericAgencySettings
            agency={agency}
            dashboardType="raaha"
        />
    )
}
