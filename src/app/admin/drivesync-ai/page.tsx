

'use server';

import { getRentalAgencies, getCars } from '@/lib/firestore';
import type { Metadata } from 'next';
import DriveSyncClientPage from './client-page';

export const metadata: Metadata = {
    title: "Admin - DriveSync AI | Car Rental Management",
    description: "An AI-powered SaaS platform for car rental agencies, featuring an intelligent booking agent and real-time fleet management.",
};

export default async function DriveSyncAiPage() {
    const [agencies, cars] = await Promise.all([
        getRentalAgencies(),
        getCars(),
    ]);
    return <DriveSyncClientPage initialAgencies={agencies} initialCars={cars} />;
}
