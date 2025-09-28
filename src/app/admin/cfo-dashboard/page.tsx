
'use client';

import CfoPageClient from '@/app/cfo/client-page';
import { DollarSign } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "CFO Dashboard",
  description: "Financial overview and analysis for your business operations.",
};

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
