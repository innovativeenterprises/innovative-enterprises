
import EventsFinanceClient from './client-page';
import type { Metadata } from 'next';
import { getCommunities, getCommunityEvents, getCommunityFinances } from '@/lib/firestore';

export const metadata: Metadata = {
    title: "Events & Financials",
    description: "Manage your community's events and track its financial health.",
};

export default async function EventsFinancePage() {
    const [communities, events, finances] = await Promise.all([
        getCommunities(),
        getCommunityEvents(),
        getCommunityFinances(),
    ]);

    return <EventsFinanceClient 
        initialCommunities={communities}
        initialEvents={events}
        initialFinances={finances}
    />;
}
