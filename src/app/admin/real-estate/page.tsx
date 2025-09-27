import type { Metadata } from 'next';
import AdminRealEstateClientPage from './client-page';

export const metadata: Metadata = {
    title: "Real Estate Management",
    description: "Manage property listings and utilize real estate AI tools."
};

export default function AdminRealEstatePage() {
    return (
        <AdminRealEstateClientPage />
    );
}
