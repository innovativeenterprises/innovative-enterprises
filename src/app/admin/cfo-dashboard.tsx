import CfoDashboardClient from './cfo-dashboard-client';
import { kpiData, transactionData, upcomingPayments, vatPayment, cashFlowData } from '@/lib/cfo-data';

export default function CfoDashboard() {
  const cfoData = {
    kpiData,
    transactionData,
    upcomingPayments,
    vatPayment,
    cashFlowData,
  };
  return <CfoDashboardClient initialCfoData={cfoData} />;
}
