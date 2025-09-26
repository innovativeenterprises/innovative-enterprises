
'use client';

import EventsFinanceClientPage from "./client-page";
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Community Events & Financials",
  description: "Manage your community's events and track its financial health.",
};


export default function EventsFinancePage() {
    return <EventsFinanceClientPage />;
}

