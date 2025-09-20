
'use server';

import CfoDashboardPageClient from './client-page';
import type { Metadata } from 'next';
import { getDoc } from '@/lib/firestore';

export const metadata: Metadata = {
  title: "CFO Dashboard",
  description: "Financial overview and analysis for your business operations."
};

export default async function CfoDashboardPage() {
    // Fetch data on the server
    const cfoData = await getDoc('cfo/dashboard');

    // Pass data as props to the client component
    return <CfoDashboardPageClient initialCfoData={cfoData} />;
}
