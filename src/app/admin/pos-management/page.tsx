
'use server';

import type { Metadata } from 'next';
import { getPosProducts } from '@/lib/firestore';
import PosProductTable from '../pos-product-table';

export const metadata: Metadata = {
    title: "AI-POS Management",
    description: "Manage products for the AI Point-of-Sale system."
};

export default async function PosManagementPage() {
    const posProducts = await getPosProducts();

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold">AI-POS Management</h1>
                <p className="text-muted-foreground">Manage products for the AI Point-of-Sale system.</p>
            </div>
            <PosProductTable initialProducts={posProducts} />
        </div>
    )
}
