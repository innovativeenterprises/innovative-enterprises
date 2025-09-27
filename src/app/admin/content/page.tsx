import AdminContentClientPage from './client-page';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: "Site Content Management",
    description: "Manage your public-facing services, products, clients, and pricing."
};


export default function AdminContentPage() {
    return (
        <AdminContentClientPage />
    );
}
