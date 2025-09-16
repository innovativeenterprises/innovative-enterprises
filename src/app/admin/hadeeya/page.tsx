
import HadeeyaAdminPageClient from './client-page';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: "Hadeeya Gift Card Management",
    description: "Monitor and manage all generated digital gift cards.",
};

export default function HadeeyaAdminPage() {
    return <HadeeyaAdminPageClient />;
}
