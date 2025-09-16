import CfoDashboardClient from './cfo-dashboard-client';
import type { Metadata } from 'next';
import { kpiData, transactionData, upcomingPayments, vatPayment, cashFlowData } from '@/lib/cfo-data';
import { initialInvestors } from '@/lib/investors';

export const metadata: Metadata = {
  title: "AI COO & CFO Dashboard",
  description: "JADE's real-time operational analysis and financial overview of the entire business ecosystem.",
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
