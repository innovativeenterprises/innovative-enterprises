
'use server';

import { DollarSign } from "lucide-react";
import EventsFinanceClientPage from "./client-page";
import { getCommunities, getCommunityEvents, getCommunityFinances } from "@/lib/firestore";
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Community Events & Financials",
  description: "Manage your community's events and track its financial health.",
};


export default async function EventsFinancePage() {
    const [communities, events, finances] = await Promise.all([
        getCommunities(),
        getCommunityEvents(),
        getCommunityFinances(),
    ]);

    return (
        <EventsFinanceClientPage 
            initialCommunities={communities}
            initialEvents={events}
            initialFinances={finances}
        />
    )
}
