
'use client';

import { Car } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "DriveSync AI | Innovative Enterprises",
  description: "An AI-powered SaaS platform for car rental agencies, featuring an intelligent booking agent and a comprehensive fleet management dashboard.",
};

export default function DriveSyncAiPage() {
    return (
        <div className="bg-background min-h-screen">
             <div className="container mx-auto px-4 py-16">
                <div className="max-w-4xl mx-auto text-center">
                     <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit mb-4">
                        <Car className="w-12 h-12 text-primary" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold text-primary">DriveSync AI</h1>
                    <p className="mt-4 text-lg text-muted-foreground">
                        Coming Soon: An AI-powered SaaS platform for car rental agencies, featuring an intelligent booking agent and a comprehensive fleet management dashboard.
                    </p>
                </div>
            </div>
        </div>
    )
}
