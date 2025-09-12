
'use client';

import InvestorTable from "../investor-table";
import { useInvestorsData } from "@/hooks/use-global-store-data";
import CfoDashboard from "../cfo-dashboard";

export default function AdminFinancePage() {
  const investorData = useInvestorsData();

  return (
    <div className="space-y-8">
        <CfoDashboard />
        <InvestorTable {...investorData} />
    </div>
  );
}
