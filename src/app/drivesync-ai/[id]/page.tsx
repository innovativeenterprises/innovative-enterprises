
'use client';

import { notFound, useParams } from 'next/navigation';
import type { Metadata } from 'next';
import { useCarsData } from '@/hooks/use-data-hooks';
import CarDetailClientPage from './client-page';
import { useEffect, useState } from 'react';
import type { Car } from '@/lib/cars.schema';

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  // Metadata generation in client components is not standard. 
  // This is a placeholder for what would be in a server component.
  return {
    title: 'Car Details'
  };
}

export default function CarDetailPage() {
    const params = useParams();
    const { id } = params;
    const { data: cars, isClient } = useCarsData();
    const [car, setCar] = useState<Car | undefined>();

    useEffect(() => {
        if (isClient) {
            const foundCar = cars.find(c => c.id === id);
            if (foundCar) {
                setCar(foundCar);
            } else {
                notFound();
            }
        }
    }, [id, cars, isClient]);

    if (!car) {
        return <div>Loading car details...</div>; // Or a skeleton loader
    }
    
    return <CarDetailClientPage car={car} />;
}
