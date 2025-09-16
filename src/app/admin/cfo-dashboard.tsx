import { kpiData, transactionData, upcomingPayments, vatPayment, cashFlowData } from '@/lib/cfo-data';
import CfoDashboardClient from './cfo-dashboard-client';

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
