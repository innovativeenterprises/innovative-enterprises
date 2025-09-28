'use client';

import { DollarSign } from 'lucide-react';
import CfoPageClient from '@/app/cfo/client-page';

export default function CfoDashboardPage() {
    return (
        <div className="space-y-8">
            <div className="flex items-center gap-3">
                 <DollarSign className="h-8 w-8"/>
                 <div>
                    <h1 className="text-3xl font-bold">CFO Dashboard</h1>
                    <p className="text-muted-foreground">
                        A real-time overview of the company's financial health.
                    </p>
                </div>
            </div>
             <CfoPageClient />
        </div>
    );
}
