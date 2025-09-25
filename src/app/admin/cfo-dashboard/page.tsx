
'use server';

import CfoDashboardPageClient from './client-page';
import type { Metadata } from 'next';
import { getCfoData } from '@/lib/firestore';

export const metadata: Metadata = {
  title: "CFO Dashboard",
  description: "Financial overview and analysis for your business operations."
};

export default async function CfoDashboardPage() {
    const cfoData = await getCfoData();

    if (!cfoData) {
        return <div>Loading financial data...</div>;
    }
    
    return <CfoDashboardPageClient initialData={cfoData} />;
}
