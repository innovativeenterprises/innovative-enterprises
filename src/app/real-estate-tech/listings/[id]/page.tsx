'use client';

import { notFound, useParams } from 'next/navigation';
import { usePropertiesData } from '@/hooks/use-data-hooks';
import { useEffect, useState } from 'react';
import type { Property } from '@/lib/properties.schema';
import { Skeleton } from '@/components/ui/skeleton';
import PropertyDetailClientPage from './client-page';

export default function PropertyDetailPage() {
    const params = useParams();
    const { id } = params;
    const { data: properties, isClient } = usePropertiesData();
    const [property, setProperty] = useState<Property | undefined>(undefined);

    useEffect(() => {
        if (isClient && id) {
            const foundProperty = properties.find(p => p.id === id);
            if (foundProperty) {
                setProperty(foundProperty);
            } else {
                notFound();
            }
        }
    }, [id, properties, isClient]);

    if (!isClient || !property) {
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
    
    return <PropertyDetailClientPage property={property} />;
}
