
'use server';

import type { Metadata } from 'next';
import { getProducts, getStages } from '@/lib/firestore';
import { KanbanBoard } from '@/components/kanban-board';
import { Search } from 'lucide-react';

export const metadata: Metadata = {
    title: "ClientView Portal",
    description: "Track the live status of your projects."
};

export default async function ClientPortalPage() {
    const [products, stages] = await Promise.all([
        getProducts(),
        getStages(),
    ]);

    return (
        <div className="bg-background min-h-screen">
            <div className="container mx-auto px-4 py-16">
                <div className="max-w-4xl mx-auto text-center mb-12">
                    <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit mb-4">
                        <Search className="w-10 h-10 text-primary" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold text-primary">ClientView Portal</h1>
                    <p className="mt-4 text-lg text-muted-foreground">
                        A real-time overview of your project's development lifecycle.
                    </p>
                </div>
                <div className="pointer-events-none">
                    <KanbanBoard 
                        initialProducts={products} 
                        initialStages={stages}
                        readOnly={true}
                    />
                </div>
            </div>
        </div>
    )
}
