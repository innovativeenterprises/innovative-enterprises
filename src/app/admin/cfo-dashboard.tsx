import CfoDashboardClient from './cfo-dashboard-client';
import type { KpiData, TransactionData, UpcomingPayment, VatPayment, CashFlowData } from '@/lib/cfo-data';

interface CfoData {
  kpiData: KpiData[];
  transactionData: TransactionData[];
  upcomingPayments: UpcomingPayment[];
  vatPayment: VatPayment;
  cashFlowData: CashFlowData[];
}

export default function CfoDashboard({ initialCfoData }: { initialCfoData: CfoData }) {
  return <CfoDashboardClient initialCfoData={initialCfoData} />;
}
