'use client';

import DriveSyncAiPage from './client-page';
import { useRentalAgenciesData, useCarsData } from '@/hooks/use-global-store-data';

export default function DriveSyncPage() {
    const { rentalAgencies } = useRentalAgenciesData();
    const { cars } = useCarsData();
    return <DriveSyncAiPage initialAgencies={rentalAgencies} initialCars={cars} />;
}
