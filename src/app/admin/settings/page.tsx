

'use server';
import AdminSettingsClientPage from './client-page';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: "Settings",
    description: "Manage core application settings, pricing, market rates, and theme configurations."
};

export default function AdminSettingsPage() {
    return <AdminSettingsClientPage />;
}
