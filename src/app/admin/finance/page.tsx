
'use client';

import { useEffect, useState } from 'react';
import InvestorTable from "../investor-table";
import { useInvestorsData } from "@/hooks/use-global-store-data";
import CfoDashboard from "../cfo-dashboard";

export default function AdminFinancePage() {
  const investorData = useInvestorsData();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);


  return (
    <div className="space-y-8">
        <CfoDashboard isClient={isClient} />
        <InvestorTable {...investorData} isClient={isClient} />
    </div>
  );
}
