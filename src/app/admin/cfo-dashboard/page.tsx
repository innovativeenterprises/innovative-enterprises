
import CfoDashboardClient from './client-page';
import type { Metadata } from 'next';
import { getKpiData, getTransactionData, getUpcomingPayments, getVatPayment, getCashFlowData, getInvestors } from '@/lib/firestore';

export const metadata: Metadata = {
  title: "CFO Dashboard",
  description: "Financial overview and analysis of the business operations.",
};


export default async function CfoDashboardPage() {
    const [kpiData, transactionData, upcomingPayments, vatPayment, cashFlowData, investors] = await Promise.all([
        getKpiData(),
        getTransactionData(),
        getUpcomingPayments(),
        getVatPayment(),
        getCashFlowData(),
        getInvestors(),
    ]);

    const cfoData = {
        kpiData,
        transactionData,
        upcomingPayments,
        vatPayment,
        cashFlowData,
        investors,
    };
    return <CfoDashboardClient cfoData={cfoData} />;
}
