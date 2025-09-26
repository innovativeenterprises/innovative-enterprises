
'use client';

import { AgencySettings as GenericAgencySettings } from '@/components/agency-dashboard/agency-settings';
import type { BeautyCenter } from "@/lib/beauty-centers.schema";

export function AgencySettings({ agency }: { agency: BeautyCenter }) {
    return (
        <GenericAgencySettings
            agency={agency}
            dashboardType="beauty"
        />
    )
}
