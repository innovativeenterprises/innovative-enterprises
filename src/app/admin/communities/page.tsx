
'use server';

import CommunitiesAdminClientPage from './client-page';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Community Membership",
  description: "A central database for managing all members of your registered communities.",
};


export default async function CommunitiesAdminPage() {
    // The client component will now fetch data from the global store,
    // which is populated on initial load in the root layout.
    // No need to fetch or pass props here.
    return <CommunitiesAdminClientPage />;
}
