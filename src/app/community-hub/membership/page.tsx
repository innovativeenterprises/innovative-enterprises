

import MembershipClientPage from './client-page';
import type { Metadata } from 'next';
import { initialMembers } from '@/lib/community-members';

export const metadata: Metadata = {
    title: "Membership Management",
    description: "A central dashboard for managing all members of your community.",
};

export default function MembershipPage() {
    return <MembershipClientPage initialMembers={initialMembers} />;
}
