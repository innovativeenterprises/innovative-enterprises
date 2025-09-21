
'use server';

import DriveSyncClientPage from './client-page';
import { getRentalAgencies, getCars } from '@/lib/firestore';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: "DriveSync AI | Car Rental Management",
    description: "An AI-powered SaaS platform for car rental agencies, featuring an intelligent booking agent and real-time fleet management.",
};

export default async function DriveSyncAiPage() {
    const [agencies, cars] = await Promise.all([
        getRentalAgencies(),
        getCars(),
    ]);
    return <DriveSyncClientPage initialAgencies={agencies} initialCars={cars} />;
}
