
'use server';

import CommunitiesAdminClientPage from './client-page';
import { getMembers, getCommunities } from '@/lib/firestore';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Community Membership",
  description: "A central database for managing all members of your registered communities.",
};


export default async function CommunitiesAdminPage() {
    const [members, communities] = await Promise.all([
        getMembers(),
        getCommunities(),
    ]);
    return <CommunitiesAdminClientPage initialMembers={members} initialCommunities={communities} />;
}

