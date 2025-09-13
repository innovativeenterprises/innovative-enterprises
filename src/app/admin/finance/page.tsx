
'use client';

import InvestorTable from "../investor-table";
import { useInvestorsData, setInvestors } from "@/hooks/use-global-store-data";
import CfoDashboard from "../cfo-dashboard";

export default function AdminFinancePage() {
  const { investors, isClient } = useInvestorsData();

  return (
    <div className="space-y-8">
        <CfoDashboard />
        <InvestorTable investors={investors} setInvestors={setInvestors} isClient={isClient} />
    </div>
  );
}
