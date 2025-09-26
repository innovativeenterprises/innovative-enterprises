
'use client';

import MembershipClientPage from '@/app/community-hub/membership/client-page';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: "Membership Management",
    description: "A central database for managing all members of your community.",
};

export default function MembershipPage() {
    return <MembershipClientPage />;
}
