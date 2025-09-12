
'use client';

import InvestorTable from "../investor-table";
import { useInvestorsData } from "@/hooks/use-global-store-data";
import CfoDashboard from "../cfo-dashboard";
import { useSyncExternalStore } from 'react';
import { store } from '@/lib/global-store';

export default function AdminFinancePage() {
  const investorData = useInvestorsData();
  const cfoData = useSyncExternalStore(store.subscribe, () => ({
    kpiData: store.get().kpiData,
    transactionData: store.get().transactionData,
    upcomingPayments: store.get().upcomingPayments,
    vatPayment: store.get().vatPayment,
  }), () => ({
    kpiData: [],
    transactionData: [],
    upcomingPayments: [],
    vatPayment: { amount: 0, dueDate: '' },
  }));

  return (
    <div className="space-y-8">
        <CfoDashboard {...cfoData}/>
        <InvestorTable {...investorData} />
    </div>
  );
}
