
import MembershipClientPage from './client-page';
import type { Metadata } from 'next';
import { getCommunityMembers } from '@/lib/firestore';

export const metadata: Metadata = {
    title: "Membership Management",
    description: "A central dashboard for managing all members of your community.",
};

export default async function MembershipPage() {
    const members = await getCommunityMembers();
    return <MembershipClientPage initialMembers={members} />;
}
