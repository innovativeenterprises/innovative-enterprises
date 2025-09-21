
'use server';

import CommunitiesAdminPageClient from './client-page';
import { getMembers } from '@/lib/firestore';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Community Membership",
  description: "A central database for managing all members of your registered communities.",
};


export default async function CommunitiesAdminPage() {
    const members = await getMembers();
    return <CommunitiesAdminPageClient initialMembers={members} />;
}
