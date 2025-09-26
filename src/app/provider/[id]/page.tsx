
'use client';

import { notFound, useParams } from 'next/navigation';
import { useProvidersData } from '@/hooks/use-data-hooks';
import { useEffect, useState } from 'react';
import type { Provider } from '@/lib/providers.schema';
import { Skeleton } from '@/components/ui/skeleton';
import ProviderProfileClientPage from './client-page';

export default function ProviderProfilePage() {
    const params = useParams();
    const { id } = params;
    const { data: providers, isClient } = useProvidersData();
    const [provider, setProvider] = useState<Provider | undefined>(undefined);

    useEffect(() => {
        if (isClient && id) {
            const foundProvider = providers.find(p => p.id === id);
            if (foundProvider) {
                setProvider(foundProvider);
            } else {
                notFound();
            }
        }
    }, [id, providers, isClient]);

    if (!isClient || !provider) {
        return (
            <div className="bg-background min-h-screen">
                <div className="container mx-auto py-16 px-4">
                    <div className="max-w-4xl mx-auto">
                        <Skeleton className="h-[400px] w-full" />
                    </div>
                </div>
            </div>
        );
    }
    
    return <ProviderProfileClientPage provider={provider} />;
}
