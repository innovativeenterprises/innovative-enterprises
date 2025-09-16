
import MemberDirectoryClient from './client-page';
import type { Metadata } from 'next';
import { initialMembers } from '@/lib/community-members';

export const metadata: Metadata = {
    title: "Community Directory",
    description: "Connect with fellow members of your community.",
};

export default function MemberDirectoryPage() {
    return <MemberDirectoryClient initialMembers={initialMembers} />;
}
