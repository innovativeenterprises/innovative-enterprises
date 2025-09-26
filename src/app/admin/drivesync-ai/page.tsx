

'use server';

import type { Metadata } from 'next';
import DriveSyncClientPage from './client-page';

export const metadata: Metadata = {
    title: "Admin - DriveSync AI | Car Rental Management",
    description: "An AI-powered SaaS platform for car rental agencies, featuring an intelligent booking agent and real-time fleet management.",
};

export default async function DriveSyncAiPage() {
    return <DriveSyncClientPage />;
}
