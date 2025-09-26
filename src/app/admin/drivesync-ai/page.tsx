
'use client';

import type { Metadata } from 'next';
import DriveSyncClientPage from '@/app/drivesync-ai/client-page';

export const metadata: Metadata = {
    title: "Admin - DriveSync AI | Car Rental Management",
    description: "An AI-powered SaaS platform for car rental agencies, featuring an intelligent booking agent and real-time fleet management.",
};

export default function DriveSyncAiPage() {
    return <DriveSyncClientPage />;
}
