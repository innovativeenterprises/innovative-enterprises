
import MemberDirectoryClient from './client-page';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: "Community Directory",
    description: "Connect with fellow members of your community.",
};

export default function MemberDirectoryPage() {
    return <MemberDirectoryClient />;
}
