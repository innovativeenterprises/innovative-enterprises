import CfoDashboard from '@/app/admin/cfo-dashboard';
import type { Metadata } from 'next';
import { kpiData, transactionData, upcomingPayments, vatPayment, cashFlowData } from '@/lib/cfo-data';
import { initialInvestors } from '@/lib/investors';

export const metadata: Metadata = {
  title: "CFO Dashboard",
  description: "Financial overview and analysis of the business operations.",
};


export default function CfoDashboardPage() {
    // In a real app, this data would be fetched from a database or API.
    // For this prototype, we are fetching it on the server from static files.
    const cfoData = {
        kpiData,
        transactionData,
        upcomingPayments,
        vatPayment,
        cashFlowData,
        investors: initialInvestors,
    };
    return <CfoDashboard cfoData={cfoData} />;
}
