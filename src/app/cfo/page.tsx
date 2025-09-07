
'use client';

import { useState, useEffect } from 'react';
import CfoDashboard from "./cfo-dashboard";
import { Skeleton } from '@/components/ui/skeleton';


export default function CfoPage() {
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    if (!isClient) {
        return (
             <div className="space-y-8">
                <Skeleton className="h-12 w-1/3" />
                <Skeleton className="h-5 w-2/3" />
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
                    {Array.from({length: 6}).map((_, index) => <Skeleton key={index} className="h-[109px] w-full" />)}
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                    <Skeleton className="lg:col-span-3 h-[400px]" />
                    <div className="lg:col-span-2 space-y-8">
                        <Skeleton className="h-[200px]" />
                        <Skeleton className="h-[150px]" />
                    </div>
                </div>
            </div>
        )
    }
    
    return <CfoDashboard />;
}
