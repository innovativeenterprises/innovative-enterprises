import { getPricing } from '@/lib/firestore';
import AdminOperationsClientPage from './client-page';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: "Operations | Admin Dashboard",
    description: "A suite of internal AI tools and configurations to enhance business operations.",
};

export default async function AdminOperationsPage() {
    // Data fetching for knowledge base and cost settings is now handled
    // client-side via hooks within their respective components.
    // We only need to pass data that is still managed via server props.
    const initialPricing = await getPricing();

    return (
        <AdminOperationsClientPage 
            initialPricing={initialPricing}
        />
    );
}
