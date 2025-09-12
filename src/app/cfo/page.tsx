
'use client';

import CfoDashboard from "../admin/cfo-dashboard";
import { useSyncExternalStore } from 'react';
import { store } from '@/lib/global-store';


export default function CfoPage() {
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
    <div className="bg-muted/30 min-h-screen">
      <div className="container mx-auto px-4 py-16">
        <CfoDashboard {...cfoData} />
      </div>
    </div>
  );
}
