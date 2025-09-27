
'use server';

import type { Metadata } from 'next';
import DriveSyncClientPage from './client-page';
import { getCars, getRentalAgencies } from '@/lib/firestore';

export const metadata: Metadata = {
    title: "DriveSync AI | Car Rental Management",
    description: "An AI-powered SaaS platform for car rental agencies, featuring an intelligent booking agent and real-time fleet management.",
};

export default async function DriveSyncAiPage() {
    const cars = await getCars();
    const agencies = await getRentalAgencies();
    return <DriveSyncClientPage initialCars={cars} initialAgencies={agencies} />;
}
