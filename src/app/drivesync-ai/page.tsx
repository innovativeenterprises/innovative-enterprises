
'use server';

import { getRentalAgencies, getCars } from '@/lib/firestore';
import type { Metadata } from 'next';
import DriveSyncClientPage from './client-page';

export const metadata: Metadata = {
    title: "DriveSync AI | Car Rental Management",
    description: "An AI-powered SaaS platform for car rental agencies, featuring an intelligent booking agent and real-time fleet management.",
};

export default async function DriveSyncAiPage() {
    // Data is fetched to ensure it's in the initial global store state.
    await Promise.all([
        getRentalAgencies(),
        getCars(),
    ]);
    return <DriveSyncClientPage />;
}
