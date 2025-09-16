import CfoDashboard from '../cfo-dashboard';
import type { Metadata } from 'next';
import { kpiData, transactionData, upcomingPayments, vatPayment, cashFlowData } from '@/lib/cfo-data';

export const metadata: Metadata = {
  title: "AI COO & CFO Dashboard",
  description: "JADE's real-time operational analysis and financial overview of the entire business ecosystem.",
};

export default function CooDashboardPage() {
    const cfoData = {
        kpiData,
        transactionData,
        upcomingPayments,
        vatPayment,
        cashFlowData,
    };
    return <CfoDashboard initialCfoData={cfoData} />;
}
