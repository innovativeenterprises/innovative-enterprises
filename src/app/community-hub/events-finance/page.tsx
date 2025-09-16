
import EventsFinanceClient from './client-page';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: "Events & Financials",
    description: "Manage your community's events and track its financial health.",
};

export default function EventsFinancePage() {
    return <EventsFinanceClient />;
}
