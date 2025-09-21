
'use server';

import MembershipClientPage from './client-page';
import { getMembers } from '@/lib/firestore';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: "Membership Management",
    description: "A central database for managing all members of your community.",
};

export default async function MembershipPage() {
    const members = await getMembers();
    return <MembershipClientPage initialMembers={members} />;
}
