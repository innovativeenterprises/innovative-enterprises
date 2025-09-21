
'use client';

import CfoDashboardPageClient from './cfo-dashboard';
import type { CfoData } from '@/lib/cfo-data.schema';

export default function CfoDashboardClientPage({ initialData }: { initialData: CfoData }) {
    return <CfoDashboardPageClient initialData={initialData} />;
}
