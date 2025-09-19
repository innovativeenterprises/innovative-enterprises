'use client';

import EventsFinanceClient from './client-page';
import { useCommunitiesData, useEventsData, useCommunityFinancesData } from '@/hooks/use-global-store-data';

export default function EventsFinancePage() {
    const { communities } = useCommunitiesData();
    const { events } = useEventsData();
    const { finances } = useCommunityFinancesData();

    return <EventsFinanceClient 
        initialCommunities={communities}
        initialEvents={events}
        initialFinances={finances}
    />;
}
