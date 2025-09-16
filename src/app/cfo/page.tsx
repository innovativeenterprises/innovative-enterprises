
import CfoDashboardClient from '@/app/cfo/cfo-dashboard-client';
import type { Metadata } from 'next';
import { kpiData, transactionData, upcomingPayments, vatPayment, cashFlowData } from '@/lib/cfo-data';
import { initialInvestors } from '@/lib/investors';

export const metadata: Metadata = {
  title: "AI CFO Dashboard | Finley",
  description: "Finley's real-time financial overview of the entire business ecosystem.",
};

export default function CooDashboardPage() {
    // In a real app, this data would be fetched from a database.
    const cfoData = {
        kpiData,
        transactionData,
        upcomingPayments,
        vatPayment,
        cashFlowData,
        investors: initialInvestors,
    };
    return <CfoDashboardClient initialCfoData={cfoData} />;
}
