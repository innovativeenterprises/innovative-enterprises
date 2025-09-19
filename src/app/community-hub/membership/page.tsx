'use client';

import MembershipClientPage from './client-page';
import { useMembersData } from '@/hooks/use-global-store-data';

export default function MembershipPage() {
    const { members } = useMembersData();
    return <MembershipClientPage initialMembers={members} />;
}
