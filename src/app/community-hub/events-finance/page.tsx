

import EventsFinanceClient from './client-page';
import type { Metadata } from 'next';
import { initialCommunities } from '@/lib/communities';
import { initialEvents } from '@/lib/community-events';
import { initialFinances } from '@/lib/community-finances';

export const metadata: Metadata = {
    title: "Events & Financials",
    description: "Manage your community's events and track its financial health.",
};

export default function EventsFinancePage() {
    return <EventsFinanceClient 
        initialCommunities={initialCommunities}
        initialEvents={initialEvents}
        initialFinances={initialFinances}
    />;
}
