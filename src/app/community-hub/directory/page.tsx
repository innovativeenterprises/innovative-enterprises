'use client';

import MemberDirectoryClient from './client-page';
import { useMembersData } from '@/hooks/use-global-store-data';

export default function MemberDirectoryPage() {
    const { members, isClient } = useMembersData();
    return <MemberDirectoryClient initialMembers={isClient ? members : []} />;
}
