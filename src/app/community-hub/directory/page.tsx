
import MemberDirectoryClient from './client-page';
import type { Metadata } from 'next';
import { getCommunityMembers } from '@/lib/firestore';

export const metadata: Metadata = {
    title: "Community Directory",
    description: "Connect with fellow members of your community.",
};

export default async function MemberDirectoryPage() {
    const members = await getCommunityMembers();
    return <MemberDirectoryClient initialMembers={members} />;
}
