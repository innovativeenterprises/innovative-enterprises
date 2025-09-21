
'use server';

import AdminSettingsClientPage from './client-page';
import { getSettings } from '@/lib/firestore';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Settings | Innovative Enterprises",
  description: "Manage core operational settings for your application.",
};

export default async function AdminSettingsPage() {
    const settings = await getSettings();
    return <AdminSettingsClientPage initialSettings={settings} />;
}
