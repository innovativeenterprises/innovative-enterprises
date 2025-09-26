'use server';

import HadeeyaAdminClientPage from './client-page';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Hadeeya Gift Cards",
  description: "Monitor and manage all issued digital gift cards.",
};


export default async function HadeeyaAdminPage() {
    // Data is fetched and loaded into the global store in the root layout.
    // The client component will access it from there.
    return <HadeeyaAdminClientPage />;
}
