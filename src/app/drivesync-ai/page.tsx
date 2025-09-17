
import { initialCars } from '@/lib/cars';
import { initialRentalAgencies } from '@/lib/rental-agencies';
import DriveSyncClientPage from './client-page';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "DriveSync AI | Car Rental Management",
  description: "An AI-powered SaaS platform for car rental agencies, featuring an intelligent booking agent, fleet management, and integration with IVMS for real-time tracking.",
};

export default function DriveSyncAiPage() {
    const cars = initialCars;
    const agencies = initialRentalAgencies;
    return <DriveSyncClientPage initialCars={cars} initialAgencies={agencies} />;
}
