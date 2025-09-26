

'use client';

import { notFound, useParams } from 'next/navigation';
import { useCarsData } from '@/hooks/use-data-hooks';
import CarDetailClientPage from './client-page';
import { useEffect, useState } from 'react';
import type { Car } from '@/lib/cars.schema';
import { Skeleton } from '@/components/ui/skeleton';

export default function CarDetailPage() {
    const params = useParams();
    const { id } = params;
    const { data: cars, isClient } = useCarsData();
    const [car, setCar] = useState<Car | undefined>(undefined);

    useEffect(() => {
        if (isClient && id) {
            const foundCar = cars.find(c => c.id === id);
            if (foundCar) {
                setCar(foundCar);
            } else {
                notFound();
            }
        }
    }, [id, cars, isClient]);

    if (!isClient || !car) {
        return (
             <div className="bg-muted/20 min-h-screen">
                <div className="container mx-auto px-4 py-16">
                    <div className="max-w-5xl mx-auto">
                        <Skeleton className="h-10 w-40 mb-8" />
                        <Skeleton className="h-[600px] w-full" />
                    </div>
                </div>
            </div>
        )
    }
    
    return <CarDetailClientPage car={car} />;
}
